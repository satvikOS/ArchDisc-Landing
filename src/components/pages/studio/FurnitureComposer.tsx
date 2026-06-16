"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView, type Variants } from "motion/react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ToolCallLedger, type ToolCall } from "@/components/artifacts/ToolCallLedger";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { EASE } from "@/lib/motion";

const DECK =
  "Studio ships a parametric furniture library and a deterministic scene composer. Ask for a space and Archie selects the pieces, places them in a sensible layout, lights it, and frames a camera — a designed scene, not a pile of meshes on a black canvas.";

const BODY =
  "Every piece is parametric, so the chair you got is a chair you can resize, restyle, and re-place. The composition is deterministic — the same prompt builds the same scene, every time — and the whole layout drops into the feature tree, editable down to the last dimension.";

const PROMPT =
  "A small reading nook: a low lounge chair, a side table, a floor lamp, warm key from the window.";

const CALLS: ToolCall[] = [
  { verb: "scene.addFurniture", args: "chair", status: "ok" },
  { verb: "scene.place", args: "table, near=chair", status: "ok" },
  { verb: "scene.light", args: "key, soft", status: "ok" },
  { verb: "scene.frame", args: "camera", status: "ok" },
];

const STATS = ["deterministic", "parametric", "editable"];

/* ============================================================
   ParametricFurniturePlan — a focused, on-system inline SVG.
   A monochrome top-down furnished floor-plan of the composed
   reading nook: hairline walls + a window opening, placed
   furniture footprints (lounge chair, side table, floor lamp,
   rug), mono dimension callouts, and a camera frustum wedge.
   Drawn-on once then held; reduced-motion → resting frame.
   Decorative (aria-hidden). currentColor / token-driven only.
   ============================================================ */

const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.65, ease: EASE, delay: d },
      opacity: { duration: 0.2, delay: d },
    },
  }),
};

const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (d: number) => ({
    opacity: 1,
    transition: { duration: 0.4, ease: EASE, delay: d },
  }),
};

const popV: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: (d: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: EASE, delay: d },
  }),
};

/** A dimension run: witness ticks + label, drawn in faint hairline. */
function Dim({
  x1,
  x2,
  y,
  label,
  delay,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  delay: number;
}) {
  const mid = (x1 + x2) / 2;
  return (
    <motion.g
      stroke="currentColor"
      strokeWidth={0.8}
      variants={fadeV}
      custom={delay}
      opacity={0.5}
    >
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <text
        x={mid}
        y={y - 5}
        textAnchor="middle"
        stroke="none"
        className="fill-muted font-mono"
        style={{ fontSize: 8.5, fontVariantNumeric: "tabular-nums slashed-zero" }}
      >
        {label}
      </text>
    </motion.g>
  );
}

