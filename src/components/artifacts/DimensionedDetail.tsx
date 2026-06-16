"use client";

import { useId } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * DimensionedDetail — a draughtsman's detail callout, pure SVG.
 *
 * A machined feature (a plate with a counterbored hole) rendered as a precise
 * hairline section view with the full apparatus of an engineering drawing:
 * 45° section hatching (SVG <pattern>), witness/extension lines, dimension
 * arrows, Ø/R/± callouts, a GD&T feature-control frame (datum + tolerance),
 * and a datum triangle. The "manufacturable, real GD&T, drawings" moat as an
 * authentic drawing fragment, in the monochrome instrument idiom.
 *
 * Color is ALWAYS currentColor — the parent sets the field via a `text-*`
 * class, so a dark/inverted variant works for free (paper-colored strokes on
 * the ink field). The part edge is the darkest stroke; hatch + witness lines
 * sit at reduced opacity so the silhouette reads first.
 *
 * Motion: plays once then holds (no loop). reduced-motion → final resting
 * frame immediately. Root is aria-hidden (decorative).
 *
 * @prop variant   "hero" (default, full dims + FCF + title strip) | "inline"
 *                 (compact: silhouette + bore/cbore Ø + FCF, no title strip).
 * @prop trigger   "view" (default, draws when scrolled into view, once) |
 *                 "load" (draws on mount — for above-the-fold heroes).
 * @prop startDelay  seconds added before the draw choreography begins.
 * @prop showDims  show the dimension cluster (witness lines, arrows, labels). Default true.
 * @prop showFCF   show the GD&T feature-control frame + datum triangle. Default true.
 * @prop className  sizing / color class for the responsive SVG (text-* sets the stroke).
 */

type Trigger = "load" | "view";

/* ---- Shared motion variant factories (depend only on EASE + startDelay) ---- */
const drawV = (s: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, ease: EASE, delay: s + d },
      opacity: { duration: 0.25, delay: s + d },
    },
  }),
});
const fadeV = (s: number, target = 1): Variants => ({
  hidden: { opacity: 0 },
  show: (d: number) => ({
    opacity: target,
    transition: { duration: 0.48, ease: EASE, delay: s + d },
  }),
});
const stampV = (s: number): Variants => ({
  hidden: { opacity: 0, scale: 0.9 },
  show: (d: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.34, ease: EASE, delay: s + d },
  }),
});

/* ============================================================
   <Dim> — reusable linear dimension: two points along one axis + a
   perpendicular offset. Emits witness (extension) lines, a dimension
   line with filled arrowheads, and a centered mono label. The core
   draughting primitive, reused for every measured quantity.
   ============================================================ */
