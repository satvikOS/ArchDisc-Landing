"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { BuildScene } from "@/components/three/BuildScene";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { EASE } from "@/lib/motion";

const PROMPT = "a bearing flange — Ø90 bore, four bolt holes, raised boss";
const CHAR_MS = 30;
const TYPE_MS = PROMPT.length * CHAR_MS; // ≈ 1.7s

export function Hero() {
  const reduce = usePrefersReducedMotion();
  const [typed, setTyped] = useState(reduce ? PROMPT : "");
  const [sparked, setSparked] = useState(false);
  const [done, setDone] = useState(reduce);

  useEffect(() => {
    if (reduce) {
      setTyped(PROMPT);
      setDone(true);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(PROMPT.slice(0, i));
      if (i >= PROMPT.length) {
        window.clearInterval(id);
        setSparked(true);
        window.setTimeout(() => setDone(true), 220);
      }
    }, CHAR_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  // LCP-safe: the headline is the largest text — never start it at opacity:0
  // (that bakes an invisible LCP element into the SSR HTML). Rise on transform only.
  const lineVariants = {
    hidden: { y: 16 },
    show: (i: number) => ({
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: 0.1 + i * 0.12 },
    }),
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="atmos -z-20" aria-hidden />
      <div className="blueprint-grid absolute inset-0 -z-10 opacity-40" aria-hidden />

      <div className="mx-auto grid w-full max-w-[1660px] items-center gap-8 px-5 pt-16 pb-20 md:px-10 lg:min-h-[90vh] lg:grid-cols-[47fr_53fr] lg:gap-12 lg:pt-10">
        {/* ── message ── */}
        <div className="relative z-10 order-2 lg:order-1">
          <motion.span
            className="eyebrow"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Creative AI for the physical world
          </motion.span>

          <h1 className="mt-6 font-display text-mega text-ink">
            <motion.span
              className="block"
              custom={0}
              variants={lineVariants}
              initial={reduce ? false : "hidden"}
              animate="show"
            >
              Describe it.
            </motion.span>
            <motion.span
              className="block glow-accent"
              custom={1}
              variants={lineVariants}
              initial={reduce ? false : "hidden"}
              animate="show"
            >
              Archie builds it.
            </motion.span>
          </h1>

          <motion.p
            className="mt-8 max-w-[46ch] text-lead text-ink-soft text-pretty"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          >
            Generative AI learned to write, draw, and film. ArchDisc gives it{" "}
            <span className="accent-serif text-[1.05em]">matter</span> — you describe an
            object in a sentence, and Archie plans it, builds it, and verifies it against a
            real geometry kernel until it&rsquo;s genuinely manufacturable.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <a
              href="#matter"
              className="a-focus inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-clay"
            >
              See how it builds
              <ArrowDown size={15} className={reduce ? "" : "animate-bounce"} />
            </a>
            <span className="u-spec text-muted">
              Free · Local · Private · Apple-Silicon-native
            </span>
          </motion.div>
        </div>

        {/* ── the live build ── */}
        <div className="relative order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-[640px]">
            <div className="stage-ring absolute inset-0 -z-0" aria-hidden />
            <BuildScene className="absolute inset-0" startDelay={TYPE_MS} />

            {/* spark at the generative instant */}
            {sparked && !reduce && (
              <span
                key="spark"
                aria-hidden
                className="spark-flash pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-spark) 0%, color-mix(in srgb, var(--color-spark) 50%, transparent) 40%, transparent 70%)",
                }}
              />
            )}

            {/* prompt HUD — the sentence that becomes the part */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 md:inset-x-6 md:bottom-6">
              <div className="hud-panel flex items-center gap-3 px-4 py-3">
                <span
                  className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                    done ? "bg-clay signal-dot" : "bg-spark"
                  }`}
                  aria-hidden
                />
                <code className="u-cipher truncate text-[12.5px] text-ink-soft md:text-[13.5px]">
                  <span className="text-muted">›</span> {typed}
                  {!done && <span className="caret text-clay">▌</span>}
                </code>
                <span className="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:inline">
                  {done ? "verified · watertight" : "building…"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-paper" aria-hidden />
    </section>
  );
}
