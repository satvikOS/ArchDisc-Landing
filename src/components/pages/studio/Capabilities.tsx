"use client";

import { motion, useReducedMotion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DECK =
  "No round-tripping between five apps. Studio carries the whole creative pipeline — block out the form, sculpt the detail, lay out UVs, build the shader, rig and animate, run the sim, then render and composite the frame.";

type Capability = {
  name: string;
  body: string;
  proof: string;
  motif: ReactNode;
};

/* ── small monochrome hairline motifs (currentColor, draw-on once) ───────── */

const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.7, ease: EASE, delay: d },
      opacity: { duration: 0.2, delay: d },
    },
  }),
};

function Motif({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="h-8 w-8 text-ink"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {children}
    </svg>
  );
}

const P = (d: string, delay = 0) => (
  <motion.path d={d} variants={drawV} custom={delay} />
);

const CAPABILITIES: Capability[] = [
  {
    name: "Modeling",
    body: "Poly, sub-D, and box modeling with the full edit toolset — extrude, bevel, bridge, loop-cut, boolean.",
    proof: "poly · sub-d · boolean · array",
    motif: (
      <Motif>
        {P("M10 18 L24 11 L38 18 L38 33 L24 40 L10 33 Z")}
        {P("M10 18 L24 25 L38 18", 0.12)}
        {P("M24 25 L24 40", 0.18)}
      </Motif>
    ),
  },
  {
    name: "Sculpting",
    body: "Dynamic-topology sculpting with brushes, masks, and multiresolution detail.",
    proof: "dyntopo · multires · mask · remesh",
    motif: (
      <Motif>
        {P("M12 30 C12 18 20 12 26 12 C34 12 38 20 38 28 C38 36 30 40 22 38 C15 36 12 34 12 30 Z")}
        {P("M19 24 C22 22 26 22 29 25", 0.14)}
        {P("M18 31 C23 33 28 32 32 29", 0.2)}
      </Motif>
    ),
  },
  {
    name: "UV & Retopology",
    body: "Unwrap, pack, and project; auto- and hand-retopo to clean, animatable quads.",
    proof: "unwrap · pack · auto-retopo",
    motif: (
      <Motif>
        {P("M9 9 H39 V39 H9 Z")}
        {P("M9 19 H39 M9 29 H39 M19 9 V39 M29 9 V39", 0.12)}
      </Motif>
    ),
  },
  {
    name: "Shading & Surfacing",
    body: "A node shader graph, PBR materials, and a parametric material library.",
    proof: "node graph · PBR · material library",
    motif: (
      <Motif>
        {P("M10 13 H20 V23 H10 Z")}
        {P("M28 25 H38 V35 H28 Z", 0.1)}
        {P("M20 18 C24 18 24 30 28 30", 0.18)}
        {P("M10 33 H17", 0.24)}
      </Motif>
    ),
  },
  {
    name: "Rigging & Animation",
    body: "Skeletons, skinning, constraints, and a graph-editor timeline with keyframes.",
    proof: "skeleton · skin · graph editor",
    motif: (
      <Motif>
        {P("M12 36 L20 22 L28 28 L36 12")}
        {P("M12 36 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0", 0.1)}
        {P("M20 22 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0", 0.16)}
        {P("M28 28 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0", 0.22)}
        {P("M36 12 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0", 0.28)}
      </Motif>
    ),
  },
  {
    name: "VFX & Simulation",
    body: "Cloth, particles, fluid, and rigid-body dynamics solved on your scene.",
    proof: "cloth · particle · fluid · rigid-body",
    motif: (
      <Motif>
        {P("M10 16 C16 12 24 20 30 16 C34 13 37 14 39 16")}
        {P("M10 24 C16 20 24 28 30 24 C34 21 37 22 39 24", 0.12)}
        {P("M10 32 C16 28 24 36 30 32 C34 29 37 30 39 32", 0.2)}
      </Motif>
    ),
  },
  {
    name: "Rendering",
    body: "A GPU path tracer for true light transport, plus a fast viewport raster.",
    proof: "GPU path tracer · viewport raster",
    motif: (
      <Motif>
        {P("M24 24 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0")}
        {P("M24 8 V14 M24 34 V40 M8 24 H14 M34 24 H40", 0.12)}
        {P("M13 13 L17 17 M35 13 L31 17 M13 35 L17 31 M35 35 L31 31", 0.2)}
      </Motif>
    ),
  },
  {
    name: "Compositing",
    body: "A layer- and node-based compositor to finish the frame — passes, masks, grade.",
    proof: "passes · node comp · grade",
    motif: (
      <Motif>
        {P("M11 11 H31 V31 H11 Z")}
        {P("M17 17 H37 V37 H17 Z", 0.14)}
      </Motif>
    ),
  },
  {
    name: "Game Engine",
    body: "A runtime to drive scenes interactively — not just stills, but things that move and respond.",
    proof: "runtime · scene graph · interactive",
    motif: (
      <Motif>
        {P("M14 18 H34 A6 6 0 0 1 40 24 A6 6 0 0 1 34 30 H14 A6 6 0 0 1 8 24 A6 6 0 0 1 14 18 Z")}
        {P("M14 21 V27 M11 24 H17", 0.12)}
        {P("M31 23 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0 M35 27 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0", 0.2)}
      </Motif>
    ),
  },
];

function CapabilityCard({ cap, index }: { cap: Capability; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const play = reduce ? true : inView;

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : (index % 3) * 0.06 }}
    >
      <motion.div
        initial={reduce ? false : "hidden"}
        animate={play ? "show" : "hidden"}
        className={cn(
          "group flex h-full flex-col bg-surface p-6",
          "transition-colors duration-200 hover:bg-ink/[0.015]",
        )}
      >
        <span className="mb-5 inline-flex">{cap.motif}</span>
        <h3 className="text-h3 font-display text-ink">{cap.name}</h3>
        <p className="mt-2 flex-1 text-body-sm text-ink-soft">{cap.body}</p>
        <p className="mt-4 u-spec text-faint">{cap.proof}</p>
      </motion.div>
    </motion.div>
  );
}

export function Capabilities() {
  return (
    <Section id="capabilities" className="border-t border-line">
      <Container>
        <SectionHeader
          eyebrow="THE FULL DCC PIPELINE"
          title="Every stage of the pipeline, in one room"
          lead={DECK}
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[2px] border border-line bg-line sm:grid-cols-2 md:mt-16 md:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.name} cap={cap} index={i} />
          ))}
        </div>

        <Reveal delay={0.05}>
          <p className="mt-10 border-t border-line pt-6 text-pretty text-body text-muted">
            Sixteen industry tools&rsquo; worth of surface area, brought to one
            workspace — and one copilot reaches all of it.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
