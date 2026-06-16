"use client";

import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { Solid3D, type Solid3DVariant } from "@/components/artifacts/Solid3D";
import { stagger, riseIn } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { APP_URL, GITHUB_URL, CTA, CTA_SECONDARY } from "@/lib/site";

const EYEBROW = "ARCHDISC · OPEN-SOURCE AI DESIGN PLATFORM";
const HEADLINE = "Describe it. Archie builds it.";
const SUBHEAD =
  "One platform for 3D creation and mechanical CAD, with a local AI copilot at its center. Describe a part below — Archie turns plain language into validated, manufacturable geometry on a real kernel. Open code, open weights, on your own machine.";
const MICRO =
  "Open source · free forever · public release soon · native for Apple Silicon · nothing leaves your machine.";

type Preset = {
  key: string;
  label: string;
  variant: Solid3DVariant;
  prompt: string;
  calls: [string, string][];
  dim: string;
};

const PRESETS: Preset[] = [
  {
    key: "vase",
    label: "Shelled vase",
    variant: "vessel",
    prompt: "Revolve a 60 mm vase, shell to 2 mm, fillet the rim.",
    calls: [
      ["sketch.revolveProfile", "pts=7"],
      ["part.shell", "t=2.0"],
      ["part.filletEdges", "rim · r1.5"],
      ["heal.checkValidity", "valid"],
    ],
    dim: "Ø 60.0 · h 146",
  },
  {
    key: "bracket",
    label: "Wall bracket",
    variant: "bracket",
    prompt: "A 100 mm wall bracket, two M6 holes 60 mm apart, 4 mm wall.",
    calls: [
      ["sketch.rect", "100×40"],
      ["part.extrude", "d=4"],
      ["part.holes", "2×M6 @60"],
      ["part.filletEdges", "inner · r3"],
      ["heal.checkValidity", "valid"],
    ],
    dim: "100.0 · 2×Ø6",
  },
  {
    key: "manifold",
    label: "Twisted manifold",
    variant: "knot",
    prompt: "A twisted toroidal manifold, 2×3 winding, Ø8 tube.",
    calls: [
      ["sketch.torusKnot", "p=2 · q=3"],
      ["part.sweep", "Ø0.4"],
      ["heal.checkValidity", "valid"],
    ],
    dim: "R 0.60 · 2×3",
  },
];

function matchPreset(text: string, current: number): number {
  const t = text.toLowerCase();
  if (/vase|vessel|shell|cup|revolv|bowl|lathe/.test(t)) return 0;
  if (/brack|plate|hole|mount|wall|flange|extrud/.test(t)) return 1;
  if (/knot|torus|manifold|coil|twist|gear|sweep/.test(t)) return 2;
  return current;
}

export function HomeHero() {
  const reduce = usePrefersReducedMotion();
  const init = reduce ? false : "hidden";
  const words = HEADLINE.split(" ");
  const [pi, setPi] = useState(0);
  const [text, setText] = useState("");
  const preset = PRESETS[pi];

  return (
    <section
      id="hero"
      className="relative isolate scroll-mt-24 overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28"
    >
      <GenerativeGrid majorPitch={132} crosshair origin={["62%", "44%"]} />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[44fr_56fr] lg:gap-16">
        {/* ── Left: copy + CTA ───────────────────────────────────── */}
        <div className="flex flex-col items-start">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
              {EYEBROW}
            </span>
          </Reveal>

          <motion.h1
            className="mt-5 max-w-[15ch] text-balance text-display font-display font-semibold text-ink"
            variants={stagger(0.04, 0.05)}
            initial={init}
            animate="show"
          >
            {words.map((w, i) => (
              <motion.span key={i} variants={riseIn} className="mr-[0.2em] inline-block">
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[54ch] text-pretty text-lead text-muted">
              {SUBHEAD}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button href={APP_URL} size="lg">
                {CTA}
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button href={GITHUB_URL} size="lg" variant="ghost">
                <GitHubIcon size={15} />
                {CTA_SECONDARY}
                <Star size={14} className="text-faint" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="u-spec mt-6 max-w-[60ch] text-faint">{MICRO}</p>
          </Reveal>
        </div>

        {/* ── Right: the probe bench — type, Archie builds ───────── */}
        <Reveal delay={0.1} y={24}>
          <div className="overflow-hidden rounded-[2px] border border-line-strong bg-surface">
            {/* prompt field + presets */}
            <div className="border-b border-line p-3.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPi((cur) => matchPreset(text, cur));
                }}
                className="flex items-center gap-2 rounded-[2px] border border-line bg-paper px-3 py-2"
              >
                <span className="font-mono text-[12px] text-faint">›</span>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe a part — e.g. “a 100 mm wall bracket”"
                  aria-label="Describe a part for Archie to build"
                  className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-ink-soft placeholder:text-faint focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-[2px] bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
                >
                  build
                </button>
              </form>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setPi(i);
                      setText("");
                    }}
                    aria-pressed={i === pi}
                    className={
                      "rounded-[2px] border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 " +
                      (i === pi
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-muted hover:border-ink/40 hover:text-ink")
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* bench: resolving 3D part + the tool-call stream */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_205px]">
              <div className="relative min-h-[280px] sm:min-h-[340px]">
                <Solid3D key={preset.key} variant={preset.variant} className="absolute inset-0" />
                <span className="absolute bottom-3 left-3 font-mono text-[10px] tabular-nums text-faint">
                  {preset.dim}
                </span>
              </div>

              <div className="border-t border-line p-3.5 sm:border-l sm:border-t-0">
                <span className="u-label text-faint">archie · tool-calls</span>
                <motion.ul
                  key={preset.key}
                  className="mt-3 flex flex-col gap-2"
                  variants={stagger(0.1, 0.15)}
                  initial={reduce ? false : "hidden"}
                  animate="show"
                >
                  {preset.calls.map(([verb, arg], i) => {
                    const last = i === preset.calls.length - 1;
                    return (
                      <motion.li
                        key={verb}
                        variants={riseIn}
                        className="flex items-baseline gap-1.5 font-mono text-[10.5px] leading-snug"
                      >
                        <span className="text-faint">{last ? "✓" : "→"}</span>
                        <span className="min-w-0 flex-1 truncate text-ink-soft">
                          {verb}
                          <span className="text-faint">({arg})</span>
                        </span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
                <div className="mt-3 inline-flex items-center gap-1.5 border-t border-line pt-3 font-mono text-[10.5px] text-ink">
                  <span>✓</span> valid · editable tree
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
