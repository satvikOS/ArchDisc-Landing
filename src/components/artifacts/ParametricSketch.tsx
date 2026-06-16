"use client";

import { useEffect, useId } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
  type Variants,
  type MotionValue,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * ParametricSketch — the FORGE signature, a 2D parametric sketch that resolves
 * to fully constrained.
 *
 * A flanged-bracket profile is drawn on a faint sketch grid over a dashed
 * construction skeleton, then constraint GLYPHS stamp in one by one —
 * coincident dots, parallel `//`, perpendicular `⌐`, equal `=`, horizontal /
 * vertical ticks, a grounded fix/anchor — each removing degrees of freedom from
 * the sketch. A live DOF readout ticks down in lockstep with the stamps and
 * resolves to "DOF 0 · fully constrained", conveying a real constraint solver
 * with degree-of-freedom tracking. Dimension callouts (100.0, R3, ⌀6) annotate
 * the resolved profile. Plays once, then holds — never loops.
 *
 * Pure SVG + motion path-draw. Monochrome only: every stroke/fill is
 * currentColor, so the parent picks the field with a `text-*` class and a
 * dark/inverted variant works for free (pass text-paper on an ink field).
 * Responsive viewBox + h-full w-full. Decorative (aria-hidden).
 *
 * @prop variant     'hero' (default) draws on load with full dims + DOF panel;
 *                   'inline' is compact (core profile + glyphs + DOF chip) and
 *                   draws once when scrolled into view.
 * @prop trigger     'load' (default for hero) draws on mount; 'view' draws once
 *                   when scrolled into view. Explicitly overrides the variant default.
 * @prop startDelay  Seconds added before the choreography begins (lets a hero
 *                   stagger settle). Default 0.
 * @prop className   Sizing / color hook spread onto the root <svg>.
 */

type Variant = "hero" | "inline";
type Trigger = "load" | "view";

const VW = 360;
const VH = 280;

/* ---- Motion variant factories — depend only on EASE + the render's startDelay. */

/** Path draw-on: pathLength 0→1 with a quick opacity fade-in, after delay `d`. */
const drawV = (s: number, dur = 0.8): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: dur, ease: EASE, delay: s + d },
      opacity: { duration: 0.25, delay: s + d },
    },
  }),
});

/** Plain fade to a target opacity, after delay `d` (custom: {d, o}). */
const fadeV = (s: number): Variants => ({
  hidden: { opacity: 0 },
  show: ({ d, o = 1 }: { d: number; o?: number }) => ({
    opacity: o,
    transition: { duration: 0.42, ease: EASE, delay: s + d },
  }),
});

/** Glyph stamp: a constraint mark snaps into place (scale + fade), after delay `d`. */
const stampV = (s: number): Variants => ({
  hidden: { opacity: 0, scale: 0.55 },
  show: (d: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.2, delay: s + d },
      scale: { duration: 0.32, ease: EASE, delay: s + d },
    },
  }),
});

/* ============================================================
   Geometry — a flanged bracket section profile in viewBox space.
   One closed outline: a tall web with a foot flange and a filleted
   inner pocket, with a bored hole on the upper web. Authored as
   ordered vertices so witness lines + glyphs can anchor to real edges.
   ============================================================ */

type Pt = { x: number; y: number };

// Outer profile vertices (clockwise from top-left). Drawing units.
const OX = 92; // left web edge
const OR = 250; // right flange edge
const TOP = 58; // top of web
const SHOULDER = 150; // where the web meets the flange step
const FOOT = 214; // bottom of the foot
const WEB_R = 150; // right edge of the upright web (before the flange)
const FILLET = 14; // inner fillet radius at the shoulder

// The bracket outline as a single closed path with one rounded inner corner.
const OUTLINE_D = [
  `M ${OX} ${TOP}`,
  `L ${WEB_R} ${TOP}`,
  `L ${WEB_R} ${SHOULDER - FILLET}`,
  `Q ${WEB_R} ${SHOULDER} ${WEB_R + FILLET} ${SHOULDER}`,
  `L ${OR} ${SHOULDER}`,
  `L ${OR} ${FOOT}`,
  `L ${OX} ${FOOT}`,
  `Z`,
].join(" ");

