"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  useCanvas2D,
  cssVar,
  mulberry32,
  valueNoise,
  clamp,
} from "@/lib/artkit";

/**
 * FlowFieldDrift — generative line-art substrate.
 *
 * Thousands of short hairline streamlines tracing a smooth vector field —
 * iron filings over a magnet, or laminar flow over an airfoil. Gives dark
 * gravity sections (the free-to-use moment, the final CTA) depth and
 * motion-of-the-machine atmosphere without a single hue or any chrome.
 *
 * Monochrome only: strokes are pulled from CSS tokens via cssVar / currentColor
 * through useCanvas2D. The dark-field variant strokes in paper at low alpha.
 *
 * MOTION DOCTRINE
 *  - variant="static"  → ONE integrated draw-on pass (streamlines extend over
 *                        `duration`) then FREEZE. For heroes / behind content.
 *                        Reduced-motion → a single static integrated frame.
 *  - variant="ambient" → slow continuous phase drift; ONLY for dark/empty
 *                        background substrate far from text. rAF is paused
 *                        off-screen and fully suppressed under reduced-motion
 *                        (renders one static frame instead).
 *
 * Field options (`field`):
 *  - "curl"    → closed-form curl from sin/cos sums (no noise dependency).
 *  - "noise"   → value-noise driven angle (organic iron-filing flow).
 *  - "airfoil" → streamlines bending around an implicit airfoil (the
 *                /precision aero / flow nod).
 *
 * Decorative (aria-hidden). Every prop has a default so `<FlowFieldDrift />`
 * renders standalone.
 *
 * @prop variant   "static" | "ambient"  — once-then-hold vs. slow drift. Default "static".
 * @prop field     "curl" | "noise" | "airfoil" — vector-field generator. Default "curl".
 * @prop dark      boolean — stroke in paper alpha for dark gravity fields. Default false.
 * @prop count     number  — streamline seed count (auto-scaled to area if omitted).
 * @prop steps     number  — integration steps per streamline. Default 18.
 * @prop scale     number  — spatial frequency of the field (lower = broader sweeps). Default 1.
 * @prop alpha     number  — base stroke alpha. Default 0.1 (light) / paper at 0.085 (dark).
 * @prop seed      number  — deterministic RNG seed for particle origins. Default 7.
 * @prop fade      number  — radial mask falloff %, larger = softer edges. Default 76.
 * @prop className string  — sizing / positioning (spread onto the root). Fills parent by default.
 */

type Variant = "static" | "ambient";
type Field = "curl" | "noise" | "airfoil";

interface FlowFieldDriftProps {
  variant?: Variant;
  field?: Field;
  dark?: boolean;
  count?: number;
  steps?: number;
  scale?: number;
  alpha?: number;
  seed?: number;
  fade?: number;
  className?: string;
}

/** Field angle θ at a point in [0..1]² normalized space, advanced by phase `ph`. */
function fieldAngle(
  field: Field,
  nx: number,
  ny: number,
  freq: number,
  ph: number,
): number {
  if (field === "noise") {
    // Smooth value-noise flow — organic, iron-filing-like.
    const n = valueNoise(nx * freq * 3 + ph * 0.6, ny * freq * 3 - ph * 0.4);
    return n * Math.PI * 2.4 + ny * 1.1;
  }
  if (field === "airfoil") {
    // Implicit airfoil centered slightly left of middle; flow deflects around it.
    const ax = 0.42;
    const ay = 0.5;
    const dx = nx - ax;
    const dy = (ny - ay) * 2.1; // squash so the body reads as a thin section
    const r2 = dx * dx + dy * dy;
    // Dipole-style deflection: a freestream (left→right) bent by the body.
    const bend = (0.5 * (dx)) / (r2 + 0.02);
    const lift = (-0.5 * dy) / (r2 + 0.02);
    let theta = Math.atan2(lift + (ny - ay) * 0.25, 1 + bend);
    // gentle far-field undulation so margins aren't dead-flat
    theta += Math.sin(nx * 5 * freq + ph) * 0.05;
    return theta;
  }
  // "curl" — closed-form curl from sin/cos sums. Smooth, divergence-light.
  const a =
    Math.sin(nx * 6.2 * freq + ph * 0.7) * Math.cos(ny * 5.4 * freq - ph * 0.5);
  const b = Math.sin((nx + ny) * 3.1 * freq + ph * 0.4);
  return a * 1.9 + b * 0.8 + ny * 1.25;
}

