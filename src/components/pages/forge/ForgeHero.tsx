"use client";

import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { Solid3D } from "@/components/artifacts/Solid3D";
import { stagger, riseIn } from "@/lib/motion";
import { APP_URL, REPOS } from "@/lib/site";

const EYEBROW = "FORGE · NATIVE PARAMETRIC CAD";
const HEADLINE = "Solids that are made to be made.";
const SUBHEAD =
  "Forge is mechanical CAD on a from-source OpenCASCADE 7.9.3 kernel — true B-rep geometry, a real constraint solver, simulation, and drawings. The same Archie copilot that draws your part can also size it, simulate it, and detail it. Manufacturable, not just renderable.";
const MICRO =
  "Open source · free forever · public release soon · native B-rep, no WASM in the geometry path.";

export function ForgeHero() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";
  const words = HEADLINE.split(" ");

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28"
    >
      {/* Drafting-plane substrate, masked to die before the text column. */}
      <GenerativeGrid
        majorPitch={132}
        crosshair
        origin={["72%", "46%"]}
        annotations={[
          { x: "66%", y: "22%", text: "Ø 30.0" },
          { x: "86%", y: "62%", text: "M6" },
          { x: "58%", y: "78%", text: "4 mm" },
        ]}
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:gap-12">
        {/* ── Copy column ─────────────────────────────────────────── */}
        <div className="flex flex-col items-start">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
              {EYEBROW}
            </span>
          </Reveal>

          <motion.h1
            className="mt-5 max-w-[18ch] text-balance text-display font-display text-ink"
            variants={stagger(0.04, 0.05)}
            initial={init}
            animate="show"
          >
            {words.map((w, wi) => (
              <motion.span
                key={wi}
                variants={riseIn}
                className="mr-[0.22em] inline-block"
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[56ch] text-pretty text-lead text-muted">
              {SUBHEAD}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button href={APP_URL} size="lg">
                Open ArchDisc
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button href={REPOS.forge} size="lg" variant="secondary">
                <Star size={15} />
                Star on GitHub
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="u-spec mt-5 text-faint">{MICRO}</p>
          </Reveal>
        </div>

        {/* ── Signature artifact — exploded native-kernel assembly ── */}
        <Reveal delay={0.1} y={24} className="w-full">
          <div className="relative rounded-[2px] border border-line-strong bg-surface p-5 md:p-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="u-label text-faint">native B-rep solid</span>
              <span className="u-spec text-faint">forge-kernel.node</span>
            </div>
            <div className="relative aspect-[6/5] w-full">
              <Solid3D variant="bracket" className="absolute inset-0" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
