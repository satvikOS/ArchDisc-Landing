"use client";

import { useId } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { catmullRom, type Pt } from "@/lib/artkit";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * ParametricRevolveLathe — the marquee evolution of ThroughLine.
 *
 * A single hairline 2D profile is captured, swept around a dashed construction
 * axis into a revolved solid of stacked greyscale lathe-rings, then dimensioned
 * (Ø / wall / h witness lines) and stamped "✓ valid" by the coherence gate.
 * The literal "describe it → Archie builds it → kernel validates it" arc, in one
 * drawing. Plays once then holds; never loops.
 *
 * Pure SVG + motion path-draw — data-driven by a {y, r} control-point profile.
 * Monochrome only: every stroke/fill is currentColor (set the color via a
 * parent text-* class; a dark field just uses text-paper). Responsive viewBox.
 * Decorative (aria-hidden).
 *
 * @prop profile     Control points {y, r} along the axis, top→bottom. The
 *                   silhouette is the right side + an x-mirrored left side.
 *                   Default: a shelled vase (r 18→34→30→22 over y 54→200).
 * @prop axisX       X of the revolve/construction axis in viewBox units. Default 180.
 * @prop showDims    Render the dimension group + tool-call chip + valid stamp. Default true.
 * @prop startDelay  Seconds to delay the choreography (lets a hero stagger settle). Default 0.
 * @prop variant     'hero' draws on load; 'inline' draws once when scrolled into view. Default 'hero'.
 * @prop diameter    Mono label for the Ø witness line. Default "Ø 60.0".
 * @prop height      Mono label for the vertical height witness line. Default "h 146".
 * @prop wall        Mono label for the wall-thickness leader. Default "wall 2.0".
 * @prop toolCall    Mono label for the tool-call chip. Default "part.revolve()".
 * @prop className   Sizing/color hook spread onto the root <svg>.
 */

export type RevolveProfilePoint = { y: number; r: number };

const VW = 360;
const VH = 240;
/** Fixed perspective squash for the lathe rings (ry = r * SQUASH). */
const SQUASH = 0.26;

const DEFAULT_PROFILE: RevolveProfilePoint[] = [
  { y: 54, r: 18 },
  { y: 78, r: 28 },
  { y: 104, r: 34 },
  { y: 132, r: 33 },
  { y: 160, r: 30 },
  { y: 186, r: 25 },
  { y: 200, r: 22 },
];

/** Path draw-on: pathLength 0→1 with a quick opacity fade, after delay `d`. */
const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.85, ease: EASE, delay: d },
      opacity: { duration: 0.25, delay: d },
    },
  }),
};

/** Ring draw-on that resolves to a target opacity (near-edge density fake). */
const ringV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: ({ d, o }: { d: number; o: number }) => ({
    pathLength: 1,
    opacity: o,
    transition: {
      pathLength: { duration: 0.5, ease: EASE, delay: d },
      opacity: { duration: 0.3, delay: d },
    },
  }),
};

/** Plain fade-in to a target opacity, after delay `d`. */
const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: ({ d, o = 1 }: { d: number; o?: number }) => ({
    opacity: o,
    transition: { duration: 0.4, delay: d },
  }),
};

/** Scale-in stamp for the coherence-gate tag. */
const stampV: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: (d: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: EASE, delay: d },
  }),
};

