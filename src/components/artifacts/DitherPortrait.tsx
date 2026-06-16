"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView, type Variants } from "motion/react";
import {
  BAYER8,
  clamp,
  lerp,
  useCanvas2D,
  cssVar,
  type Pt,
} from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * DitherPortrait — a Studio sculpt revealed through pure value.
 *
 * An implicit superellipsoid "bust" is shaded with a fake top-left lambert and
 * rendered as an ordered-dither (Bayer 8×8) halftone clay — the same monochrome
 * dither language as the FEA plot — then a coarse lat/long quad wireframe draws
 * on top (retopo over clay) and a mono `subdiv · level 2` tag stamps in. The DCC
 * "sculpt → retopo → shade" arc, played once then held. Decorative only.
 *
 * Monochrome: clay dots + wireframe read `--color-ink` on the light field; the
 * `dark` variant reads `--color-paper` so it inverts on a gravity section by
 * flipping a single prop. Nothing is hardcoded — colors come from CSS tokens.
 *
 * @prop variant   "hero" (larger mesh, dim tag) | "tile" (compact). Default "hero".
 * @prop dark      Invert for dark/ink fields (paper-colored marks). Default false.
 * @prop seed      Deterministic form jitter so multiple instances differ. Default 7.
 * @prop pitch     Dither grid pitch in px (dot spacing). Default 4.
 * @prop tag       Mono stamp label. Default "subdiv · level 2".
 * @prop showTag   Render the stamped tag. Default true.
 * @prop className  Sizing / placement classes (spread onto the root).
 */
export interface DitherPortraitProps {
  variant?: "hero" | "tile";
  dark?: boolean;
  seed?: number;
  pitch?: number;
  tag?: string;
  showTag?: boolean;
  className?: string;
}

/* ---- Implicit form: a superellipsoid "bust" in a normalized unit frame ----
   Sampled in [-1,1]^2 over screen, returns the shaded clay intensity in [0,1]
   (0 = paper / no dot, 1 = ink / dense dot) and whether the sample is inside
   the silhouette. Shared geometry with the SVG wireframe below via `surface`. */

// Vertical squash so the form reads as a tall bust rather than a ball.
const FORM_RY = 1.16;
// Superellipse exponent — >2 gives the squarish, sculpted shoulder.
const FORM_N = 2.6;

/** Implicit radius of the silhouette at a given polar angle (unit frame). */
function silhouetteR(theta: number): number {
  // Superellipse radius: |cosθ|^n + |sinθ/ry|^n = 1  →  solve for r along the ray.
  const c = Math.abs(Math.cos(theta));
  const s = Math.abs(Math.sin(theta)) / FORM_RY;
  const denom = Math.pow(Math.pow(c, FORM_N) + Math.pow(s, FORM_N), 1 / FORM_N);
  return denom > 1e-4 ? 1 / denom : 1;
}

/** Lambert intensity of the implicit surface at unit-frame (u,v) inside silhouette. */
function shade(u: number, v: number): number {
  // Reconstruct a hemispherical surface normal: z from the unit sphere, biased
  // by the superellipse so the form has a believable rounded volume.
  const r2 = u * u + (v / FORM_RY) * (v / FORM_RY);
  const z = Math.sqrt(clamp(1 - r2, 0, 1));
  // Surface normal (top-left key light). Light points down the +z toward viewer,
  // skewed up-left so the brow/cheek catch and the lower-right falls to shadow.
  const nx = u;
  const ny = v / FORM_RY;
  const nz = z + 0.35; // bias toward viewer for a softer, fuller falloff
  const inv = 1 / Math.hypot(nx, ny, nz);
  const lx = -0.52;
  const ly = -0.62;
  const lz = 0.59;
  const ndotl = (nx * lx + ny * ly + nz * lz) * inv;
  // Lambert + a little ambient + a soft rim so the silhouette edge stays read-able.
  const lambert = clamp(ndotl, 0, 1);
  const rim = Math.pow(clamp(1 - z, 0, 1), 2.2) * 0.22; // edge glow → fewer dots at rim
  const i = clamp(0.16 + lambert * 0.94 - rim, 0, 1);
  // Invert so HIGH intensity = MORE ink dots in the SHADOW (clay reads as dark mass).
  return clamp(1 - i, 0, 1);
}

