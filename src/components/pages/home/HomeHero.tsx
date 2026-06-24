"use client";

import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Plate } from "@/components/visual/Plate";
import { fadeUp, stagger } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

export function HomeHero() {
  const reduce = usePrefersReducedMotion();

  return (
    <section
      data-theme="vault"
      className="relative isolate overflow-hidden bg-night pt-8 pb-0"
    >
      <div className="mx-auto w-full max-w-[1680px] px-5 md:px-10">
        {/* giant headline */}
        <motion.h1
          className="pt-12 md:pt-20"
          variants={stagger(0.12, 0.05)}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.span
            variants={fadeUp}
            className="block font-display text-mega font-[800] uppercase leading-[0.82] tracking-[-0.045em] text-ink"
          >
            Describe it.
          </motion.span>
          <motion.span
            variants={fadeUp}
            className="block font-display text-mega font-[800] uppercase leading-[0.82] tracking-[-0.045em] text-ink"
          >
            Archie <span className="text-clay">builds it.</span>
          </motion.span>
        </motion.h1>

        {/* sub bar */}
        <Reveal delay={0.2}>
          <div className="flex flex-col gap-6 pt-8 pb-9 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[48ch] text-pretty text-lead text-ink-soft">
              <span className="text-ink">Two apps. One model.</span> Archie is the spine —
              Studio for 3D creation, Forge for mechanical CAD — and it builds in both. You
              say what you want; it plans and builds. Local, private, and free to use.
            </p>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={ACCESS_URL} size="lg" variant="accent">
                {CLEARANCE_CTA}
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button href="#watch" size="lg" variant="secondary">
                Watch it build <ArrowDown size={16} />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* full-bleed industry image band */}
      <Reveal>
        <div className="relative">
          <Plate
            src="/img/forge-turbine.jpg"
            alt="A jet-engine turbine — the world of mechanical parts ArchDisc is built to make."
            priority
            sizes="100vw"
            className="h-[44vh] w-full md:h-[58vh]"
            position="center"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-night/80 to-transparent p-5 md:p-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/85">
              The work most people can&rsquo;t make alone
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60 sm:inline">
              ArchDisc — describe it, it gets built
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