export function ParametricRevolveLathe({
  profile = DEFAULT_PROFILE,
  axisX = 180,
  showDims = true,
  startDelay = 0,
  variant = "hero",
  diameter = "Ø 60.0",
  height = "h 146",
  wall = "wall 2.0",
  toolCall = "part.revolve()",
  className,
}: {
  profile?: RevolveProfilePoint[];
  axisX?: number;
  showDims?: boolean;
  startDelay?: number;
  variant?: "hero" | "inline";
  diameter?: string;
  height?: string;
  wall?: string;
  toolCall?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:]/g, "");

  // Drive a parent → children variant cascade so the choreography stays in one
  // timeline. Reduced motion resolves to the final frame instantly; 'inline'
  // reprises draw once when scrolled into view; 'hero' draws on load.
  const motionProps = reduce
    ? ({ initial: false, animate: "show" } as const)
    : variant === "inline"
      ? ({
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "-60px" },
        } as const)
      : ({ initial: "hidden", animate: "show" } as const);

  // --- Geometry from the profile ---------------------------------------------
  const sorted = [...profile].sort((a, b) => a.y - b.y);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const maxR = sorted.reduce((m, p) => Math.max(m, p.r), 0);
  const maxPt = sorted.find((p) => p.r === maxR) ?? sorted[0];

  // Sketch profile (right half only) — catmull-rom through the control points,
  // serialized to a cubic-bezier d-string. Drawn dashed as the "captured sketch".
  const sketchPts: Pt[] = sorted.map((p) => ({ x: axisX + p.r, y: p.y }));
  const sketchD = catmullRom(sketchPts, false);

  // Solid silhouette: right side top→bottom, then x-mirrored left side
  // bottom→top, closed. catmull-rom through the union so it reads as one
  // machined outline with rounded joins.
  const silhouettePts: Pt[] = [
    ...sorted.map((p) => ({ x: axisX + p.r, y: p.y })),
    ...[...sorted].reverse().map((p) => ({ x: axisX - p.r, y: p.y })),
  ];
  const silhouetteD = catmullRom(silhouettePts, true);

  // Lathe rings — one ellipse per control point. Opacity ramps 0.4→0.7 down the
  // axis to fake near-edge density; the rim (first) is the crisp leading edge.
  const n = sorted.length;
  const rings = sorted.map((p, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    const o = 0.4 + t * 0.3;
    return { ...p, o, isRim: i === 0 };
  });

  // Dimension geometry.
  const dimTopY = top.y - 22; // Ø witness above the rim
  const leftX = axisX - maxR;
  const rightX = axisX + maxR;
  const heightX = rightX + 30; // vertical height witness to the right
  const wallLeaderFrom: Pt = { x: axisX + maxPt.r, y: maxPt.y };

  return (
    <motion.svg
      viewBox={`0 0 ${VW} ${VH}`}
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full text-ink", className)}
      {...motionProps}
    >
      {/* PHASE 1 — dashed construction centerline */}
      <motion.line
        x1={axisX}
        y1={top.y - 16}
        x2={axisX}
        y2={bottom.y + 10}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 5"
        variants={fadeV}
        custom={{ d: startDelay, o: 0.3 }}
      />

      {/* PHASE 1 — captured sketch profile (right half, dashed) */}
      <motion.path
        d={sketchD}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeDasharray="4 5"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          show: {
            pathLength: 1,
            opacity: 0.4,
            transition: {
              pathLength: { duration: 0.85, ease: EASE, delay: startDelay + 0.1 },
              opacity: { duration: 0.25, delay: startDelay + 0.1 },
            },
          },
        }}
      />

      {/* PHASE 2 — solid silhouette (mirrored profile, one closed path) */}
      <motion.path
        d={silhouetteD}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        variants={drawV}
        custom={startDelay + 0.55}
      />

      {/* PHASE 2 — revolve rings inflate top→bottom, 0.06s apart */}
      <g>
        {rings.map((ring, i) => (
          <motion.ellipse
            key={`${uid}-ring-${i}`}
            cx={axisX}
            cy={ring.y}
            rx={ring.r}
            ry={Math.max(2, ring.r * SQUASH)}
            stroke="currentColor"
            strokeWidth={ring.isRim ? 1.5 : 1}
            variants={ringV}
            custom={{ d: startDelay + 0.78 + i * 0.06, o: ring.o }}
          />
        ))}
        {/* inner rim ellipse — reads as the shelled wall on the leading edge */}
        <motion.ellipse
          cx={axisX}
          cy={top.y}
          rx={Math.max(4, top.r - 5)}
          ry={Math.max(1.5, (top.r - 5) * SQUASH)}
          stroke="currentColor"
          strokeWidth={1}
          variants={ringV}
          custom={{ d: startDelay + 0.92, o: 0.6 }}
        />
      </g>

      {showDims && (
        <>
          {/* PHASE 3 — Ø dimension: horizontal witness across max radius */}
          <motion.g
            stroke="currentColor"
            strokeWidth={1}
            variants={fadeV}
            custom={{ d: startDelay + 1.35, o: 0.5 }}
          >
            <line x1={leftX} y1={dimTopY} x2={rightX} y2={dimTopY} />
            <line x1={leftX} y1={dimTopY - 6} x2={leftX} y2={dimTopY + 16} />
            <line x1={rightX} y1={dimTopY - 6} x2={rightX} y2={dimTopY + 16} />
            {/* tiny arrowheads */}
            <path d={`M${leftX} ${dimTopY} l5 -2.5 l0 5 Z`} fill="currentColor" stroke="none" />
            <path d={`M${rightX} ${dimTopY} l-5 -2.5 l0 5 Z`} fill="currentColor" stroke="none" />
          </motion.g>
          <motion.text
            x={axisX}
            y={dimTopY - 6}
            textAnchor="middle"
            className="fill-muted font-mono"
            style={{ fontSize: 11, fontVariantNumeric: "tabular-nums slashed-zero" }}
            variants={fadeV}
            custom={{ d: startDelay + 1.45 }}
          >
            {diameter}
          </motion.text>

          {/* PHASE 3 — height dimension: vertical witness to the right */}
          <motion.g
            stroke="currentColor"
            strokeWidth={1}
            variants={fadeV}
            custom={{ d: startDelay + 1.5, o: 0.5 }}
          >
            <line x1={heightX} y1={top.y} x2={heightX} y2={bottom.y} />
            <line x1={heightX - 6} y1={top.y} x2={heightX + 8} y2={top.y} />
            <line x1={heightX - 6} y1={bottom.y} x2={heightX + 8} y2={bottom.y} />
            <path d={`M${heightX} ${top.y} l-2.5 5 l5 0 Z`} fill="currentColor" stroke="none" />
            <path d={`M${heightX} ${bottom.y} l-2.5 -5 l5 0 Z`} fill="currentColor" stroke="none" />
          </motion.g>
          <motion.text
            x={heightX + 6}
            y={(top.y + bottom.y) / 2}
            textAnchor="start"
            dominantBaseline="middle"
            className="fill-muted font-mono"
            style={{ fontSize: 11, fontVariantNumeric: "tabular-nums slashed-zero" }}
            variants={fadeV}
            custom={{ d: startDelay + 1.55 }}
          >
            {height}
          </motion.text>

          {/* PHASE 3 — wall leader: a short pointer from the widest profile edge */}
          <motion.g variants={fadeV} custom={{ d: startDelay + 1.62, o: 0.55 }}>
            <line
              x1={wallLeaderFrom.x}
              y1={wallLeaderFrom.y}
              x2={leftX - 20}
              y2={wallLeaderFrom.y + 18}
              stroke="currentColor"
              strokeWidth={1}
            />
            <circle cx={wallLeaderFrom.x} cy={wallLeaderFrom.y} r={1.6} fill="currentColor" />
            <text
              x={leftX - 22}
              y={wallLeaderFrom.y + 22}
              textAnchor="end"
              className="fill-muted font-mono"
              style={{ fontSize: 10.5, fontVariantNumeric: "tabular-nums slashed-zero" }}
            >
              {wall}
            </text>
          </motion.g>

          {/* PHASE 4 — tool-call chip */}
          <motion.g variants={stampV} custom={startDelay + 1.78}>
            <rect
              x={VW - 150}
              y={VH - 30}
              width={140}
              height={20}
              rx={2}
              stroke="currentColor"
              strokeWidth={1}
              opacity={0.4}
            />
            <text
              x={VW - 142}
              y={VH - 16.5}
              textAnchor="start"
              className="fill-ink-soft font-mono"
              style={{ fontSize: 10 }}
            >
              {`tool-call: ${toolCall}`}
            </text>
          </motion.g>

          {/* PHASE 4 — coherence-gate "valid" stamp */}
          <motion.g variants={stampV} custom={startDelay + 1.95}>
            <rect
              x={leftX - 8}
              y={bottom.y - 6}
              width={56}
              height={20}
              rx={2}
              stroke="currentColor"
              strokeWidth={1}
              opacity={0.45}
            />
            <text
              x={leftX + 20}
              y={bottom.y + 7.5}
              textAnchor="middle"
              className="fill-ink font-mono"
              style={{ fontSize: 10 }}
            >
              ✓ valid
            </text>
          </motion.g>
        </>
      )}
    </motion.svg>
  );
}
