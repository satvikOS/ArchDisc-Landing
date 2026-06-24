"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Plate } from "@/components/visual/Plate";
import { fadeUp, stagger } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/artkit";

export function HomeHero() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden">
      {/* full-bleed industry visual */}
      <div className="absolute inset-0 -z-10">
        <Plate
          src="/img/hero-dark.jpg"
          alt="A dark machined form — the world of things made to be built."
          priority
          sizes="100vw"
          className="h-full w-full"
          position="center"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,14,9,0.62) 0%, rgba(16,14,9,0.25) 32%, rgba(16,14,9,0.78) 78%, rgba(16,14,9,0.97) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1680px] px-5 pb-16 pt-36 md:px-10 md:pb-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink backdrop-blur-sm">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
            Coming soon
          </span>
        </Reveal>

        <motion.h1
          className="mt-7 max-w-[15ch]"
          variants={stagger(0.12, 0.06)}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.span
            variants={fadeUp}
            className="block font-display text-mega font-[800] uppercase leading-[0.82] tracking-[-0.045em] text-ink"
          >
            Make anything
          </motion.span>
          <motion.span
            variants={fadeUp}
            className="block font-display text-mega font-[800] uppercase leading-[0.82] tracking-[-0.045em] text-clay-soft"
          >
            real.
          </motion.span>
        </motion.h1>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-[60ch] text-pretty text-lead text-ink-soft">
            Real mechanical design — raw model, sketch, render, and manufacturable drawing —
            from a single sentence. Built for everyone who could picture it, but never had ten
            years of CAD to make it. The hardest part of building something was never the
            idea.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <a
            href="#pipeline"
            className="mt-10 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-ink/80 transition-colors hover:text-clay"
          >
            See every stage
            <ArrowDown size={15} className="animate-bounce" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
