"use client";

import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { ToolCallLedger } from "@/components/artifacts/ToolCallLedger";
import { stagger, riseIn } from "@/lib/motion";
import { APP_URL, GITHUB_URL } from "@/lib/site";

const EYEBROW = "ARCHIE · LOCAL DESIGN COPILOT";
const HEADLINE = "The copilot that builds geometry you can trust.";
const SUBHEAD =
  "Describe what you want in plain language. Archie resolves it into an ordered stream of structured, validated tool-calls, drives a real kernel and a real 3D engine, runs a coherence gate that repairs the solid before you see it, and hands back an editable feature tree — not a throwaway script. It all runs on a local, open-weights model fleet, so your words and your geometry never leave the machine.";
const MICRO =
  "Open source · free forever · local fleet · public release soon — nothing leaves your machine.";

export function Hero() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";
  const words = HEADLINE.split(" ");

  return (
    <section
      id="hero"
      className="relative isolate scroll-mt-24 overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28"
    >
      <GenerativeGrid crosshair annotations origin={["72%", "30%"]} />

      <Container className="relative flex flex-col items-start">
        <Reveal>
          <span className="u-label inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
            {EYEBROW}
          </span>
        </Reveal>

        <motion.h1
          className="mt-4 max-w-[18ch] text-balance text-left text-display font-display text-ink"
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
            <Button href={GITHUB_URL} size="lg" variant="secondary">
              <Star size={15} />
              Star on GitHub
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="u-spec mt-5 text-faint">{MICRO}</p>
        </Reveal>
      </Container>

      <Container className="relative mt-14 md:mt-16">
        <div className="border-y border-line py-10 md:py-12">
          <Reveal delay={0.1} y={24}>
            <ToolCallLedger
              variant="hero"
              tone="light"
              trigger="load"
              startDelay={0.55}
              className="mx-auto w-full max-w-2xl"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
