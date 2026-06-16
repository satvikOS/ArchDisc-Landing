"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import {
  BAYER8,
  clamp,
  lerp,
  catmullRom,
  useCanvas2D,
  cssVar,
  usePrefersReducedMotion,
  type Pt,
} from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * DitherPortrait — a Studio sculpt revealed through pure value.
 *
 * A SCULPTED surface-of-revolution vessel — concave neck, flared shoulder, full
 * body, footed base — is defined by an implicit profile so the fake top-left key
 * light still shades it cleanly. It renders as an ordered-dither (Bayer 8×8)
 * halftone clay (the same monochrome dither language as the FEA plot), grounded
 * by a soft contact shadow + floor gradient so it reads as a RENDERED scene in
 * value. Flowing RETOPOLOGY edge-loops then draw on top — latitude rings that
 * densify where the silhouette curves hardest, plus meridian loops that hug the
 * form — and a mono `subdiv · L2 · retopo` tag with a tiny cage→subdiv level cue
 * stamps in. The DCC "sculpt → retopo → shade" arc, played once then held.
 * Decorative only.
 *
 * Monochrome: clay dots + wireframe read `--color-ink` on the light field; the
 * `dark` variant reads `--color-paper` so it inverts on a gravity section by
 * flipping a single prop. Nothing is hardcoded — colors come from CSS tokens.
 *
 * @prop variant   "hero" (larger mesh, dim tag) | "tile" (compact). Default "hero".
 * @prop dark      Invert for dark/ink fields (paper-colored marks). Default false.
 * @prop seed      Deterministic form jitter so multiple instances differ. Default 7.
 * @prop pitch     Dither grid pitch in px (dot spacing). Default 4.
 * @prop tag       Mono stamp label. Default "subdiv · L2 · retopo".
 * @prop showTag   Render the stamped tag. Default true.
 * @prop level     Subdivision level for the cage→subdiv corner cue (1..3). Default 2.
 * @prop showLevel Render the subdivision-level cue badge. Default true (hero only).
 * @prop ground    Render the contact shadow + floor gradient. Default true.
 * @prop className  Sizing / placement classes (spread onto the root).
 */
