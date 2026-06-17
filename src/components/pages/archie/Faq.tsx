"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type QA = { q: string; a: string };

const QAS: QA[] = [
  {
    q: "Is this just text-to-CAD that spits out a script?",
    a: "No. Archie emits structured tool-calls into a real B-rep kernel and returns an editable feature tree, then verifies the solid before handing it back. You get geometry you can edit, simulate, and export — not disposable code.",
  },
  {
    q: "Do my prompts or designs leave my machine?",
    a: "No. The model fleet runs locally, on-device. Your words and your geometry stay on your hardware — private by default, and fast because there is no round-trip.",
  },
  {
    q: "Is it really free, and where does the model run?",
    a: "Yes — ArchDisc is free to use, and the Archie fleet runs entirely on-device, inside the app. There's no metered API and no per-token bill. We build and maintain the kernel, the app, and the models; you create with them. ArchDisc is in pre-release; a public release is coming soon.",
  },
  {
    q: "What if Archie gets the geometry wrong?",
    a: "A coherence gate runs checkValidity() on every result and repairs invalid topology before you see it. And because it returns a feature tree, you can correct any value by hand without re-prompting.",
  },
  {
    q: "Do I still have full manual control?",
    a: "Yes. Archie is a copilot, not a wall. Every operation lands in the normal feature tree and toolbars — drive it by hand whenever you want.",
  },
  {
    q: "Does one copilot really drive both Studio and Forge?",
    a: "Yes. The same Archie, the same tool-call schema and the same coherence gate move between creative 3D in Studio and mechanical CAD in Forge — it just changes which engine it speaks to.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <Section id="faq" className="relative isolate">
      <GenerativeGrid />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* sticky rail */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <span className="u-label inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
                  STRAIGHT ANSWERS
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-balance text-h2 text-ink">
                  What a careful engineer asks about the AI.
                </h2>
              </Reveal>
            </div>
          </div>

          {/* accordion */}
          <div className="lg:col-span-8">
            <ul className="flex flex-col border-t border-line">
              {QAS.map((item, i) => {
                const isOpen = open === i;
                return (
                  <li key={item.q} className="border-b border-line">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="group flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                      >
                        <span className="text-h4 font-medium text-ink">
                          {item.q}
                        </span>
                        <Plus
                          size={18}
                          aria-hidden
                          className={cn(
                            "shrink-0 text-muted transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isOpen && "rotate-45",
                          )}
                        />
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[58ch] pb-6 text-body text-ink-soft">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
