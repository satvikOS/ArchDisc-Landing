"use client";

import { ArrowRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { DotGrid } from "@/components/visual/DotGrid";
import { PromptStage } from "@/components/visual/PromptStage";
import { stagger, riseIn } from "@/lib/motion";
import { hero, APP_URL, WATCH_URL } from "@/lib/content";

export function Hero() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";
  const words = hero.headlineLines.map((line) => line.split(" "));

  return (
    <section id="top" className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <DotGrid />

      <Container className="relative flex flex-col items-start">
        <Reveal>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </Reveal>

        <motion.h1
          className="mt-6 max-w-[18ch] text-balance text-left text-hero font-semibold text-ink"
          variants={stagger(0.04, 0.05)}
          initial={init}
          animate="show"
        >
          {words.map((line, li) => (
            <span key={li} className="block">
              {line.map((w, wi) => (
                <motion.span key={wi} variants={riseIn} className="mr-[0.22em] inline-block">
                  {w}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-relaxed text-muted">
            {hero.subhead}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href={APP_URL} size="lg">
              {hero.primaryCta}
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href={WATCH_URL} size="lg" variant="secondary">
              <Play size={15} />
              {hero.secondaryCta}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 font-mono text-[12px] tracking-wide text-faint">
            {hero.micro}
          </p>
        </Reveal>
      </Container>

      <Container className="relative mt-14 md:mt-16">
        <div className="border-y border-line py-10 md:py-12">
          <Reveal delay={0.1} y={24}>
            <PromptStage />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