export interface DitherPortraitProps {
  variant?: "hero" | "tile";
  dark?: boolean;
  seed?: number;
  pitch?: number;
  tag?: string;
  showTag?: boolean;
  level?: number;
  showLevel?: boolean;
  ground?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Implicit form — a surface-of-revolution vessel in a unit frame.     */
/* The profile gives the silhouette half-width `profileR(t)` for t∈[0,1]*/
/* (t = 0 top rim → t = 1 base). The body is that profile revolved      */
/* about the vertical axis; we only ever see the front hemisphere, so   */
/* the on-screen silhouette is ±profileR(t). A fake top-left lambert     */
/* shades it. Shared with the SVG retopo wireframe below.               */
/* ------------------------------------------------------------------ */

// Vertical extent of the form in the unit frame (top y = -FORM_TOP, base y = +FORM_BOT).
const FORM_TOP = 1.0;
const FORM_BOT = 1.0;
const FORM_H = FORM_TOP + FORM_BOT;

/** Map screen-v (unit frame, v down) to profile parameter t∈[0,1]. */
function vToT(v: number): number {
  return clamp((v + FORM_TOP) / FORM_H, 0, 1);
}

/**
 * Half-width radius of the vessel at profile parameter t (0 = rim, 1 = base).
 * A characterful silhouette: small rim → pinched concave NECK → flared SHOULDER
 * → full BODY → tucked waist → small footed BASE. Smooth blends keep the
 * fake-lambert normal continuous so the clay reads as one solid.
 */
function profileR(t: number): number {
  // Anchor radii along the height (rim, neck, shoulder, belly, waist, foot).
  // Built from a few smoothstep lobes so the curvature has real character.
  const ss = (a: number, b: number, x: number) => {
    const u = clamp((x - a) / (b - a), 0, 1);
    return u * u * (3 - 2 * u);
  };
  // Rim lip (small flare at the very top).
  const rim = 0.30 + 0.05 * Math.exp(-Math.pow((t - 0.0) / 0.05, 2));
  // Concave neck dip around t≈0.16.
  const neck = -0.12 * Math.exp(-Math.pow((t - 0.16) / 0.085, 2));
  // Shoulder swell rising into the body.
  const shoulder = 0.40 * ss(0.10, 0.42, t);
  // Belly fullness peaking ~0.55, gentle Gaussian.
  const belly = 0.30 * Math.exp(-Math.pow((t - 0.55) / 0.26, 2));
  // Lower taper toward a tucked waist then a small foot.
  const taper = -0.34 * ss(0.62, 0.92, t);
  // Foot ring (slight flare right at the base so it "sits").
  const foot = 0.10 * ss(0.90, 1.0, t);
  const r = rim + neck + shoulder + belly + taper + foot;
  return clamp(r, 0.05, 1);
}

/** Numerical derivative of the profile (for curvature-aware retopo + normals). */
function profileDR(t: number): number {
  const h = 0.004;
  return (profileR(Math.min(1, t + h)) - profileR(Math.max(0, t - h))) / (2 * h);
}

/**
 * Lambert shade of the revolved surface at unit-frame (u,v) inside silhouette.
 * Returns ink density in [0,1] (0 = paper / no dot, 1 = ink / dense dot).
 */
function shade(u: number, v: number): number {
  const t = vToT(v);
  const R = profileR(t);
  if (R < 1e-4) return 0;
  // Where across the cross-section circle are we? sinα = u/R; the unseen depth
  // gives the third normal component for the surface of revolution.
  const sinA = clamp(u / R, -1, 1);
  const cosA = Math.sqrt(clamp(1 - sinA * sinA, 0, 1)); // toward viewer (+z)
  // Profile tangent in the (radial, axial) plane → axial normal tilt.
  const dr = profileDR(t);
  // Surface normal of a surface of revolution:
  //   n = ( cosα, dr·(scale), sinα ) before normalize, with axial slope folded in.
  // Build with axial component from -dr (outward where profile widens going down).
  const nx = sinA;
  const ny = dr * 0.9; // axial slope contribution (v is down → positive widens)
  const nz = cosA + 0.28; // bias toward viewer for a fuller falloff
  const inv = 1 / Math.hypot(nx, ny, nz);
  // Top-left key light, skewed so neck/shoulder catch and lower-right falls off.
  const lx = -0.50;
  const ly = -0.64;
  const lz = 0.58;
  const ndotl = (nx * lx + ny * ly + nz * lz) * inv;
  const lambert = clamp(ndotl, 0, 1);
  // Rim term: edges of the cross-section (low cosα) lose dots so the silhouette
  // edge stays a thin, readable transition instead of a hard wall.
  const rim = Math.pow(clamp(1 - cosA, 0, 1), 2.0) * 0.22;
  // A faint axial sheen so the belly's broadest band reads as the form's apex.
  const sheen = 0.05 * Math.exp(-Math.pow((t - 0.46) / 0.14, 2));
  const i = clamp(0.15 + lambert * 0.95 - rim + sheen, 0, 1);
  // Invert: HIGH density = SHADOW (clay mass reads dark).
  return clamp(1 - i, 0, 1);
}

export function DitherPortrait({
  variant = "hero",
  dark = false,
  seed = 7,
  pitch = 4,
  tag = "subdiv · L2 · retopo",
  showTag = true,
  level = 2,
  showLevel,
  ground = true,
  className,
}: DitherPortraitProps) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-60px" });

  const markVar = dark ? "--color-paper" : "--color-ink";
  const wireOpacity = variant === "hero" ? 0.46 : 0.4;
  const levelOn = (showLevel ?? variant === "hero") && level >= 1;