function FurniturePlan() {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const play = reduce ? true : inView;

  const motionProps = reduce
    ? ({ initial: false, animate: "show" } as const)
    : ({ initial: "hidden", animate: play ? "show" : "hidden" } as const);

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 320 260"
      fill="none"
      aria-hidden="true"
      className="h-full w-full text-ink"
      {...motionProps}
    >
      {/* room walls (double hairline) with a window opening on the top wall */}
      <motion.path
        d="M30 30 H150 M190 30 H290 M290 30 V230 H30 V30"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        variants={drawV}
        custom={0}
      />
      {/* window glazing line in the opening */}
      <motion.line
        x1={150}
        y1={30}
        x2={190}
        y2={30}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 3"
        variants={fadeV}
        custom={0.5}
        opacity={0.55}
      />

      {/* rug footprint (faint fill rectangle) */}
      <motion.rect
        x={92}
        y={96}
        width={150}
        height={108}
        rx={2}
        className="fill-current"
        variants={fadeV}
        custom={0.7}
        opacity={0.04}
      />
      <motion.rect
        x={92}
        y={96}
        width={150}
        height={108}
        rx={2}
        stroke="currentColor"
        strokeWidth={0.8}
        strokeDasharray="2 4"
        variants={fadeV}
        custom={0.7}
        opacity={0.4}
      />

      {/* lounge chair (top-down: seat + back + arms) */}
      <motion.g variants={popV} custom={0.78}>
        <rect x={108} y={120} width={56} height={56} rx={4} stroke="currentColor" strokeWidth={1.4} />
        <rect x={112} y={124} width={48} height={20} rx={3} stroke="currentColor" strokeWidth={1} opacity={0.6} />
        <line x1={108} y1={136} x2={108} y2={170} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        <line x1={164} y1={136} x2={164} y2={170} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      </motion.g>

      {/* side table (small round) */}
      <motion.g variants={popV} custom={0.9}>
        <circle cx={196} cy={140} r={15} stroke="currentColor" strokeWidth={1.4} />
        <circle cx={196} cy={140} r={6} stroke="currentColor" strokeWidth={0.8} opacity={0.5} />
      </motion.g>

      {/* floor lamp (base dot + shade ring) tucked by the window */}
      <motion.g variants={popV} custom={1.0}>
        <circle cx={210} cy={86} r={11} stroke="currentColor" strokeWidth={1.2} />
        <circle cx={210} cy={86} r={2} className="fill-current" />
      </motion.g>

      {/* camera frustum wedge looking from lower-left toward the chair */}
      <motion.g variants={fadeV} custom={1.12} opacity={0.6}>
        <path
          d="M58 214 L104 150 M58 214 L120 192"
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <path d="M58 214 L66 210 L62 218 Z" className="fill-current" stroke="none" />
        <text
          x={52}
          y={224}
          textAnchor="start"
          className="fill-muted font-mono"
          style={{ fontSize: 8.5, letterSpacing: "0.06em" }}
        >
          cam · 35 mm
        </text>
      </motion.g>

      {/* dimension callouts */}
      <Dim x1={30} x2={290} y={22} label="3.60 m" delay={1.2} />
      <Dim x1={108} x2={164} y={188} label="0.78 m" delay={1.3} />

      {/* north arrow / sun key marker near the window */}
      <motion.g variants={fadeV} custom={1.36} opacity={0.55}>
        <text
          x={170}
          y={48}
          textAnchor="middle"
          className="fill-faint font-mono"
          style={{ fontSize: 8, letterSpacing: "0.12em" }}
        >
          KEY LIGHT
        </text>
      </motion.g>
    </motion.svg>
  );
}

export function FurnitureComposer() {
  return (
    <Section id="furniture-composer" className="border-t border-line">
      <Container>
        <SectionHeader
          eyebrow="PARAMETRIC FURNITURE + SCENE COMPOSER"
          title="Describe a room. Get a designed scene."
          lead={DECK}
        />

        <Reveal delay={0.05} y={24}>
          <div className="mt-12 overflow-hidden rounded-[2px] border border-line-strong bg-surface md:mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr]">
              {/* left — typed-prompt console */}
              <div className="border-b border-line p-5 md:p-6 lg:border-b-0 lg:border-r">
                <ToolCallLedger
                  variant="compact"
                  trigger="view"
                  prompt={PROMPT}
                  calls={CALLS}
                  gateLabel="coherence gate · scene composed"
                  showTree={false}
                  className="border-line bg-paper"
                />
              </div>

              {/* right — composed room plan */}
              <div className="relative bg-paper p-5 md:p-6">
                <GenerativeGrid majorPitch={80} fade={70} className="opacity-70" />
                <div className="relative mx-auto aspect-[320/260] w-full max-w-xl">
                  <FurniturePlan />
                </div>
              </div>
            </div>

            {/* stat strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line bg-surface px-5 py-3.5 md:px-6">
              {STATS.map((s, i) => (
                <span key={s} className="flex items-center gap-5 u-spec text-muted">
                  {i > 0 && (
                    <span className="text-line-strong" aria-hidden>
                      ·
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-ink/50" aria-hidden />
                    {s}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl text-pretty text-body text-muted">
            {BODY}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 max-w-3xl text-pretty text-body text-ink-soft">
            This is the difference between text-to-mesh and a copilot that
            actually designs the shot.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
