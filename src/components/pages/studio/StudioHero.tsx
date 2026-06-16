"use client";

import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { DitherPortrait } from "@/components/artifacts/DitherPortrait";
import { stagger, riseIn } from "@/lib/motion";
import { APP_URL, GITHUB_URL, CTA, CTA_SECONDARY } from "@/lib/site";

const HEADLINE = ["A", "whole", "studio.", "Speak,", "and", "it", "sculpts."];

const SUBHEAD =
  "Model, sculpt, UV, shade, rig, animate, simulate, and render — Blender-, Maya-, and Houdini-class breadth in one surface. Describe a form and Archie sculpts it; describe a scene and it composes, lights, and frames the shot. The same copilot that drives Forge, working in clay and light.";

const MICRO =
  "Open source · free forever · public release soon · native for Apple Silicon · runs on-device.";

export function StudioHero() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      <GenerativeGrid majorPitch={120} crosshair annotations />

      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[52fr_48fr] lg:gap-10">
        {/* ── Left column: copy + CTA ───────────────────────────────── */}
        <div className="flex flex-col items-start">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
              STUDIO · 3D CONTENT CREATION
            </span>
          </Reveal>

          <motion.h1
            className="mt-5 max-w-[18ch] text-balance text-display font-display text-ink"
            variants={stagger(0.04, 0.05)}
            initial={init}
            animate="show"
          >
            {HEADLINE.map((word, i) => (
              <motion.span
                key={i}
                variants={riseIn}
                className="mr-[0.22em] inline-block"
              >
                {word}
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
                {CTA}
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button href={GITHUB_URL} size="lg" variant="secondary">
                <Star size={15} />
                {CTA_SECONDARY}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-5 u-spec text-faint">{MICRO}</p>
          </Reveal>
        </div>

        {/* ── Right column: DitherPortrait signature artifact ───────── */}
        <Reveal delay={0.1} y={24}>
          <figure className="relative overflow-hidden rounded-[2px] border border-line-strong bg-surface">
            {/* mono header strip */}
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="u-label text-faint">studio · sculpt</span>
              <span className="u-spec text-faint">step 3 / 3</span>
            </div>
            <div className="relative bg-paper p-5">
              <GenerativeGrid majorPitch={96} fade={64} className="opacity-70" />
              <div className="relative mx-auto w-full max-w-sm">
                <DitherPortrait
                  variant="hero"
                  tag="subdiv · level 2 · retopo ✓"
                  className="text-ink"
                />
              </div>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
