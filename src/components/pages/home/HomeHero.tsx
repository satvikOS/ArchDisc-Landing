"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GradientField } from "@/components/visual/GradientField";
import { LockedProbe } from "@/components/common/LockedProbe";
import { BigWord } from "@/components/fx/BigWord";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { Chip } from "@/components/ui/Chip";
import { stagger, riseIn } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

const HEAD = ["Three", "systems,", "behind", "the", "curtain."];

export function HomeHero() {
  const reduce = usePrefersReducedMotion();
  const init = reduce ? false : "hidden";

  return (
    <section
      id="hero"
      className="relative isolate scroll-mt-24 overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24"
    >
      <GradientField intensity={0.9} />

      {/* funnily enlarged, off-kilter */}
      <BigWord
        variant="outline"
        rotate={-7}
        className="absolute -right-6 top-10 hidden text-[clamp(4rem,11vw,9rem)] opacity-80 lg:block"
      >
        Psst.
      </BigWord>

      <Container className="relative grid items-center gap-12 lg:grid-cols-[46fr_54fr] lg:gap-16">
        <div className="flex flex-col items-start">
          <Reveal>
            <Chip tone="iris">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-iris-magenta" aria-hidden />
              A private viewing · opens soon
            </Chip>
          </Reveal>

          <motion.h1
            className="mt-6 max-w-[14ch] text-balance text-mega font-display font-semibold text-ink"
            variants={stagger(0.05, 0.05)}
            initial={init}
            animate="show"
          >
            {HEAD.map((w, i) => (
              <motion.span key={i} variants={riseIn} className="mr-[0.22em] inline-block">
                {i === 4 ? <span className="iris-text iris-text-anim">{w}</span> : w}
              </motion.span>
            ))}
          </motion.h1>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[52ch] text-pretty text-lead text-muted">
              ArchDisc is one place to design and engineer with an AI at the center —{" "}
              <span className="text-ink">Forge</span> for real CAD,{" "}
              <span className="text-ink">Studio</span> for creation, and{" "}
              <span className="text-ink">Archie</span>, the model that turns plain language
              into precise, buildable geometry. None of it is public yet. This is your
              early look through the gap in the door.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button href={ACCESS_URL} size="lg" variant="accent">
                {CLEARANCE_CTA}
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button href="#exhibition" size="lg" variant="secondary">
                Take the tour
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <span className="u-label text-faint">Doors open in</span>
                <div className="mt-1.5">
                  <SignalCountdown inline className="text-ink" />
                </div>
              </div>
              <p className="u-spec max-w-[34ch] text-faint">
                Free to use · local &amp; private · nothing leaves your machine.
              </p>
            </div>
          </Reveal>
        </div>

        {/* The interactive exhibit, behind glass */}
        <Reveal delay={0.1} y={24} className="relative">
          <BigWord
            variant="ghost"
            rotate={-90}
            className="absolute -left-[4.5rem] top-1/2 hidden -translate-y-1/2 text-[clamp(3rem,6vw,5rem)] lg:block"
          >
            Soon
          </BigWord>
          <LockedProbe />
          <p className="mt-3 pl-1 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            Please <span className="text-iris-magenta">do</span> touch the art.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
