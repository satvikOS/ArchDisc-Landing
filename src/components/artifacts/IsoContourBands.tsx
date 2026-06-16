"use client";

import { useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import {
  clamp,
  cssVar,
  lerp,
  mulberry32,
  useCanvas2D,
  type Pt,
} from "@/lib/artkit";
import { cn } from "@/lib/utils";

/* ============================================================
   IsoContourBands — a topographic / thermal contour plate.
   A smooth sum-of-gaussians scalar field is quantized into N
   greyscale VALUE bands (paper → ink-mid, never color) and
   overlaid with marching-squares iso-lines in line-strong, plus
   a few mono spot-labels. The "real fields, real math" register
   rendered as an engineering contour map, not a rainbow heatmap.

   Monochrome only: every fill/stroke is read from a CSS token via
   cssVar(), so the dark/inverted variant just paints paper-colored
   strokes on the ink field — no hardcoded hex anywhere.

   @prop variant   "plate"  — foreground contour plate, iso-lines
                              draw on outermost→innermost once then
                              hold (default).
                   "substrate" — ultra-faint background field that
                              is permitted a very slow ambient drift
                              (tiny phase on the gaussian centers,
                              amplitude ≤ 0.04), reduced-motion gated
                              and paused off-screen by useCanvas2D.
   @prop bands     number of value bands / iso thresholds (default 7).
   @prop seed      deterministic RNG seed for the gaussian field.
   @prop bumps     how many gaussian peaks compose the field (2–3).
   @prop labeled   draw mono spot-labels on contours (default true,
                              forced off on the substrate variant).
   @prop inverted  paint for the dark field (paper-colored marks).
   @prop className sizing hint; the canvas fills its parent box.
   ============================================================ */

type Variant = "plate" | "substrate";

type Bump = { cx: number; cy: number; sigma: number; amp: number };

const ISO_DURATION = 1100;

export function IsoContourBands({
  variant = "plate",
  bands = 7,
  seed = 7,
  bumps = 3,
  labeled = true,
  inverted = false,
  className,
}: {
  variant?: Variant;
  bands?: number;
  seed?: number;
  bumps?: number;
  labeled?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  const ambient = variant === "substrate" && !reduce;
  const showLabels = labeled && variant === "plate";

  // Field is authored in a fixed normalized 0..1 unit square so it is
  // resolution-independent; the draw() maps it onto the live canvas box.
  const peaks = useMemo<Bump[]>(() => {
    const rng = mulberry32(seed);
    const n = clamp(Math.round(bumps), 2, 3);
    const out: Bump[] = [];
    for (let i = 0; i < n; i++) {
      out.push({
        cx: lerp(0.2, 0.8, rng()),
        cy: lerp(0.22, 0.78, rng()),
        sigma: lerp(0.16, 0.3, rng()),
        amp: lerp(0.72, 1, rng()),
      });
    }
    return out;
  }, [seed, bumps]);

  useCanvas2D(
    ref,
    (ctx, w, h, p) => {
      const N = Math.max(3, Math.round(bands));

      // ---- token colors (monochrome, read once per paint) ----
      const lo = cssVar(inverted ? "--color-ink" : "--color-paper") || "#fafafa";
      const hi = cssVar(inverted ? "--color-paper" : "--color-ink-mid") || "#4a4f58";
      const lineStrong =
        cssVar("--color-line-strong") || (inverted ? "#3a3f48" : "#dcdce0");
      const muted = cssVar("--color-muted") || "#6a7079";
      const rgbLo = parseColor(lo);
      const rgbHi = parseColor(hi);

      // ---- sampling grid (~6px coarse cell, capped for cheapness) ----
      const cell = variant === "substrate" ? 9 : 6;
      const cols = Math.max(2, Math.ceil(w / cell) + 1);
      const rows = Math.max(2, Math.ceil(h / cell) + 1);
      const sx = w / (cols - 1);
      const sy = h / (rows - 1);

      // Ambient: a tiny reduced-amplitude phase drift on the centers.
      // For the plate variant `p` is the draw-on ramp and does not move the
      // field at all; for substrate, `p` is elapsed seconds.
      const drift = ambient ? p : 0;

      // ---- precompute the height field once per paint ----
      const field = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        const ny = j / (rows - 1);
        for (let i = 0; i < cols; i++) {
          const nx = i / (cols - 1);
          field[j * cols + i] = sampleField(peaks, nx, ny, drift);
        }
      }

      // ---- band fills: per coarse cell, value ladder paper→ink-mid ----
      // band/N scaled by 0.5 so the darkest band never reaches full ink;
      // the iso-lines stay the darkest mark on the plate.
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const v =
            (field[j * cols + i] +
              field[j * cols + i + 1] +
              field[(j + 1) * cols + i] +
              field[(j + 1) * cols + i + 1]) *
            0.25;
          const band = clamp(Math.floor(v * N), 0, N - 1);
          const t = (band / N) * 0.5;
          ctx.fillStyle = mix(rgbLo, rgbHi, t);
          // overdraw by 1px to avoid hairline seams between cells
          ctx.fillRect(i * sx, j * sy, sx + 1, sy + 1);
        }
      }

      // ---- iso-lines: marching-squares at each band threshold ----
      // Draw-on reveals thresholds outermost(low)→innermost(high) as p ramps.
      ctx.lineWidth = variant === "substrate" ? 1 : 1.25;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = lineStrong;
      if (variant === "substrate") ctx.globalAlpha = 0.5;

      const reveal = reduce || ambient ? 1 : p;
      for (let b = 1; b < N; b++) {
        const level = b / N;
        // outermost band (b=1) appears first; map its order to the ramp.
        const order = (b - 1) / Math.max(1, N - 1);
        if (order > reveal) break;
        // soft fade-in of the just-appearing threshold for a crisp draw feel
        const segs = marchingSquares(field, cols, rows, sx, sy, level);
        ctx.beginPath();
        for (const s of segs) {
          ctx.moveTo(s.a.x, s.a.y);
          ctx.lineTo(s.b.x, s.b.y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ---- mono spot-labels on contours ----
      if (showLabels && reveal >= 0.92) {
        const alpha = clamp((reveal - 0.92) / 0.08);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = muted;
        ctx.font =
          "11px var(--font-geist-mono), ui-monospace, SF Mono, monospace";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        // place labels on a couple of mid/high thresholds, picking a stable
        // point along each contour so they read as surveyed spot-heights.
        const picks = [
          { b: Math.max(1, Math.round(N * 0.45)), text: "+1.0" },
          { b: Math.max(2, Math.round(N * 0.7)), text: "+2.0" },
        ];
        for (const { b, text } of picks) {
          const level = b / N;
          const segs = marchingSquares(field, cols, rows, sx, sy, level);
          if (!segs.length) continue;
          // pick the segment whose midpoint is highest on screen for clarity
          let best = segs[0];
          let bestY = Infinity;
          for (const s of segs) {
            const my = (s.a.y + s.b.y) * 0.5;
            if (my < bestY) {
              bestY = my;
              best = s;
            }
          }
          const lx = clamp((best.a.x + best.b.x) * 0.5, 22, w - 22);
          const ly = clamp(bestY, 12, h - 12);
          // tiny tick + label, label-background knockout for legibility
          const tw = ctx.measureText(text).width + 8;
          ctx.globalAlpha = alpha * (inverted ? 0.85 : 0.92);
          ctx.fillStyle = lo;
          ctx.fillRect(lx - tw / 2, ly - 7, tw, 14);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = muted;
          ctx.fillText(text, lx, ly + 0.5);
        }
        ctx.globalAlpha = 1;
      }
    },
    {
      ambient,
      reducedMotion: reduce,
      duration: ISO_DURATION,
      deps: [variant, bands, seed, bumps, inverted, labeled, peaks, ambient, reduce],
    },
  );

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "block h-full w-full",
        inverted ? "text-paper" : "text-ink",
        className,
      )}
    />
  );
}

