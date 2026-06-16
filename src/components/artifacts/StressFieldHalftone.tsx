"use client";

import { useRef } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useCanvas2D, cssVar, clamp, lerp, BAYER8 } from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * StressFieldHalftone — an FEA result shown as PURE VALUE.
 *
 * A loaded L-bracket silhouette is filled with a von-Mises-style stress field
 * rendered as an ordered-dither (Bayer 8×8) halftone: dense, large ink dots
 * where stress is high (the re-entrant fillet corner + the fixed root), sparse
 * tiny dots where it is low. No false colour, ever — the entire field is value.
 * A crisp SVG overlay carries the part edge, the fixed-support hatching, the
 * load arrow, and a mono σ_vM density-key legend.
 *
 * Monochrome only: the canvas reads ink / paper purely via cssVar(); a dark /
 * inverted field is handled by passing `dark` so dots paint in paper.
 *
 * Motion: a single left→right reveal wipe (~0.9s) then HOLD. The rAF cancels
 * itself when complete and pauses off-screen (owned by useCanvas2D). Under
 * reduced motion the full field is painted once, synchronously, no wipe.
 *
 * @prop className   Sizing / colour-context classes (root is aria-hidden).
 * @prop dark        Invert for dark gravity fields — dots paint in --color-paper.
 * @prop pitch       Halftone grid pitch in CSS px (default 7). Smaller = denser.
 * @prop showLegend  Render the σ_vM MIN→MAX dot-density key bar (default true).
 * @prop showAnnotations  Render fixed-support hatch + load arrow + edge (default true).
 * @prop duration    Reveal-wipe duration in ms (default 900).
 */

type StressFieldHalftoneProps = {
  className?: string;
  dark?: boolean;
  pitch?: number;
  showLegend?: boolean;
  showAnnotations?: boolean;
  duration?: number;
};

/* ----- Geometry: an L-shaped cantilever bracket in a 0..100 × 0..100 space.
   Authored once and shared by the canvas (field + clip) and the SVG (edge,
   hatch, arrow). The inner re-entrant corner is filleted — the classic stress
   concentrator. Coordinates are y-down (screen) and scaled to canvas/viewBox. */
const VB = 100;
// Outer L: a tall back leg fixed on the left, a horizontal arm reaching right.
const BACK_L = 16; // left (fixed) edge
const BACK_R = 40; // back-leg right edge
const ARM_T = 60; // arm top edge
const ARM_R = 86; // arm free end (right)
const ARM_B = 78; // arm bottom edge
const TOP = 18; // back-leg top
const BOT = 78; // back-leg bottom (== arm bottom)
const FILLET = 11; // inner re-entrant fillet radius
// Inner re-entrant corner (concave) sits at (BACK_R, ARM_T).
const FCX = BACK_R + FILLET; // fillet arc centre x
const FCY = ARM_T + FILLET; // fillet arc centre y

// Closed outline path (clockwise from top-left), with the inner re-entrant
// corner as a concave quarter-arc fillet — the classic stress concentrator.
const EDGE_PATH =
  `M ${BACK_L} ${TOP} ` +
  `L ${BACK_R} ${TOP} ` +
  `L ${BACK_R} ${ARM_T} ` +
  `A ${FILLET} ${FILLET} 0 0 0 ${FCX} ${ARM_T + FILLET} ` + // concave fillet into the arm
  `L ${ARM_R} ${ARM_T + FILLET} ` +
  `L ${ARM_R} ${ARM_B} ` +
  `L ${BACK_L} ${BOT} Z`;

// Free-end load point (where the arrow pushes down) and the fixed-root midline.
const LOAD_X = ARM_R - 6;
const LOAD_TOP = ARM_T + FILLET;
const ROOT_X = BACK_L;

/* ----- Scalar von-Mises-style field over the silhouette, normalised 0..1.
   Three physically-motivated terms, all in the 0..100 authoring space:
     1. Bending gradient — a cantilever's moment grows toward the fixed root,
        so stress rises with distance from the loaded free end (≈ linear).
     2. Fillet concentrator — 1/r² blow-up at the re-entrant corner (the part's
        true hot-spot), clamped so it doesn't singularise.
     3. Root concentrator — elevated stress along the fixed support edge.
   Returns clamp(0,1). */
