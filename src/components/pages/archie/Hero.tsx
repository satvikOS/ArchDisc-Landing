"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { ToolCallLedger } from "@/components/artifacts/ToolCallLedger";
import { stagger, riseIn } from "@/lib/motion";
import { APP_URL } from "@/lib/site";

const EYEBROW = "ARCHIE · LOCAL DESIGN COPILOT";
const HEADLINE = "The copilot that builds geometry you can trust.";
const SUBHEAD =
  "Describe what you want in plain language; Archie turns it into structured, validated tool-calls and hands back real, editable geometry. It runs on a local, on-device model fleet — your words and your geometry never leave the machine.";
const MICRO =
  "Free to use · local & private · local fleet · public release soon — nothing leaves your machine.";

export function Hero() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";
  const words = HEADLINE.split(" ");

  return (
    <section
      id="hero"
      className="relative isolate scroll-mt-24 overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20"
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
            <Button href="#tool-calls" size="lg" variant="secondary">
              See how it works
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="u-spec mt-5 text-faint">{MICRO}</p>
        </Reveal>
      </Container>

      <Container className="relative mt-12 md:mt-14">
        <div className="border-y border-line py-8 md:py-10">
          <Reveal delay={0.1} y={24}>
            <ToolCallLedger
              twoPane
              variant="hero"
              tone="light"
              trigger="load"
              startDelay={0.55}
              className="mx-auto w-full max-w-5xl"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