export function DitherPortrait({
  variant = "hero",
  dark = false,
  seed = 7,
  pitch = 4,
  tag = "subdiv · level 2",
  showTag = true,
  className,
}: DitherPortraitProps) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-60px" });

  const markVar = dark ? "--color-paper" : "--color-ink";
  const wireOpacity = variant === "hero" ? 0.5 : 0.42;

  // --- Canvas clay shade: fake-lambert superellipsoid, Bayer-8 ordered dither ---
  useCanvas2D(
    canvasRef,
    (ctx, w, h, p) => {
      const fill = cssVar(markVar) || (dark ? "#fafafa" : "#11151c");
      ctx.fillStyle = fill;

      // Map the form into a centered box with margin; keep a 1:1.18 aspect.
      const pad = variant === "hero" ? 0.1 : 0.08;
      const boxW = w * (1 - pad * 2);
      const boxH = h * (1 - pad * 2);
      const half = Math.min(boxW / 2, boxH / (2 * FORM_RY));
      const cx = w / 2;
      const cy = h / 2;

      // One-shot left→right wipe over the first ~0.6s of the ramp; hold after.
      // p ramps 0→1 over `duration`; reveal completes at p=REVEAL_END.
      const REVEAL_END = 0.55;
      const wipe = reduce ? 1 : clamp(p / REVEAL_END, 0, 1);
      const wipeX = w * wipe;

      const r = Math.max(0.8, pitch * 0.5);
      const dia = pitch;

      for (let py = 0; py < h; py += dia) {
        for (let px = 0; px < wipeX + dia; px += dia) {
          if (px > wipeX) break;
          // Unit-frame coords (u right, v down) relative to form center.
          const u = (px - cx) / half;
          const v = (py - cy) / half;
          // Inside the superellipse silhouette?
          const theta = Math.atan2(v, u);
          const rad = Math.hypot(u, v);
          if (rad > silhouetteR(theta)) continue;

          const value = shade(u, v);
          // Ordered-dither threshold (Bayer 8×8) on the dot-grid cell.
          const bx = (px / dia) & 7;
          const by = (py / dia) & 7;
          const thr = BAYER8[(by & 7) * 8 + (bx & 7)];
          if (value <= thr) continue;

          // Variable-radius softening near the threshold gives a clay-like edge
          // instead of a hard on/off stipple.
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
    { duration: 1000, reducedMotion: reduce, deps: [variant, dark, pitch] },
  );

  // --- SVG wireframe (retopo) over the clay, in the SAME normalized frame ---
  // viewBox is the unit form mapped to 0..VB with the same FORM_RY squash.
  const VB = 200;
  const wf = buildWireframe(VB, seed);

  // Wireframe draws on after the clay wipe; reduced-motion shows it resting.
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
      {/* clay shade — only mounts/paints when in view (useCanvas2D owns the IO) */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* retopo wireframe — drawn in the matching unit frame, on top of the clay */}
      <motion.svg
        viewBox={`0 0 ${VB} ${VB}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        {...wireProps}
      >
        <g stroke="currentColor" strokeWidth={0.6} opacity={wireOpacity} strokeLinecap="round">
          {/* longitudes — meridians sweeping pole to pole, draw L→R */}
          {wf.longitudes.map((d, i) => (
            <motion.path
              key={`lon-${i}`}
              d={d}
              variants={pathV}
              custom={0.5 + (i / wf.longitudes.length) * 0.5}
            />
          ))}
          {/* latitudes — rings stacked top→bottom, draw after meridians */}
          {wf.latitudes.map((d, i) => (
            <motion.path
              key={`lat-${i}`}
              d={d}
              variants={pathV}
              custom={0.62 + (i / wf.latitudes.length) * 0.42}
            />
          ))}
        </g>
        {/* crisp silhouette edge — the darkest line, drawn last to seat the form */}
        <motion.path
          d={wf.silhouette}
          stroke="currentColor"
          strokeWidth={1}
          strokeLinejoin="round"
          variants={pathV}
          custom={0.5}
        />
      </motion.svg>

      {/* coherence/retopo stamp */}
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

/* ------------------------------------------------------------------ */
/* Wireframe geometry — lat/long quad mesh over the same superellipsoid */
/* ------------------------------------------------------------------ */

interface Wireframe {
  longitudes: string[];
  latitudes: string[];
  silhouette: string;
}

/** Project a unit-sphere parametric (φ azimuth, ψ polar) onto the squashed
 *  superellipsoid silhouette in viewBox space. Front hemisphere only (z≥0). */
function project(phi: number, psi: number, half: number, cx: number, cy: number): Pt {
  // Sphere point.
  const sx = Math.sin(psi) * Math.cos(phi);
  const sy = Math.cos(psi);
  // Re-radius onto the superellipse silhouette for the on-screen x,y so the
  // wireframe hugs the same outline the dither clips to.
  const theta = Math.atan2(-sy, sx);
  const k = silhouetteR(theta);
  const rad = Math.hypot(sx, sy);
  const scale = rad > 1e-4 ? (k / 1) : 1;
  const u = sx * scale;
  const v = -sy * FORM_RY * scale;
  return { x: cx + u * half, y: cy + v * half };
}

function toPath(pts: Pt[]): string {
  if (pts.length === 0) return "";
  let d = `M ${r2(pts[0].x)} ${r2(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${r2(pts[i].x)} ${r2(pts[i].y)}`;
  return d;
}
const r2 = (n: number) => Math.round(n * 100) / 100;

function buildWireframe(VB: number, seed: number): Wireframe {
  const cx = VB / 2;
  const cy = VB / 2;
  // Slight deterministic jitter on the mesh density so instances differ a touch
  // (seed kept in the API for variety across tiles; bounded so the form is stable).
  const jit = ((seed % 5) - 2) * 0.012;
  const half = (VB / 2) * (1 / FORM_RY) * 0.86;

  const LONS = 12; // meridians across the visible front hemisphere
  const LATS = 9; // rings top→bottom
  const SAMPLES = 28;

  const longitudes: string[] = [];
  // Front hemisphere spans azimuth -90°..+90°.
  for (let i = 0; i < LONS; i++) {
    const phi = lerp(-Math.PI / 2, Math.PI / 2, i / (LONS - 1));
    const pts: Pt[] = [];
    for (let s = 0; s < SAMPLES; s++) {
      const psi = lerp(0.06, Math.PI - 0.06, s / (SAMPLES - 1));
      pts.push(project(phi, psi, half, cx, cy));
    }
    longitudes.push(toPath(pts));
  }

  const latitudes: string[] = [];
  for (let j = 1; j < LATS; j++) {
    const psi = lerp(0.06, Math.PI - 0.06, j / LATS) + jit;
    const pts: Pt[] = [];
    for (let s = 0; s < SAMPLES; s++) {
      const phi = lerp(-Math.PI / 2, Math.PI / 2, s / (SAMPLES - 1));
      pts.push(project(phi, psi, half, cx, cy));
    }
    latitudes.push(toPath(pts));
  }

  // Closed silhouette outline from the superellipse, matching the clipped clay.
  const outline: Pt[] = [];
  const OUT_N = 96;
  for (let i = 0; i <= OUT_N; i++) {
    const theta = (i / OUT_N) * Math.PI * 2;
    const k = silhouetteR(theta);
    const u = Math.cos(theta) * k;
    const v = Math.sin(theta) * k * FORM_RY;
    outline.push({ x: cx + u * half, y: cy + v * half });
  }
  const silhouette = toPath(outline) + " Z";

  return { longitudes, latitudes, silhouette };
}