function Dim({
  orient,
  a,
  b,
  pos,
  label,
  delay,
  arrowId,
  variants,
  flip = false,
}: {
  orient: "h" | "v";
  a: number; // start coordinate along the measured axis
  b: number; // end coordinate along the measured axis
  pos: number; // dimension-line position on the perpendicular axis
  label: string;
  delay: number;
  arrowId: string;
  variants: Variants;
  flip?: boolean; // witness lines extend to the opposite side
}) {
  const wit = 6; // gap from the feature to the witness-line start
  const ext = 6; // overshoot past the dimension line
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  if (orient === "h") {
    return (
      <motion.g stroke="currentColor" strokeWidth={1} variants={variants} custom={delay}>
        <g opacity={0.5}>
          <line x1={lo} y1={pos + (flip ? -wit : wit)} x2={lo} y2={pos + (flip ? ext : -ext)} />
          <line x1={hi} y1={pos + (flip ? -wit : wit)} x2={hi} y2={pos + (flip ? ext : -ext)} />
        </g>
        <line x1={lo} y1={pos} x2={hi} y2={pos} markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`} />
        <text
          x={(lo + hi) / 2}
          y={pos - 5}
          textAnchor="middle"
          className="fill-current font-mono"
          stroke="none"
          style={{ fontSize: 11, letterSpacing: 0 }}
        >
          {label}
        </text>
      </motion.g>
    );
  }
  return (
    <motion.g stroke="currentColor" strokeWidth={1} variants={variants} custom={delay}>
      <g opacity={0.5}>
        <line x1={pos + (flip ? -wit : wit)} y1={lo} x2={pos + (flip ? ext : -ext)} y2={lo} />
        <line x1={pos + (flip ? -wit : wit)} y1={hi} x2={pos + (flip ? ext : -ext)} y2={hi} />
      </g>
      <line x1={pos} y1={lo} x2={pos} y2={hi} markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`} />
      <text
        x={pos - 7}
        y={(lo + hi) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${pos - 7} ${(lo + hi) / 2})`}
        className="fill-current font-mono"
        stroke="none"
        style={{ fontSize: 11, letterSpacing: 0 }}
      >
        {label}
      </text>
    </motion.g>
  );
}

/* ============================================================
   <FeatureControlFrame> — GD&T primitive: a row of boxed compartments
   [sym | tol | datum...] in mono. The first cell is square (the geometric
   characteristic symbol); the rest size to their content.
   ============================================================ */
function FeatureControlFrame({
  x,
  y,
  cells,
  delay,
  variants,
}: {
  x: number;
  y: number;
  cells: string[];
  delay: number;
  variants: Variants;
}) {
  const h = 20;
  const widths = cells.map((c, i) => (i === 0 ? h : Math.max(26, c.length * 7.5 + 12)));
  // Prefix-sum the offsets without mutating a captured outer variable.
  const segs = widths.map((w, i) => ({
    x: x + widths.slice(0, i).reduce((acc, n) => acc + n, 0),
    w,
    text: cells[i],
  }));
  const total = widths.reduce((acc, n) => acc + n, 0);

  return (
    <motion.g variants={variants} custom={delay} style={{ transformOrigin: `${x}px ${y + h / 2}px` }}>
      <rect x={x} y={y} width={total} height={h} rx={2} fill="none" stroke="currentColor" strokeWidth={1.25} />
      {segs.slice(1).map((s) => (
        <line key={s.x} x1={s.x} y1={y} x2={s.x} y2={y + h} stroke="currentColor" strokeWidth={1.25} />
      ))}
      {segs.map((s) => (
        <text
          key={`t-${s.x}`}
          x={s.x + s.w / 2}
          y={y + h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-current font-mono"
          style={{ fontSize: 11, letterSpacing: 0 }}
        >
          {s.text}
        </text>
      ))}
    </motion.g>
  );
}

/* ============================================================
   <DatumFeature> — a filled datum triangle on the surface + a boxed
   datum label (the "A" reference the FCF points back to).
   ============================================================ */
function DatumFeature({
  x,
  y,
  label,
  delay,
  variants,
}: {
  x: number;
  y: number;
  label: string;
  delay: number;
  variants: Variants;
}) {
  const t = 7; // half-base of the triangle
  return (
    <motion.g variants={variants} custom={delay} style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M ${x} ${y} L ${x - t} ${y + 11} L ${x + t} ${y + 11} Z`} fill="currentColor" stroke="none" />
      <line x1={x} y1={y + 11} x2={x} y2={y + 20} stroke="currentColor" strokeWidth={1.25} />
      <rect x={x - 11} y={y + 20} width={22} height={20} rx={2} fill="none" stroke="currentColor" strokeWidth={1.25} />
      <text x={x} y={y + 30} textAnchor="middle" dominantBaseline="central" className="fill-current font-mono" style={{ fontSize: 11 }}>
        {label}
      </text>
    </motion.g>
  );
}

