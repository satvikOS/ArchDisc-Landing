"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { specs } from "@/lib/content";
import { EASE } from "@/lib/motion";

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <div>
      {specs.faq.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-line first:border-t">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 rounded-[2px] py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <span className="text-[15px] font-medium text-ink">{it.q}</span>
              <span className="font-mono text-lg leading-none text-muted">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-[14.5px] leading-relaxed text-muted">
                    {it.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function SpecsFaq() {
  return (
    <Section id="specs" className="border-t border-line bg-surface">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{specs.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h2 font-semibold text-ink">
              {specs.title}
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
          <dl className="h-fit">
            {specs.rows.map((r) => (
              <div
                key={r.k}
                className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-3 first:border-t"
              >
                <dt className="font-mono text-[11px] uppercase tracking-wider text-faint">
                  {r.k}
                </dt>
                <dd className="text-[13.5px] leading-relaxed text-ink-soft">
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>

          <Faq />
        </div>
      </Container>
    </Section>
  );
}