/* ============================================================
   Field + marching-squares helpers (module-scope, pure).
   ============================================================ */

/** Sum-of-gaussians height in [0,1], with optional tiny ambient drift. */
function sampleField(peaks: Bump[], nx: number, ny: number, drift: number): number {
  let h = 0;
  for (let k = 0; k < peaks.length; k++) {
    const pk = peaks[k];
    // ambient: orbit each center by ≤0.04 in normalized units
    const ox = drift ? Math.cos(drift * 0.18 + k * 2.1) * 0.04 : 0;
    const oy = drift ? Math.sin(drift * 0.15 + k * 1.7) * 0.04 : 0;
    const dx = nx - (pk.cx + ox);
    const dy = ny - (pk.cy + oy);
    h += pk.amp * Math.exp(-(dx * dx + dy * dy) / (2 * pk.sigma * pk.sigma));
  }
  // normalize: peaks sum to ~amp·count at coincident centers; clamp keeps 0..1
  return clamp(h);
}

type Seg = { a: Pt; b: Pt };

/** Classic marching-squares: emit line segments where `field` crosses `level`. */
function marchingSquares(
  field: Float32Array,
  cols: number,
  rows: number,
  sx: number,
  sy: number,
  level: number,
): Seg[] {
  const out: Seg[] = [];
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = field[j * cols + i];
      const tr = field[j * cols + i + 1];
      const br = field[(j + 1) * cols + i + 1];
      const bl = field[(j + 1) * cols + i];
      let idx = 0;
      if (tl > level) idx |= 8;
      if (tr > level) idx |= 4;
      if (br > level) idx |= 2;
      if (bl > level) idx |= 1;
      if (idx === 0 || idx === 15) continue;

      const x0 = i * sx;
      const y0 = j * sy;
      // edge crossing points via linear interpolation of the field value
      const top = (): Pt => ({ x: x0 + sx * t(tl, tr, level), y: y0 });
      const right = (): Pt => ({ x: x0 + sx, y: y0 + sy * t(tr, br, level) });
      const bottom = (): Pt => ({ x: x0 + sx * t(bl, br, level), y: y0 + sy });
      const left = (): Pt => ({ x: x0, y: y0 + sy * t(tl, bl, level) });

      switch (idx) {
        case 1:
        case 14:
          out.push({ a: left(), b: bottom() });
          break;
        case 2:
        case 13:
          out.push({ a: bottom(), b: right() });
          break;
        case 3:
        case 12:
          out.push({ a: left(), b: right() });
          break;
        case 4:
        case 11:
          out.push({ a: top(), b: right() });
          break;
        case 6:
        case 9:
          out.push({ a: top(), b: bottom() });
          break;
        case 7:
        case 8:
          out.push({ a: top(), b: left() });
          break;
        // saddles (5, 10): split into two segments
        case 5:
          out.push({ a: top(), b: right() });
          out.push({ a: left(), b: bottom() });
          break;
        case 10:
          out.push({ a: top(), b: left() });
          out.push({ a: bottom(), b: right() });
          break;
      }
    }
  }
  return out;
}

/** Interpolation fraction where the field equals `level` between a and b. */
function t(a: number, b: number, level: number): number {
  const d = b - a;
  if (Math.abs(d) < 1e-6) return 0.5;
  return clamp((level - a) / d);
}

/* ---- minimal color parse + mix (operates on resolved token strings) ---- */
type RGB = [number, number, number];

function parseColor(c: string): RGB {
  const s = c.trim();
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const m = s.match(/-?\d+(\.\d+)?/g);
  if (m && m.length >= 3) {
    return [Number(m[0]), Number(m[1]), Number(m[2])];
  }
  return [250, 250, 250];
}

function mix(a: RGB, b: RGB, tt: number): string {
  const r = Math.round(lerp(a[0], b[0], tt));
  const g = Math.round(lerp(a[1], b[1], tt));
  const bl = Math.round(lerp(a[2], b[2], tt));
  return `rgb(${r}, ${g}, ${bl})`;
}