export function FlowFieldDrift({
  variant = "static",
  field = "curl",
  dark = false,
  count,
  steps = 18,
  scale = 1,
  alpha,
  seed = 7,
  fade = 76,
  className,
}: FlowFieldDriftProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Ambient drift is the only looping mode, and only when motion is allowed.
  const ambient = variant === "ambient" && !reduce;

  useCanvas2D(
    ref,
    (ctx, w, h, p) => {
      if (w <= 0 || h <= 0) return;

      // ---- Resolve colors from tokens only (never hardcode hex) ----
      // Read against the canvas element so a dark-field wrapper's className can
      // override tokens locally if needed; the hook only paints client-side.
      const el = ctx.canvas;
      const color =
        cssVar(dark ? "--color-paper" : "--color-line-strong", el) ||
        (dark ? "#fafafa" : "#dcdce0");
      const baseAlpha = alpha ?? (dark ? 0.085 : 0.1);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;

      // ---- Field parameters ----
      const freq = scale;
      // Phase: ambient drifts with elapsed seconds; static holds at 0.
      const phase = ambient ? p * 0.18 : 0;
      // Integration step in px (relative to the short edge so density is stable).
      const dim = Math.min(w, h);
      const stepLen = clamp(dim * 0.012, 4, 10);

      // ---- Seed count auto-scales with area; clamp for perf ----
      const density = count ?? Math.round((w * h) / 1750);
      const N = clamp(density, 120, 1100);

      // For "static", `p` ramps 0→1 over duration: extend each streamline so the
      // whole field appears to draw on. For "ambient", draw the full length.
      const grow = ambient ? 1 : p;
      const segMax = Math.max(2, Math.round(steps * grow));

      const rng = mulberry32(seed);

      ctx.globalAlpha = 1;
      for (let i = 0; i < N; i++) {
        // Deterministic origin in normalized space.
        let nx = rng();
        let ny = rng();
        // Per-streamline alpha jitter for organic depth.
        const aJit = baseAlpha * (0.55 + rng() * 0.9);

        ctx.beginPath();
        ctx.moveTo(nx * w, ny * h);

        let alive = true;
        for (let s = 0; s < segMax && alive; s++) {
          const theta = fieldAngle(field, nx, ny, freq, phase);
          // Advance in normalized space (step scaled to short edge).
          nx += (Math.cos(theta) * stepLen) / w;
          ny += (Math.sin(theta) * stepLen) / h;
          if (nx < -0.05 || nx > 1.05 || ny < -0.05 || ny > 1.05) {
            alive = false;
            break;
          }
          ctx.lineTo(nx * w, ny * h);
        }

        // Slight weight variation: most hairlines, a sparse few a touch heavier.
        ctx.lineWidth = rng() > 0.93 ? 1.1 : 0.7;
        ctx.globalAlpha = aJit;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ---- Radial / edge mask fade so it never competes with text ----
      // Punch a soft vignette by erasing toward the edges. Reads the paper/ink
      // backdrop token so the fade dissolves into whatever surface sits behind.
      const bg =
        cssVar(dark ? "--color-ink" : "--color-paper", el) ||
        (dark ? "#11151c" : "#fafafa");
      const inner = (fade / 100) * 0.42;
      const outer = (fade / 100) * 0.72;
      const cx = w * 0.5;
      const cy = h * 0.46;
      const rad = Math.hypot(w, h) * 0.62;
      const grad = ctx.createRadialGradient(
        cx,
        cy,
        rad * inner,
        cx,
        cy,
        rad * outer,
      );
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, bg);
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = prev;
    },
    {
      // Static: a ~1.2s draw-on pass then freeze. Ambient: continuous drift.
      duration: 1200,
      ambient,
      reducedMotion: reduce,
      deps: [variant, field, dark, count, steps, scale, alpha, seed, fade],
    },
  );

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}