export function DimensionedDetail({
  variant = "hero",
  trigger = "view",
  startDelay = 0,
  showDims = true,
  showFCF = true,
  className,
}: {
  variant?: "hero" | "inline";
  trigger?: Trigger;
  startDelay?: number;
  showDims?: boolean;
  showFCF?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const hatchId = `dd-hatch-${uid}`;
  const arrowId = `dd-arrow-${uid}`;

  const inline = variant === "inline";

  // Resolve animation drivers. reduced-motion → snap to resting frame, no draw.
  const svgMotion = reduce
    ? ({ initial: false, animate: "show" } as const)
    : trigger === "load"
      ? ({ initial: "hidden", animate: "show" } as const)
      : ({
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "-60px" },
        } as const);

  // ---- Geometry (drawing space; viewBox 0 0 360 300) -------------------
  // Section through a plate with a counterbored hole on the centerline.
  const cx = 168; // hole / counterbore axis (also the centerline)
  const plateL = 44;
  const plateR = 292;
  const plateTop = 96;
  const plateBot = 236;

  const boreHalf = 17; // through-bore radius
  const cboreHalf = 31; // counterbore radius
  const cboreDepth = plateTop + 34; // depth of the counterbore step
  const fillet = 9; // inner fillet radius at the step

  // Solid section outline (the hatched region) as one closed path: the
  // outer rectangle with the stepped, filleted bore profile cut up the middle.
  const solidPath = [
    `M ${plateL} ${plateTop}`,
    `L ${cx - cboreHalf} ${plateTop}`,
    `L ${cx - cboreHalf} ${cboreDepth - fillet}`,
    `Q ${cx - cboreHalf} ${cboreDepth} ${cx - cboreHalf + fillet} ${cboreDepth}`,
    `L ${cx - boreHalf} ${cboreDepth}`,
    `L ${cx - boreHalf} ${plateBot}`,
    `L ${cx + boreHalf} ${plateBot}`,
    `L ${cx + boreHalf} ${cboreDepth}`,
    `L ${cx + cboreHalf - fillet} ${cboreDepth}`,
    `Q ${cx + cboreHalf} ${cboreDepth} ${cx + cboreHalf} ${cboreDepth - fillet}`,
    `L ${cx + cboreHalf} ${plateTop}`,
    `L ${plateR} ${plateTop}`,
    `L ${plateR} ${plateBot}`,
    `L ${plateL} ${plateBot}`,
    `Z`,
  ].join(" ");

  // Variant instances bound to this render's startDelay.
  const draw = drawV(startDelay);
  const fade = fadeV(startDelay, 1);
  const fadeHatch = fadeV(startDelay, 1);
  const fadeCenter = fadeV(startDelay, 0.4);
  const stamp = stampV(startDelay);

  return (
    <motion.svg
      viewBox="0 0 360 300"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full text-ink", className)}
      {...svgMotion}
    >
      <defs>
        {/* 45° hairline section hatch */}
        <pattern id={hatchId} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={7} stroke="currentColor" strokeWidth={0.75} opacity={0.4} />
        </pattern>
        {/* tiny filled-triangle arrowhead for dimension lines */}
        <marker
          id={arrowId}
          markerWidth={9}
          markerHeight={9}
          refX={7}
          refY={3}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 7 3 L 0 6 Z" fill="currentColor" stroke="none" />
        </marker>
      </defs>

      {/* SECTION HATCHING — fades in over the solid region, behind the edges */}
      <motion.path d={solidPath} fill={`url(#${hatchId})`} stroke="none" variants={fadeHatch} custom={0.85} />

      {/* dashed construction centerline through the bore axis */}
      <motion.line
        x1={cx}
        y1={plateTop - 26}
        x2={cx}
        y2={plateBot + 26}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="10 4 2 4"
        variants={fadeCenter}
        custom={0.05}
      />

      {/* PART EDGE — the darkest stroke, drawn on first */}
      <motion.path
        d={solidPath}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        variants={draw}
        custom={0.05}
      />

      {/* fillet leader → R callout */}
      {showDims && (
        <motion.g variants={fade} custom={1.5}>
          <line
            x1={cx + cboreHalf - 3}
            y1={cboreDepth - 3}
            x2={cx + cboreHalf + 34}
            y2={cboreDepth - 26}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.55}
          />
          <text x={cx + cboreHalf + 37} y={cboreDepth - 28} className="fill-current font-mono" stroke="none" style={{ fontSize: 11 }}>
            R 3
          </text>
        </motion.g>
      )}

      {/* DIMENSIONS ------------------------------------------------------ */}
      {showDims && (
        <>
          {/* through-bore Ø across the bore walls, inside the cavity */}
          <Dim orient="h" a={cx - boreHalf} b={cx + boreHalf} pos={plateBot - 18} label="Ø 6.0" delay={1.2} arrowId={arrowId} variants={fade} />
          {/* counterbore Ø above the plate */}
          <Dim orient="h" a={cx - cboreHalf} b={cx + cboreHalf} pos={plateTop - 16} label="⌴ Ø 11.0" delay={1.32} arrowId={arrowId} variants={fade} />
          {!inline && (
            <>
              {/* overall plate width across the top, well clear */}
              <Dim orient="h" a={plateL} b={plateR} pos={plateTop - 44} label="40.0 ±0.1" delay={1.46} arrowId={arrowId} variants={fade} />
              {/* plate thickness on the right edge */}
              <Dim orient="v" a={plateTop} b={plateBot} pos={plateR + 28} label="4.0" delay={1.6} arrowId={arrowId} variants={fade} flip />
              {/* counterbore depth on the left */}
              <Dim orient="v" a={plateTop} b={cboreDepth} pos={plateL - 18} label="2.0" delay={1.72} arrowId={arrowId} variants={fade} />
            </>
          )}
        </>
      )}

      {/* GD&T — feature-control frame + datum -----------------------------*/}
      {showFCF && (
        <>
          {/* leader from the bore to the FCF */}
          <motion.line
            x1={cx + boreHalf}
            y1={cboreDepth + 22}
            x2={inline ? plateR - 4 : 250}
            y2={inline ? plateBot + 30 : plateBot + 40}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.55}
            variants={fade}
            custom={1.85}
          />
          <FeatureControlFrame x={inline ? 196 : 232} y={inline ? plateBot + 22 : plateBot + 34} cells={["⌖", "Ø0.1", "A"]} delay={1.95} variants={stamp} />
          {!inline && <DatumFeature x={plateL + 18} y={plateBot} label="A" delay={2.05} variants={stamp} />}
        </>
      )}

      {/* TITLE STRIP — drawing-fragment caption (hero only) ---------------*/}
      {!inline && (
        <motion.g variants={fade} custom={2.15}>
          <line x1={plateL} y1={284} x2={plateR} y2={284} stroke="currentColor" strokeWidth={1} opacity={0.45} />
          <text x={plateL} y={296} className="fill-current font-mono" stroke="none" style={{ fontSize: 10, opacity: 0.7 }}>
            SECTION A–A · counterbored hole
          </text>
          <text x={plateR} y={296} textAnchor="end" className="fill-current font-mono" stroke="none" style={{ fontSize: 10 }}>
            ✓ GD&amp;T
          </text>
        </motion.g>
      )}
    </motion.svg>
  );
}