function vonMises(x: number, y: number): number {
  // 1) bending: distance from the loaded free end, normalised by arm reach.
  const bend = clamp((LOAD_X - x) / (LOAD_X - ROOT_X), 0, 1);

  // 2) fillet concentrator at the re-entrant corner.
  const dfx = x - FCX;
  const dfy = y - FCY;
  const r2f = dfx * dfx + dfy * dfy;
  const fillet = clamp(34 / (r2f + 6), 0, 1);

  // 3) root edge concentrator — proximity to the fixed left edge, weighted by
  //    how far down the back leg (peak near the loaded side of the root).
  const dRoot = Math.abs(x - ROOT_X);
  const root = clamp(1 - dRoot / 14, 0, 1) * 0.55;

  // Combine: bending sets the base gradient, concentrators stack on top.
  const v = 0.18 + bend * 0.62 + fillet * 0.9 + root * 0.5;
  // Gentle gamma to spread mid-tones for a richer halftone.
  return clamp(Math.pow(clamp(v, 0, 1), 0.85), 0, 1);
}

/* Build the clip Path2D from the same edge geometry, scaled to canvas px. */
function clipPath(scale: number): Path2D {
  const s = (n: number) => n * scale;
  const p = new Path2D();
  p.moveTo(s(BACK_L), s(TOP));
  p.lineTo(s(BACK_R), s(TOP));
  p.lineTo(s(BACK_R), s(ARM_T));
  // concave fillet (counter-clockwise quarter arc) approximated with a cubic.
  // control points pull the curve toward the corner for a clean fillet.
  const k = 0.5523 * FILLET;
  p.bezierCurveTo(
    s(BACK_R),
    s(ARM_T + k),
    s(FCX - FILLET + k),
    s(ARM_T + FILLET),
    s(FCX),
    s(ARM_T + FILLET),
  );
  p.lineTo(s(ARM_R), s(ARM_T + FILLET));
  p.lineTo(s(ARM_R), s(ARM_B));
  p.lineTo(s(BACK_L), s(BOT));
  p.closePath();
  return p;
}

const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (d: number) => ({ opacity: 1, transition: { duration: 0.45, delay: d, ease: EASE } }),
};
const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.6, ease: EASE, delay: d }, opacity: { duration: 0.2, delay: d } },
  }),
};

