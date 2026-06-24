"use client";

import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { fadeUp, stagger } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

const ROWS: { label: string; word: string; arrow: "lead" | "trail" | "none"; accent?: boolean }[] = [
  { label: "001 — say it", word: "Describe", arrow: "trail" },
  { label: "002 — it reasons", word: "it gets", arrow: "lead" },
  { label: "003 — it's real", word: "Built.", arrow: "none", accent: true },
];

export function HomeHero() {
  const reduce = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative scroll-mt-24 pt-8 pb-10 md:pt-10 md:pb-14">
      <div className="mx-auto w-full max-w-[1680px] px-5 md:px-10">
        {/* top instrument bar */}
        <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-3">
          <span className="u-label text-ink">ArchDisc — a private viewing</span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-coral" aria-hidden />
            <span className="u-label text-ink">opens in</span>
            <SignalCountdown inline className="text-ink" />
          </span>
        </div>

        {/* giant editorial rows */}
        <motion.h1
          className="mt-2"
          variants={stagger(0.1, 0.05)}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          {ROWS.map((r) => (
            <motion.span
              key={r.label}
              variants={fadeUp}
              className="block border-b border-ink/15 pt-4 pb-1 md:pt-6"
            >
              <span className="u-label mb-1 block text-faint">{r.label}</span>
              <span className="flex items-center gap-3 md:gap-6">
                {r.arrow === "lead" && (
                  <ArrowRight className="shrink-0 text-coral" strokeWidth={2.5} size={64} />
                )}
                <span
                  className={
                    "font-display text-mega font-[800] uppercase leading-[0.84] tracking-[-0.045em] " +
                    (r.accent ? "iris-text" : "text-ink")
                  }
                >
                  {r.word}
                </span>
                {r.arrow === "trail" && (
                  <ArrowRight className="ml-auto shrink-0 text-ink" strokeWidth={2.5} size={64} />
                )}
                {r.accent && (
                  <span className="ml-auto hidden h-10 w-10 shrink-0 rounded-full bg-coral md:block" aria-hidden />
                )}
              </span>
            </motion.span>
          ))}
        </motion.h1>

        {/* sub bar: claim + CTAs */}
        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[46ch] text-pretty text-lead text-ink-soft">
              One place to design and engineer with an AI at the center —{" "}
              <span className="font-medium text-ink">Forge</span>,{" "}
              <span className="font-medium text-ink">Studio</span>, and{" "}
              <span className="font-medium text-ink">Archie</span>, the model that turns
              plain language into precise, buildable geometry. None of it is public yet.
            </p>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={ACCESS_URL} size="lg" variant="accent">
                {CLEARANCE_CTA}
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button href="#systems" size="lg" variant="secondary">
                See the systems <ArrowDown size={16} />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
