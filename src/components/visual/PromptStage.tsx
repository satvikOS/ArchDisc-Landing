"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { DotGrid } from "@/components/visual/DotGrid";
import { ThroughLine } from "@/components/visual/ThroughLine";
import { stagger, riseIn } from "@/lib/motion";

const PROMPT = "Revolve a 60 mm vase profile, shell to 2 mm, fillet the rim.";
const CHIPS = ["part.revolveProfile", "part.shell(2.0)", "part.filletEdges(rim)"];

const charV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.001 } },
};

/** The hero's prompt-to-geometry stage: a typed prompt, tool-call chips that
 *  stamp in, and the through-line resolving into a dimensioned solid. Plays once. */
export function PromptStage() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";

  return (
    <div className="overflow-hidden rounded-[2px] border border-line-strong bg-surface">
      {/* prompt field */}
      <div className="border-b border-line p-4">
        <div className="flex items-center gap-2.5 rounded-[2px] border border-line bg-paper px-3 py-2.5 font-mono text-[12.5px] leading-snug text-ink-soft">
          <span className="text-faint">›</span>
          <motion.span
            className="whitespace-pre-wrap"
            variants={stagger(0.018, 0.15)}
            initial={init}
            animate="show"
          >
            {PROMPT.split("").map((c, i) => (
              <motion.span key={i} variants={charV}>
                {c}
              </motion.span>
            ))}
          </motion.span>
          <span className="ml-0.5 inline-block h-3.5 w-px shrink-0 bg-ink/60" />
        </div>
      </div>

      {/* chips + geometry */}
      <div className="grid md:grid-cols-[210px_1fr]">
        <motion.div
          className="flex flex-col gap-2 border-b border-line p-4 md:border-b-0 md:border-r"
          variants={stagger(0.1, 1)}
          initial={init}
          animate="show"
        >
          <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            tool-calls
          </span>
          {CHIPS.map((c) => (
            <motion.div
              key={c}
              variants={riseIn}
              className="flex items-center gap-2 rounded-[2px] border border-line bg-surface px-2.5 py-1.5 font-mono text-[11px] text-ink-soft"
            >
              <span className="text-faint">→</span>
              {c}
            </motion.div>
          ))}
          <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted">
            <span className="text-ink">✓</span> coherence gate · valid
          </div>
        </motion.div>

        <div className="relative min-h-[300px] overflow-hidden bg-paper">
          <DotGrid size={22} />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <ThroughLine
              variant="hero"
              trigger="load"
              startDelay={0.5}
              className="h-full max-h-[300px] w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
