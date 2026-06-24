"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Plate } from "@/components/visual/Plate";
import { fadeUp } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/artkit";

export function HomeHero() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="atmos -z-10" aria-hidden />
      <div className="mx-auto grid w-full max-w-[1680px] items-center gap-10 px-5 pt-14 pb-16 md:px-10 md:pt-16 lg:min-h-[88vh] lg:grid-cols-[45fr_55fr] lg:gap-14">
        {/* ── message ── */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft backdrop-blur-sm">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Coming soon
            </span>
          </Reveal>

          <motion.h1
            className="mt-7 max-w-[15ch] font-display text-display font-[700] leading-[0.98] tracking-[-0.03em] text-ink"
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            Make anything <span className="accent-serif text-[1.06em]">real.</span>
          </motion.h1>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[52ch] text-pretty text-lead text-ink-soft">
              Real mechanical design — raw model, sketch, render, and manufacturable drawing
              — from a single sentence. Built for everyone who could picture it, but never
              had ten years of CAD to make it.
            </p>
          </Reveal>

          <Reveal delay={0.26}>
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
          <figure className="relative overflow-hidden rounded-2xl border border-line-strong shadow-[0_40px_120px_-50px_rgba(109,140,255,0.45)]">
            <Plate
              src="/img/hero-model.jpg"
              alt="A turbofan engine — the kind of complex machine real CAD is built to make."
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="aspect-[4/3] w-full breathe"
              position="center"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(6,8,14,0.12) 0%, rgba(6,8,14,0.0) 42%, rgba(6,8,14,0.72) 100%)" }}
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