// Bored hole on the upper web.
const HOLE: Pt = { x: 121, y: 96 };
const HOLE_R = 11;

// Foot mounting slot center (small radius detail → R3 callout).
const SLOT: Pt = { x: 224, y: 184 };
const SLOT_R = 9;

/* Construction skeleton — the dashed under-drawing the solver fits to. */
const SKELETON: Array<[Pt, Pt]> = [
  [{ x: OX, y: TOP }, { x: OR, y: TOP }], // top guide
  [{ x: OX, y: TOP }, { x: OX, y: FOOT }], // left guide
  [{ x: OX, y: FOOT }, { x: OR, y: FOOT }], // base guide
  [{ x: WEB_R, y: TOP }, { x: WEB_R, y: FOOT }], // web datum
  [{ x: OX, y: SHOULDER }, { x: OR, y: SHOULDER }], // shoulder datum
];

/* ============================================================
   <Dim> — a linear dimension: witness lines, a dimension line with
   filled arrowheads, and a centered mono label.
   ============================================================ */
function Dim({
  orient,
  a,
  b,
  pos,
  label,
  d,
  variants,
  flip = false,
}: {
  orient: "h" | "v";
  a: number;
  b: number;
  pos: number;
  label: string;
  d: number;
  variants: Variants;
  flip?: boolean;
}) {
  const wit = 5;
  const ext = 6;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  if (orient === "h") {
    return (
      <motion.g stroke="currentColor" strokeWidth={1} variants={variants} custom={{ d, o: 0.7 }}>
        <g opacity={0.55}>
          <line x1={lo} y1={pos + (flip ? -wit : wit)} x2={lo} y2={pos + (flip ? ext : -ext)} />
          <line x1={hi} y1={pos + (flip ? -wit : wit)} x2={hi} y2={pos + (flip ? ext : -ext)} />
        </g>
        <line x1={lo} y1={pos} x2={hi} y2={pos} />
        <path d={`M${lo} ${pos} l6 -2.5 l0 5 Z`} fill="currentColor" stroke="none" />
        <path d={`M${hi} ${pos} l-6 -2.5 l0 5 Z`} fill="currentColor" stroke="none" />
        <text
          x={(lo + hi) / 2}
          y={pos - 5}
          textAnchor="middle"
          className="fill-current font-mono"
          stroke="none"
          style={{ fontSize: 11, letterSpacing: 0, fontVariantNumeric: "tabular-nums slashed-zero" }}
        >
          {label}
        </text>
      </motion.g>
    );
  }
  return (
    <motion.g stroke="currentColor" strokeWidth={1} variants={variants} custom={{ d, o: 0.7 }}>
      <g opacity={0.55}>
        <line x1={pos + (flip ? -wit : wit)} y1={lo} x2={pos + (flip ? ext : -ext)} y2={lo} />
        <line x1={pos + (flip ? -wit : wit)} y1={hi} x2={pos + (flip ? ext : -ext)} y2={hi} />
      </g>
      <line x1={pos} y1={lo} x2={pos} y2={hi} />
      <path d={`M${pos} ${lo} l-2.5 6 l5 0 Z`} fill="currentColor" stroke="none" />
      <path d={`M${pos} ${hi} l-2.5 -6 l5 0 Z`} fill="currentColor" stroke="none" />
      <text
        x={pos - 6}
        y={(lo + hi) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${pos - 6} ${(lo + hi) / 2})`}
        className="fill-current font-mono"
        stroke="none"
        style={{ fontSize: 11, letterSpacing: 0, fontVariantNumeric: "tabular-nums slashed-zero" }}
      >
        {label}
      </text>
    </motion.g>
  );
}

/* ============================================================
   Constraint glyphs — each is a small mark + an invisible anchor so it
   stamps right onto the edge/vertex it constrains. transformOrigin is set
   to the glyph center so the stamp scales from its own middle.
   ============================================================ */
type GlyphKind = "coincident" | "parallel" | "perp" | "equal" | "horiz" | "vert" | "fix";

function Glyph({
  kind,
  x,
  y,
  d,
  variants,
  angle = 0,
}: {
  kind: GlyphKind;
  x: number;
  y: number;
  d: number;
  variants: Variants;
  angle?: number;
}) {
  return (
    <motion.g
      variants={variants}
      custom={d}
      style={{ transformOrigin: `${x}px ${y}px` }}
      transform={angle ? `rotate(${angle} ${x} ${y})` : undefined}
    >
      {kind === "coincident" && (
        <>
          <circle cx={x} cy={y} r={4.4} fill="none" stroke="currentColor" strokeWidth={1.25} />
          <circle cx={x} cy={y} r={1.6} fill="currentColor" stroke="none" />
        </>
      )}
      {kind === "parallel" && (
        <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
          <line x1={x - 4} y1={y - 4} x2={x - 4} y2={y + 4} />
          <line x1={x + 1} y1={y - 4} x2={x + 1} y2={y + 4} />
        </g>
      )}
      {kind === "perp" && (
        <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="square" fill="none">
          <path d={`M ${x - 4} ${y - 5} L ${x - 4} ${y + 4} L ${x + 5} ${y + 4}`} />
        </g>
      )}
      {kind === "equal" && (
        <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
          <line x1={x - 4.5} y1={y - 2.2} x2={x + 4.5} y2={y - 2.2} />
          <line x1={x - 4.5} y1={y + 2.2} x2={x + 4.5} y2={y + 2.2} />
        </g>
      )}
      {kind === "horiz" && (
        <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
          <line x1={x - 5} y1={y - 3} x2={x - 5} y2={y + 3} />
          <line x1={x + 5} y1={y - 3} x2={x + 5} y2={y + 3} />
        </g>
      )}
      {kind === "vert" && (
        <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
          <line x1={x - 3} y1={y - 5} x2={x + 3} y2={y - 5} />
          <line x1={x - 3} y1={y + 5} x2={x + 3} y2={y + 5} />
        </g>
      )}
      {kind === "fix" && (
        <g stroke="currentColor" strokeWidth={1.3} fill="none">
          {/* anchor/ground: a vertex dot with three hatch ticks under a baseline */}
          <circle cx={x} cy={y} r={2.2} fill="currentColor" stroke="none" />
          <line x1={x - 6} y1={y + 5} x2={x + 6} y2={y + 5} />
          <line x1={x - 5} y1={y + 5} x2={x - 8} y2={y + 9} />
          <line x1={x} y1={y + 5} x2={x - 3} y2={y + 9} />
          <line x1={x + 5} y1={y + 5} x2={x + 2} y2={y + 9} />
        </g>
      )}
    </motion.g>
  );
}

/* ============================================================
   <DofReadout> — the live degree-of-freedom counter. A motion value runs
   the DOF count down through keyframes timed to the constraint stamps, and
   the integer is rendered as the text content of a <motion.text>. When the
   count reaches 0 the panel crossfades to the "fully constrained" state.
   All animation is declarative (motion values + animate()); no setState in
   an effect body, no ref reads during render.
   ============================================================ */
// One DOF removed per constraint glyph. The countdown runs START_DOF → 0.
const START_DOF = 7;

function DofPanel({
  reduce,
  startDelay,
  inline,
  resolvedAt,
  dof,
  dofText,
  solving,
  constrained,
}: {
  reduce: boolean;
  startDelay: number;
  inline: boolean;
  resolvedAt: number;
  dof: MotionValue<number>;
  dofText: MotionValue<string>;
  solving: MotionValue<number>;
  constrained: MotionValue<number>;
}) {
  // Panel chrome + bar geometry.
  const px = inline ? 12 : 18;
  const py = VH - (inline ? 30 : 36);
  const pw = inline ? 152 : 192;
  const ph = inline ? 22 : 26;
  const barX = px + (inline ? 64 : 92);
  const barW = pw - (barX - px) - 10;
  const barY = py + ph / 2;

  // Solve-progress fill: fraction of DOF removed (1 - dof/START_DOF).
  const barFill = useTransform(dof, (v) => 1 - Math.max(0, Math.min(1, v / START_DOF)));

  return (
    <motion.g
      // The panel container fades in once the choreography reaches it.
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : startDelay + 0.45 }}
    >
      <rect
        x={px - 8}
        y={py - 6}
        width={pw}
        height={ph}
        rx={3}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.4}
      />
      {/* label */}
      <text
        x={px - 1}
        y={barY}
        dominantBaseline="central"
        className="fill-current font-mono"
        style={{ fontSize: 10, letterSpacing: "0.08em", opacity: 0.62 }}
      >
        DOF
      </text>
      {/* live count (solving) */}
      <motion.text
        x={px + (inline ? 30 : 42)}
        y={barY}
        textAnchor="end"
        dominantBaseline="central"
        className="fill-current font-mono"
        style={{
          fontSize: 13,
          fontWeight: 500,
          fontVariantNumeric: "tabular-nums slashed-zero",
          opacity: solving,
        }}
      >
        {dofText}
      </motion.text>

      {/* solve-progress bar track */}
      <line x1={barX} y1={barY} x2={barX + barW} y2={barY} stroke="currentColor" strokeWidth={2.5} opacity={0.16} />
      {/* solve-progress bar fill — grows as DOF runs to zero */}
      <motion.line
        x1={barX}
        y1={barY}
        x2={barX + barW}
        y2={barY}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ pathLength: barFill }}
      />

      {/* resolved label crossfades in over the bar when fully constrained */}
      <motion.text
        x={barX + barW}
        y={barY}
        textAnchor="end"
        dominantBaseline="central"
        className="fill-current font-mono"
        style={{ fontSize: 10, letterSpacing: "0.02em", opacity: constrained }}
      >
        0 · fully constrained
      </motion.text>

      {/* a small ✓ check stamps once the sketch resolves */}
      <Resolved reduce={reduce} startDelay={startDelay} resolvedAt={resolvedAt} x={px + (inline ? 44 : 58)} y={barY} />
    </motion.g>
  );
}

/** The "✓ resolved" check that snaps in at the end of the solve. */
function Resolved({
  reduce,
  startDelay,
  resolvedAt,
  x,
  y,
}: {
  reduce: boolean;
  startDelay: number;
  resolvedAt: number;
  x: number;
  y: number;
}) {
  return (
    <motion.path
      d={`M ${x - 4} ${y} l 2.6 3 l 5 -6.5`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE, delay: reduce ? 0 : startDelay + resolvedAt }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}

export function ParametricSketch({
  variant = "hero",
  trigger,
  startDelay = 0,
  className,
}: {
  variant?: Variant;
  trigger?: Trigger;
  startDelay?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const gridId = `ps-grid-${uid}`;
  const inline = variant === "inline";

  // Resolve the trigger: explicit prop wins; otherwise hero→load, inline→view.
  const mode: Trigger = trigger ?? (inline ? "view" : "load");

  // Parent → children variant cascade in one timeline. Reduced motion snaps to
  // the resting frame; 'view' reprises once when scrolled in; 'load' draws on mount.
  const svgMotion = reduce
    ? ({ initial: false, animate: "show" } as const)
    : mode === "view"
      ? ({ initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } } as const)
      : ({ initial: "hidden", animate: "show" } as const);

  // Choreography timing (seconds, relative to startDelay).
  const T_GRID = 0.0;
  const T_SKELETON = 0.08;
  const T_PROFILE = 0.45;
  const T_HOLE = 1.05;
  const T_SLOT = 1.18;
  const T_GLYPH0 = 1.3; // first constraint stamp
  const GLYPH_STEP = 0.16;
  const T_DIMS = T_GLYPH0 + START_DOF * GLYPH_STEP + 0.18;

  // Bound the variant factories to this render's startDelay.
  const draw = drawV(startDelay);
  const fade = fadeV(startDelay);
  const stamp = stampV(startDelay);

  // Constraint glyphs in solver order, each one DOF removed. The order mirrors
  // the DOF readout countdown (7 marks → DOF 0). Anchored to real edges.
  const glyphs: Array<{ kind: GlyphKind; x: number; y: number; angle?: number }> = [
    { kind: "fix", x: OX, y: FOOT + 3 }, // ground the base-left vertex
    { kind: "horiz", x: (OX + WEB_R) / 2, y: TOP - 8 }, // top edge horizontal
    { kind: "vert", x: OX - 8, y: (TOP + FOOT) / 2 }, // left edge vertical
    { kind: "perp", x: WEB_R - 9, y: SHOULDER - 9 }, // shoulder ⌐
    { kind: "parallel", x: OR + 9, y: (SHOULDER + FOOT) / 2 }, // flange edge ∥ web
    { kind: "coincident", x: HOLE.x, y: HOLE.y }, // hole center coincident w/ datum
    { kind: "equal", x: (WEB_R + OR) / 2, y: SHOULDER + 9 }, // equal-length tick
  ];

  return (
    <motion.svg
      viewBox={`0 0 ${VW} ${VH}`}
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full text-ink", className)}
      {...svgMotion}
    >
      <defs>
        {/* faint sketch grid */}
        <pattern id={gridId} width={16} height={16} patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth={0.6} opacity={0.12} />
        </pattern>
      </defs>

      {/* PHASE 0 — sketch grid field */}
      <motion.rect
        x={0}
        y={0}
        width={VW}
        height={VH}
        fill={`url(#${gridId})`}
        stroke="none"
        variants={fade}
        custom={{ d: T_GRID, o: 1 }}
      />

      {/* PHASE 1 — dashed construction skeleton */}
      <g>
        {SKELETON.map(([p1, p2], i) => (
          <motion.line
            key={`${uid}-sk-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="2 5"
            strokeLinecap="round"
            variants={fade}
            custom={{ d: T_SKELETON + i * 0.05, o: 0.34 }}
          />
        ))}
      </g>

      {/* PHASE 2 — the profile outline draws on (the captured sketch) */}
      <motion.path
        d={OUTLINE_D}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        variants={draw}
        custom={T_PROFILE}
      />

      {/* PHASE 2 — bored hole + foot slot */}
      <motion.circle
        cx={HOLE.x}
        cy={HOLE.y}
        r={HOLE_R}
        stroke="currentColor"
        strokeWidth={1.4}
        variants={drawV(startDelay, 0.5)}
        custom={T_HOLE}
      />
      <motion.circle
        cx={SLOT.x}
        cy={SLOT.y}
        r={SLOT_R}
        stroke="currentColor"
        strokeWidth={1.4}
        variants={drawV(startDelay, 0.5)}
        custom={T_SLOT}
      />
      {/* hole + slot crosshair centers (construction marks) */}
      {[HOLE, SLOT].map((c, i) => (
        <motion.g key={`${uid}-cx-${i}`} variants={fade} custom={{ d: T_HOLE + i * 0.06, o: 0.4 }}>
          <line x1={c.x - (i ? SLOT_R : HOLE_R) - 4} y1={c.y} x2={c.x + (i ? SLOT_R : HOLE_R) + 4} y2={c.y} stroke="currentColor" strokeWidth={0.8} strokeDasharray="4 2" />
          <line x1={c.x} y1={c.y - (i ? SLOT_R : HOLE_R) - 4} x2={c.x} y2={c.y + (i ? SLOT_R : HOLE_R) + 4} stroke="currentColor" strokeWidth={0.8} strokeDasharray="4 2" />
        </motion.g>
      ))}

      {/* PHASE 3 — constraint glyphs stamp in, one per removed DOF */}
      <g>
        {glyphs.map((g, i) => (
          <Glyph
            key={`${uid}-g-${i}`}
            kind={g.kind}
            x={g.x}
            y={g.y}
            angle={g.angle}
            d={T_GLYPH0 + i * GLYPH_STEP}
            variants={stamp}
          />
        ))}
      </g>

      {/* PHASE 4 — dimension callouts annotate the resolved profile */}
      {/* overall width across the foot */}
      <Dim orient="h" a={OX} b={OR} pos={FOOT + 26} label="100.0" d={T_DIMS} variants={fade} flip />
      {/* web height on the left */}
      {!inline && <Dim orient="v" a={TOP} b={FOOT} pos={OX - 26} label="64.0" d={T_DIMS + 0.1} variants={fade} />}
      {/* bore Ø leader */}
      <motion.g variants={fade} custom={{ d: T_DIMS + 0.16, o: 0.7 }}>
        <line x1={HOLE.x + HOLE_R} y1={HOLE.y} x2={HOLE.x + 44} y2={HOLE.y - 18} stroke="currentColor" strokeWidth={1} opacity={0.6} />
        <text
          x={HOLE.x + 47}
          y={HOLE.y - 20}
          className="fill-current font-mono"
          stroke="none"
          style={{ fontSize: 11, fontVariantNumeric: "tabular-nums slashed-zero" }}
        >
          ⌀6
        </text>
      </motion.g>
      {/* foot slot R leader */}
      <motion.g variants={fade} custom={{ d: T_DIMS + 0.22, o: 0.7 }}>
        <line x1={SLOT.x} y1={SLOT.y - SLOT_R} x2={SLOT.x + 30} y2={SLOT.y - SLOT_R - 18} stroke="currentColor" strokeWidth={1} opacity={0.6} />
        <circle cx={SLOT.x} cy={SLOT.y} r={1.4} fill="currentColor" stroke="none" />
        <text
          x={SLOT.x + 33}
          y={SLOT.y - SLOT_R - 20}
          className="fill-current font-mono"
          stroke="none"
          style={{ fontSize: 11, fontVariantNumeric: "tabular-nums slashed-zero" }}
        >
          R3
        </text>
      </motion.g>

      {/* PHASE 5 — the live DOF readout (drives its own motion-value countdown) */}
      <DofReadout reduce={reduce} startDelay={startDelay} t0={T_GLYPH0} step={GLYPH_STEP} inline={inline} />
    </motion.svg>
  );
}

/* ============================================================
   <DofReadout> — owns the live degree-of-freedom counter. A single motion
   value runs the DOF count down through one keyframe per constraint glyph,
   each landing on that glyph's stamp time. The integer is rendered as the
   text content of a <motion.text>; a motion-value subscription (an event
   handler, NOT a synchronous setState in an effect) crossfades the panel to
   "0 · fully constrained" the instant the count reaches zero. The animate()
   call lives in an effect that only SCHEDULES an async animation + returns a
   cleanup — it never calls a React state setter.
   ============================================================ */
function DofReadout({
  reduce,
  startDelay,
  t0,
  step,
  inline,
}: {
  reduce: boolean;
  startDelay: number;
  t0: number;
  step: number;
  inline: boolean;
}) {
  // Absolute solve time of the last glyph (relative to startDelay).
  const resolvedAt = t0 + (START_DOF - 1) * step + 0.2;

  const dof = useMotionValue(reduce ? 0 : START_DOF);
  const dofText = useTransform(dof, (v) => String(Math.max(0, Math.round(v))));
  const solving = useMotionValue(reduce ? 0 : 1);
  const constrained = useMotionValue(reduce ? 1 : 0);

  // Flip the panel labels purely in a motion-value subscription (no setState).
  useMotionValueEvent(dof, "change", (v) => {
    const target = v <= 0.001 ? 1 : 0;
    if (constrained.get() !== target) {
      constrained.set(target);
      solving.set(target ? 0 : 1);
    }
  });

  // Drive the stepped countdown: one keyframe per glyph, each at its stamp
  // time. times[] are normalized to the total solve span. animate() only
  // schedules an async animation here — it does not synchronously setState.
  useEffect(() => {
    if (reduce) {
      dof.set(0);
      return;
    }
    const values: number[] = [];
    const times: number[] = [];
    const total = t0 + (START_DOF - 1) * step + 0.12;
    for (let i = 0; i <= START_DOF; i++) {
      values.push(START_DOF - i);
      const at = i === 0 ? 0 : t0 + (i - 1) * step;
      times.push(Math.min(1, at / total));
    }
    dof.set(START_DOF);
    const controls = animate(dof, values, {
      duration: total,
      delay: startDelay,
      times,
      ease: "linear",
    });
    return () => controls.stop();
  }, [dof, reduce, startDelay, t0, step]);

  return (
    <DofPanel
      reduce={reduce}
      startDelay={startDelay}
      inline={inline}
      resolvedAt={resolvedAt}
      dof={dof}
      dofText={dofText}
      solving={solving}
      constrained={constrained}
    />
  );
}
