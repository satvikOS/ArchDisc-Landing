"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { LogoMark } from "@/components/brand/Logo";
import { how } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const BRACKET_PROMPT =
  "A wall-mount bracket, 100 mm wide, two M6 holes 60 mm apart, 4 mm wall, fillet the inside corners.";

const PLAN = [
  ["width", "100 mm"],
  ["height", "40 mm"],
  ["wall", "4 mm"],
  ["holes", "2 × M6 · pitch 60"],
  ["fillet", "inner · r3"],
];

function StepBlock({
  step,
  index,
  active,
  onActive,
}: {
  step: (typeof how.steps)[number];
  index: number;
  active: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  const on = active === index;

  return (
    <div ref={ref} className="relative pb-14 pl-16 last:pb-0">
      <div
        className={cn(
          "absolute left-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-[2px] border font-mono text-[12px] transition-colors duration-300",
          on
            ? "border-ink bg-ink text-paper"
            : "border-line bg-surface text-faint",
        )}
      >
        {step.n}
      </div>
      <p
        className={cn(
          "font-mono text-[11px] uppercase tracking-wider transition-colors duration-300",
          on ? "text-ink" : "text-faint",
        )}
      >
        {step.label}
      </p>
      <h3
        className={cn(
          "mt-1.5 text-h3 font-semibold transition-colors duration-300",
          on ? "text-ink" : "text-ink/45",
        )}
      >
        {step.title}
      </h3>
      <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-muted">
        {step.body}
      </p>
    </div>
  );
}

function ConsoleView({ active }: { active: number }) {
  const reduce = useReducedMotion();
  if (active === 0) {
    return (
      <div className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
          prompt
        </p>
        <div className="ml-auto max-w-[92%] rounded-[4px] bg-ink px-3.5 py-2.5 text-[13px] leading-snug text-paper">
          {BRACKET_PROMPT}
        </div>
      </div>
    );
  }
  if (active === 1) {
    return (
      <div className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
          resolved parameters
        </p>
        <dl className="overflow-hidden rounded-[2px] border border-line">
          {PLAN.map(([k, v], i) => (
            <div
              key={k}
              className={cn(
                "grid grid-cols-[6rem_1fr] gap-2 px-3 py-2 font-mono text-[12px]",
                i !== 0 && "border-t border-line",
              )}
            >
              <dt className="text-faint">{k}</dt>
              <dd className="text-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (active === 2) {
    return (
      <div className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
          tool-calls
        </p>
        <div className="space-y-1.5 rounded-[2px] border border-line bg-paper p-3 font-mono text-[12px] leading-relaxed text-ink-soft">
          {how.steps[2].code?.map((line, i) => (
            <motion.div
              key={line}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : i * 0.08 }}
              className="flex gap-2"
            >
              <span className="select-none text-faint">{i + 1}</span>
              <span className={cn(line.includes("valid") && "text-ink")}>
                {line}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
        verify &amp; tune
      </p>
      <div className="inline-flex items-center gap-2 rounded-[2px] border border-line bg-paper px-3 py-2 font-mono text-[12px] text-ink">
        <span>✓</span> coherence gate · valid topology
      </div>
      <div className="rounded-[2px] border border-line p-3">
        <div className="flex items-center justify-between font-mono text-[12px]">
          <span className="text-faint">wall</span>
          <span className="text-ink-soft">
            <span className="text-faint line-through">4</span> → 3 mm
          </span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-line">
          <div className="h-1 w-2/5 rounded-full bg-ink" />
        </div>
        <p className="mt-2.5 text-[12px] text-muted">
          Re-solves locally — no second prompt.
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const onActive = useCallback((i: number) => setActive(i), []);

  return (
    <Section id="how" className="border-t border-line">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{how.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h2 font-semibold text-ink">
              {how.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-[17px] leading-relaxed text-muted">
              {how.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative">
            <div className="absolute bottom-2 left-[18px] top-2 w-px bg-line" />
            {how.steps.map((step, i) => (
              <StepBlock
                key={step.n}
                step={step}
                index={i}
                active={active}
                onActive={onActive}
              />
            ))}
          </div>

          <div className="md:sticky md:top-24 md:self-start">
            <div className="overflow-hidden rounded-[2px] border border-line-strong bg-surface">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <LogoMark className="h-3.5 w-3.5 text-ink" />
                <span className="font-mono text-[11px] text-muted">
                  archie · forge
                </span>
                <span className="ml-auto font-mono text-[10px] text-faint">
                  step {active + 1} / 4
                </span>
              </div>
              <div className="relative min-h-[320px] p-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                  >
                    <ConsoleView active={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="mt-14 max-w-3xl text-pretty text-[17px] leading-relaxed text-ink-soft">
            {how.closing}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
