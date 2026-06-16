"use client";

import { useRef } from "react";
import { useReducedMotion, useInView } from "motion/react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { IsometricExploded, type Part } from "@/components/artifacts/IsometricExploded";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { cn } from "@/lib/utils";

const DECK =
  "The asset moves through one continuous stack — no exports, no re-imports, no version drift between tools.";

/* DCC asset-build stack — a hero form exploded into its 5 pipeline layers. */
const STACK: Part[] = [
  { sx: 84, sy: 11, sz: 68, lift: 0, tag: "1", bom: "shaded · PBR look", shape: "plate" },
  { sx: 60, sy: 9, sz: 50, lift: 50, tag: "2", bom: "UV shell · packed", shape: "flange" },
  { sx: 64, sy: 12, sz: 52, lift: 104, tag: "3", bom: "retopo cage · quads", shape: "boss" },
  { sx: 46, sy: 24, sz: 42, lift: 162, tag: "4", bom: "sculpt · dyntopo", shape: "boss" },
  { sx: 30, sy: 22, sz: 28, lift: 214, tag: "5", bom: "blockout · primitive", shape: "fastener" },
];

type Step = {
  n: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Block & sculpt",
    body: "Start from a primitive or a described form, then push detail with dyntopo and multires. The high-res sculpt stays live.",
  },
  {
    n: "02",
    title: "Retopo & UV",
    body: "Lay a clean quad cage over the sculpt — auto-retopo or by hand — then unwrap and pack the shells for texturing.",
  },
  {
    n: "03",
    title: "Shade",
    body: "Build the look in the node graph with PBR materials, or pull a starting point from the parametric material library and tune it.",
  },
  {
    n: "04",
    title: "Render",
    body: "Hand the shot to the GPU path tracer for true light transport, or stay in the raster viewport for speed — then composite the passes.",
  },
];

function StepRow({ step }: { step: Step }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Active when the row is near the vertical centre of the viewport.
  const active = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const lit = reduce || active;

  return (
    <div
      ref={ref}
      className="flex gap-5 border-t border-line py-7 first:border-t-0 first:pt-0"
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border font-mono text-[12px] tabular-nums transition-colors duration-300",
          lit
            ? "border-ink bg-ink text-paper"
            : "border-line-strong bg-surface text-muted",
        )}
        style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
      >
        {step.n}
      </div>
      <div className="min-w-0">
        <h3
          className={cn(
            "text-h3 font-display transition-colors duration-300",
            lit ? "text-ink" : "text-ink-soft",
          )}
        >
          {step.title}
        </h3>
        <p className="mt-2 text-body text-muted">{step.body}</p>
      </div>
    </div>
  );
}

export function SculptToShade() {
  return (
    <Section id="sculpt-to-shade" className="border-t border-line">
      <Container>
        <SectionHeader
          eyebrow="SCULPT → RETOPO → SHADE → RENDER"
          title="From a blockout to a finished shot"
          lead={DECK}
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-[46fr_54fr] lg:gap-16">
          {/* artifact — sticky on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[2px] border border-line-strong bg-surface">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="u-label text-faint">asset · build stack</span>
                <span className="u-spec text-faint">5 layers</span>
              </div>
              <div className="relative bg-paper p-4">
                <GenerativeGrid majorPitch={96} fade={66} className="opacity-70" />
                <div className="relative mx-auto aspect-[6/5] w-full max-w-md">
                  <IsometricExploded
                    parts={STACK}
                    trigger="view"
                    className="text-ink"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4-step rail */}
          <div className="flex flex-col">
            {STEPS.map((step) => (
              <StepRow key={step.n} step={step} />
            ))}
            <Reveal delay={0.05}>
              <p className="mt-7 border-t border-line pt-6 text-pretty text-body text-muted">
                One stack, one file, one copilot — the asset never leaves the
                room to get finished.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