export function StressFieldHalftone({
  className,
  dark = false,
  pitch = 7,
  showLegend = true,
  showAnnotations = true,
  duration = 900,
}: StressFieldHalftoneProps) {
  const reduce = useReducedMotion() ?? false;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useCanvas2D(
    canvasRef,
    (ctx, w, h, p) => {
      // Square-ish field mapped from the 0..100 authoring space; letter-box to
      // keep the part centred regardless of container aspect.
      const scale = Math.min(w, h) / VB;
      const offX = (w - VB * scale) / 2;
      const offY = (h - VB * scale) / 2;

      const ink = cssVar(dark ? "--color-paper" : "--color-ink", canvasRef.current) || (dark ? "#fafafa" : "#11151c");
      ctx.fillStyle = ink;

      // Clip every dot to the part silhouette.
      ctx.save();
      ctx.translate(offX, offY);
      ctx.clip(clipPath(scale));

      // Reveal wipe: only paint cells whose x has been "swept" by p (L→R).
      const sweepX = VB * scale * (reduce ? 1 : p);
      const softEdge = 6 * scale; // a few px of feathering at the wipe front.

      const step = Math.max(3, pitch);
      // Iterate the halftone grid in CSS px across the part's local box.
      for (let py = 0; py <= VB * scale; py += step) {
        for (let px = 0; px <= VB * scale; px += step) {
          if (px > sweepX) break; // beyond the reveal front this frame.

          // Sample the field in authoring coordinates.
          const fx = px / scale;
          const fy = py / scale;
          let v = vonMises(fx, fy);
          if (v <= 0.02) continue;

          // Soft fade-in right at the wipe front so the reveal reads as motion.
          if (!reduce) {
            const frontDist = sweepX - px;
            if (frontDist < softEdge) v *= clamp(frontDist / softEdge, 0, 1);
            if (v <= 0.02) continue;
          }

          // Ordered dither: gate the dot on the Bayer threshold so low-stress
          // regions thin out into a classic printed-stress-plot texture.
          const bx = Math.round(px / step);
          const by = Math.round(py / step);
          const thresh = BAYER8[(by & 7) * 8 + (bx & 7)];
          if (v < thresh * 0.62) continue; // sub-threshold cells stay blank.

          // Variable-radius halftone: dot radius grows with stress.
          const maxR = step * 0.52;
          const r = lerp(0.4, maxR, v);
          ctx.globalAlpha = lerp(0.45, 1, v);
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    },
    { duration, reducedMotion: reduce, deps: [dark, pitch] },
  );

  // Overlay timing: edge draws first, then support hatch, load arrow, legend —
  // landing just as the canvas wipe completes. (Reduced motion → all at rest.)
  const t = reduce ? 0 : duration / 1000;
  const overlay = reduce
    ? ({ initial: false, animate: "show" } as const)
    : ({ initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } } as const);

  const stroke = dark ? "text-paper" : "text-ink";

  return (
    <div aria-hidden className={cn("relative", stroke, className)}>
      {/* Canvas halftone field (lazy, dpr-capped, off-screen-paused). */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Crisp vector overlay: edge · fixed support · load arrow · legend. */}
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        {...overlay}
      >
        <defs>
          <marker
            id="sfh-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="9"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M1 1 L5 9 L9 1" stroke="currentColor" strokeWidth={1.4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          </marker>
        </defs>

        {showAnnotations && (
          <>
            {/* Part silhouette edge — the darkest, crispest stroke. */}
            <motion.path
              d={EDGE_PATH}
              stroke="currentColor"
              strokeWidth={1.1}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              variants={drawV}
              custom={0}
            />

            {/* Fixed-support hatching on the left edge: a ground line + 45° ticks. */}
            <motion.g
              stroke="currentColor"
              strokeWidth={0.8}
              opacity={0.55}
              vectorEffect="non-scaling-stroke"
              variants={fadeV}
              custom={t * 0.5}
            >
              <line x1={BACK_L - 3} y1={TOP - 1} x2={BACK_L - 3} y2={BOT + 1} vectorEffect="non-scaling-stroke" />
              {Array.from({ length: 8 }, (_, i) => {
                const yy = TOP + ((BOT - TOP) / 7) * i;
                return (
                  <line
                    key={i}
                    x1={BACK_L - 3}
                    y1={yy}
                    x2={BACK_L - 7}
                    y2={yy + 4}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </motion.g>

            {/* Applied load arrow at the free end (pointing down into the arm). */}
            <motion.g variants={fadeV} custom={t * 0.65}>
              <line
                x1={LOAD_X}
                y1={LOAD_TOP - 13}
                x2={LOAD_X}
                y2={LOAD_TOP - 1.5}
                stroke="currentColor"
                strokeWidth={1.2}
                markerEnd="url(#sfh-arrow)"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={LOAD_X + 2.5}
                y={LOAD_TOP - 10}
                className="fill-current font-mono"
                style={{ fontSize: 4.2, letterSpacing: "-0.02em" }}
              >
                F
              </text>
            </motion.g>
          </>
        )}

        {/* σ_vM density-key legend: a MIN→MAX dot ramp + mono labels. */}
        {showLegend && (
          <motion.g variants={fadeV} custom={t * 0.8}>
            <text
              x={ARM_R}
              y={92.5}
              textAnchor="end"
              className="fill-current font-mono"
              style={{ fontSize: 3.4, opacity: 0.6, letterSpacing: "0.08em" }}
            >
              σ_vM
            </text>
            {Array.from({ length: 11 }, (_, i) => {
              const f = i / 10;
              const x = lerp(56, 86, f);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={96}
                  r={lerp(0.35, 1.55, f)}
                  className="fill-current"
                  opacity={lerp(0.4, 1, f)}
                />
              );
            })}
            <text x={56} y={92.5} textAnchor="start" className="fill-current font-mono" style={{ fontSize: 3, opacity: 0.45 }}>
              MIN
            </text>
            <text x={86} y={92.5} textAnchor="end" className="fill-current font-mono" style={{ fontSize: 3, opacity: 0.45 }}>
              MAX
            </text>
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
}