  // --- Canvas clay shade: floor gradient + contact shadow + fake-lambert clay ---
  useCanvas2D(
    canvasRef,
    (ctx, w, h, p) => {
      const fill = cssVar(markVar) || (dark ? "#fafafa" : "#11151c");

      // Map the form into a centered box with margin. The form spans FORM_H
      // tall and up to ±1 wide in unit frame; `half` is px per unit.
      const pad = variant === "hero" ? 0.09 : 0.07;
      const boxW = w * (1 - pad * 2);
      const boxH = h * (1 - pad * 2);
      const half = Math.min(boxW / 2, boxH / FORM_H);
      const cx = w / 2;
      // Center on the form's vertical mid, nudged up to leave room for the floor.
      const cy = h * (variant === "hero" ? 0.46 : 0.47);
      const baseY = cy + FORM_BOT * half; // screen y of the vessel's foot

      // One-shot left→right wipe over the first part of the ramp; hold after.
      const REVEAL_END = 0.55;
      const wipe = reduce ? 1 : clamp(p / REVEAL_END, 0, 1);
      const wipeX = w * wipe;

      // -- 1. Floor gradient + soft contact shadow (the "rendered scene" cue) --
      if (ground) {
        ctx.save();
        // Floor: a faint value gradient rising from the contact line so the
        // vessel sits in a space rather than floating on paper.
        const grad = ctx.createLinearGradient(0, baseY - half * 0.1, 0, h);
        grad.addColorStop(0, withAlpha(fill, 0.0));
        grad.addColorStop(0.18, withAlpha(fill, 0.05));
        grad.addColorStop(1, withAlpha(fill, 0.11));
        ctx.fillStyle = grad;
        ctx.fillRect(0, baseY - half * 0.1, wipeX, h - (baseY - half * 0.1));

        // Contact shadow: a soft radial ellipse hugging the foot, anchored to the
        // light direction (cast down-right from the top-left key).
        const footR = profileR(1) * half;
        const shW = footR * 2.4;
        const shH = footR * 0.7;
        const shCx = cx + footR * 0.55; // pushed toward shadow side
        const shCy = baseY + shH * 0.35;
        if (shCx - shW < wipeX) {
          const rg = ctx.createRadialGradient(shCx, shCy, 0, shCx, shCy, shW);
          rg.addColorStop(0, withAlpha(fill, 0.26));
          rg.addColorStop(0.55, withAlpha(fill, 0.12));
          rg.addColorStop(1, withAlpha(fill, 0.0));
          ctx.save();
          ctx.translate(shCx, shCy);
          ctx.scale(1, shH / shW);
          ctx.translate(-shCx, -shCy);
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.arc(shCx, shCy, shW, 0, Math.PI * 2);
          // Clip the shadow to the reveal wipe.
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, wipeX, h);
          ctx.clip();
          ctx.fill();
          ctx.restore();
          ctx.restore();
        }
        ctx.restore();
      }

      // -- 2. The dithered clay vessel --
      ctx.fillStyle = fill;
      const r = Math.max(0.8, pitch * 0.5);
      const dia = pitch;

      for (let py = 0; py < h; py += dia) {
        const v = (py - cy) / half;
        if (v < -FORM_TOP || v > FORM_BOT) continue;
        const t = vToT(v);
        const R = profileR(t);
        if (R < 1e-4) continue;

        for (let px = 0; px < wipeX + dia; px += dia) {
          if (px > wipeX) break;
          const u = (px - cx) / half;
          if (Math.abs(u) > R) continue; // outside the revolved silhouette

          const value = shade(u, v);
          const bx = (px / dia) & 7;
          const by = (py / dia) & 7;
          const thr = BAYER8[(by & 7) * 8 + (bx & 7)];
          if (value <= thr) continue;

          // Variable-radius softening near the threshold → a clay-like edge.
          const over = clamp((value - thr) / Math.max(0.001, 1 - thr), 0, 1);
          const rr = lerp(r * 0.55, r, over);
          ctx.globalAlpha = lerp(0.55, 1, over);
          ctx.beginPath();
          ctx.arc(px, py, rr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    },
    { duration: 1000, reducedMotion: reduce, deps: [variant, dark, pitch, ground] },
  );

  // --- SVG retopo wireframe over the clay, in the SAME normalized frame ---
  const VB = 200;
  const wf = buildRetopo(VB, variant === "hero", seed);

  const play = reduce ? true : inView;
  const wireProps = reduce
    ? ({ initial: false, animate: "show" } as const)
    : ({ initial: "hidden", animate: play ? "show" : "hidden" } as const);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "relative aspect-[5/6] w-full overflow-hidden",
        dark ? "text-paper" : "text-ink",
        className,
      )}
    >
      {/* clay shade + floor — only paints when in view (useCanvas2D owns the IO) */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* retopo edge-loops — drawn in the matching unit frame, on top of the clay */}
      <motion.svg
        viewBox={`0 0 ${VB} ${VB}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        {...wireProps}
      >
        {/* meridian loops — vertical edge-loops hugging the surface of revolution */}
        <g stroke="currentColor" strokeWidth={0.55} opacity={wireOpacity} strokeLinecap="round">
          {wf.meridians.map((d, i) => (
            <motion.path
              key={`mer-${i}`}
              d={d}
              variants={pathV}
              custom={0.5 + (i / Math.max(1, wf.meridians.length)) * 0.42}
            />
          ))}
        </g>
        {/* latitude rings — densify at high curvature; opacity tracks density */}
        {wf.rings.map((ring, i) => (
          <motion.path
            key={`ring-${i}`}
            d={ring.d}
            stroke="currentColor"
            strokeWidth={ring.hot ? 0.7 : 0.5}
            opacity={wireOpacity * (ring.hot ? 1.15 : 0.85)}
            strokeLinecap="round"
            variants={pathV}
            custom={0.6 + (i / Math.max(1, wf.rings.length)) * 0.46}
          />
        ))}
        {/* crisp silhouette edge — the darkest line, drawn last to seat the form */}
        <motion.path
          d={wf.silhouette}
          stroke="currentColor"
          strokeWidth={1}
          strokeLinejoin="round"
          opacity={wireOpacity + 0.3}
          variants={pathV}
          custom={0.5}
        />
      </motion.svg>

      {/* subdivision-level cue — a tiny cage→subdiv density step, top-right */}
      {levelOn && (
        <motion.svg
          viewBox="0 0 48 28"
          className="absolute right-2.5 top-2.5 h-5 w-9"
          fill="none"
          variants={cueV}
          initial={reduce ? false : "hidden"}
          animate={play ? "show" : "hidden"}
        >
          <SubdivCue level={clamp(Math.round(level), 1, 3)} opacity={wireOpacity + 0.18} />
        </motion.svg>
      )}

      {/* coherence / retopo stamp */}
      {showTag && (
        <motion.div
          className={cn(
            "absolute bottom-3 left-3 flex items-center gap-1.5 rounded-[2px] border px-2 py-1",
            dark ? "border-paper/25 bg-ink/40" : "border-line-strong bg-surface/70",
          )}
          style={{ backdropFilter: "blur(2px)" }}
          variants={stampV}
          initial={reduce ? false : "hidden"}
          animate={play ? "show" : "hidden"}
        >
          <span
            className={cn(
              "inline-block h-1 w-1 rounded-full",
              dark ? "bg-paper/70" : "bg-ink/70",
            )}
          />
          <span
            className={cn(
              "font-mono text-[10px] tracking-tight",
              dark ? "text-paper/65" : "text-muted",
            )}
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            {tag}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subdivision-level cue — three quads → a denser subdivided cage.     */
/* ------------------------------------------------------------------ */

function SubdivCue({ level, opacity }: { level: number; opacity: number }) {
  // A 2×2 quad cage that subdivides by `level`: draw the outer cage plus
  // `level` internal divisions per axis, so L1 reads coarse and L3 dense.
  const divs = level + 1; // internal lines per axis
  const x0 = 1;
  const y0 = 1;
  const x1 = 47;
  const y1 = 27;
  const lines: string[] = [];
  for (let i = 0; i <= divs; i++) {
    const x = lerp(x0, x1, i / divs);
    const y = lerp(y0, y1, i / divs);
    lines.push(`M ${r2(x)} ${y0} L ${r2(x)} ${y1}`);
    lines.push(`M ${x0} ${r2(y)} L ${x1} ${r2(y)}`);
  }
  return (
    <g stroke="currentColor" opacity={opacity} strokeLinecap="round">
      <path d={lines.join(" ")} strokeWidth={0.5} />
      <rect
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
        stroke="currentColor"
        strokeWidth={0.9}
        rx={1}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Motion variants                                                     */
/* ------------------------------------------------------------------ */

const pathV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, ease: EASE, delay: d },
      opacity: { duration: 0.2, delay: d },
    },
  }),
};

const stampV: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 4 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE, delay: 1.35 },
  },
};

const cueV: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: EASE, delay: 1.2 },
  },
};

/* ------------------------------------------------------------------ */
/* Retopo geometry — flowing edge-loops over the surface of revolution */
/* ------------------------------------------------------------------ */

interface Ring {
  d: string;
  hot: boolean; // sits at high curvature → drawn slightly heavier
}
interface Retopo {
  meridians: string[];
  rings: Ring[];
  silhouette: string;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Build the retopo cage in viewBox space, matching the canvas form mapping.
 * Latitude rings are spaced by ACCUMULATED CURVATURE so they crowd at the rim,
 * neck and shoulder (where the profile bends hard) and thin out over the belly —
 * the signature of hand/auto retopology, not a uniform globe grid.
 */
function buildRetopo(VB: number, hero: boolean, seed: number): Retopo {
  const pad = hero ? 0.09 : 0.07;
  const box = VB * (1 - pad * 2);
  const half = Math.min(box / 2, box / FORM_H);
  const cx = VB / 2;
  const cy = VB * 0.46;

  // Deterministic, bounded ring-count jitter for instance variety.
  const ringJit = (seed % 4) - 1; // -1..2
  const ringCount = clamp(hero ? 13 + ringJit : 10 + ringJit, 8, 16);
  const merCount = hero ? 9 : 7;
  const SAMP = 40;

  // ---- Curvature field along the profile → cumulative for arc-equal spacing ----
  const N = 240;
  const curv: number[] = new Array(N + 1);
  let prevDr = profileDR(0);
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const dr = profileDR(t);
    // |Δslope| approximates |κ|; add a small base so flats still get some rings.
    const k = Math.abs(dr - prevDr) * 16 + 0.5;
    curv[i] = k;
    prevDr = dr;
  }
  const cum: number[] = new Array(N + 1);
  cum[0] = 0;
  for (let i = 1; i <= N; i++) cum[i] = cum[i - 1] + curv[i];
  const total = cum[N] || 1;

  /** Invert the cumulative-curvature CDF to get t for an even-curvature step. */
  const tAtFraction = (f: number): number => {
    const target = f * total;
    let lo = 0;
    let hi = N;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo / N;
  };

  // Screen point for the surface-of-revolution at profile t and cross-section
  // angle α (α = ±π/2 are the silhouette edges; α = 0 faces the viewer).
  const pt = (t: number, alpha: number): Pt => {
    const R = profileR(t);
    const u = R * Math.sin(alpha);
    const v = lerp(-FORM_TOP, FORM_BOT, t);
    return { x: cx + u * half, y: cy + v * half };
  };

  // ---- Latitude rings (front arc), curvature-spaced ----
  const rings: Ring[] = [];
  for (let j = 1; j < ringCount; j++) {
    const f = j / ringCount;
    const t = tAtFraction(f);
    // Local curvature at this ring (for "hot" weighting).
    const idx = clamp(Math.round(t * N), 0, N);
    const hot = curv[idx] > total / N + 0.6;
    // Half-ellipse across the visible front: α from -90°..+90°.
    const pts: Pt[] = [];
    const segs = 24;
    for (let s = 0; s <= segs; s++) {
      const alpha = lerp(-Math.PI / 2, Math.PI / 2, s / segs);
      pts.push(pt(t, alpha));
    }
    rings.push({ d: catmullRom(pts, false), hot });
  }

  // ---- Meridian loops (vertical), hugging the form pole→base ----
  const meridians: string[] = [];
  for (let m = 0; m < merCount; m++) {
    const alpha = lerp(-Math.PI / 2, Math.PI / 2, m / (merCount - 1));
    const pts: Pt[] = [];
    for (let s = 0; s <= SAMP; s++) {
      const t = s / SAMP;
      pts.push(pt(t, alpha));
    }
    meridians.push(catmullRom(pts, false));
  }

  // ---- Closed silhouette outline (right edge down, mirror up) ----
  const right: Pt[] = [];
  const left: Pt[] = [];
  const OUT = 90;
  for (let i = 0; i <= OUT; i++) {
    const t = i / OUT;
    const R = profileR(t);
    const v = lerp(-FORM_TOP, FORM_BOT, t);
    right.push({ x: cx + R * half, y: cy + v * half });
    left.push({ x: cx - R * half, y: cy + v * half });
  }
  const outline = right.concat(left.reverse());
  const silhouette = catmullRom(outline, true);

  return { meridians, rings, silhouette };
}

/* ------------------------------------------------------------------ */
/* Color helper — apply alpha to a token color (hex or rgb/var output). */
/* Keeps everything monochrome: alpha only, never hue.                  */
/* ------------------------------------------------------------------ */
function withAlpha(color: string, a: number): string {
  const c = color.trim();
  // #rgb / #rrggbb
  const hex = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((ch) => ch + ch).join("");
    const n = parseInt(h, 16);
    const rr = (n >> 16) & 255;
    const gg = (n >> 8) & 255;
    const bb = n & 255;
    return `rgba(${rr}, ${gg}, ${bb}, ${a})`;
  }
  // rgb(...) / rgba(...) → re-wrap with our alpha.
  const rgb = c.match(/rgba?\(([^)]+)\)/i);
  if (rgb) {
    const parts = rgb[1].split(/[,/\s]+/).filter(Boolean).slice(0, 3);
    if (parts.length === 3) return `rgba(${parts.join(", ")}, ${a})`;
  }
  // Fallback: rely on global alpha at the call site is not possible here, so
  // return the raw color (opaque) — still monochrome, just no soft fade.
  return c;
}
