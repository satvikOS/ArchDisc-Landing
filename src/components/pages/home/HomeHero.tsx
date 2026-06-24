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
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(120% 90% at 80% 10%, rgba(176,122,79,0.10), transparent 60%)" }}
      />
      <div className="mx-auto grid w-full max-w-[1680px] items-center gap-10 px-5 pt-14 pb-16 md:px-10 md:pt-16 lg:min-h-[88vh] lg:grid-cols-[45fr_55fr] lg:gap-14">
        {/* ── message ── */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Coming soon
            </span>
          </Reveal>

          <motion.h1
            className="mt-7 max-w-[13ch]"
            variants={stagger(0.12, 0.06)}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <motion.span variants={fadeUp} className="block font-display text-display font-[800] uppercase leading-[0.86] tracking-[-0.04em] text-ink">
              Make anything
            </motion.span>
            <motion.span variants={fadeUp} className="block font-display text-display font-[800] uppercase leading-[0.86] tracking-[-0.04em] text-clay-soft">
              real.
            </motion.span>
          </motion.h1>

          <Reveal delay={0.2}>
            <p className="mt-7 max-w-[52ch] text-pretty text-lead text-ink-soft">
              Real mechanical design — raw model, sketch, render, and manufacturable drawing
              — from a single sentence. Built for everyone who could picture it, but never
              had ten years of CAD to make it.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <a
              href="#pipeline"
              className="mt-9 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-clay"
            >
              See every stage
              <ArrowDown size={15} className="animate-bounce" />
            </a>
          </Reveal>
        </div>

        {/* ── the model ── */}
        <Reveal delay={0.1} y={26} className="order-1 lg:order-2">
          <figure className="relative overflow-hidden rounded-2xl border border-line-strong">
            <Plate
              src="/img/hero-model.jpg"
              alt="A turbofan engine — the kind of complex machine real CAD is built to make."
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="aspect-[4/3] w-full"
              position="center"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(10,9,5,0.15) 0%, rgba(10,9,5,0.0) 40%, rgba(10,9,5,0.7) 100%)" }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">
                The kind of thing real CAD is for
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-white/55 sm:inline">
                model · render · drawing
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
