"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { BuildScene } from "@/components/three/BuildScene";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { Parallax } from "@/components/motion/Parallax";
import {
  Asterisk, DieDots, Sparkle, ArrowSquiggle, Concentric, Pinwheel, Hexagon, Checker,
} from "@/components/decor/Stickers";

const PROMPT = "a bearing flange — Ø90 bore, four bolt holes, raised boss";
const CHAR_MS = 30;
const TYPE_MS = PROMPT.length * CHAR_MS;

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

  const rise = {
    hidden: { y: 20 },
    show: (i: number) => ({ y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.06 + i * 0.08 } }),
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="dot-grid absolute inset-0 -z-10 opacity-60" aria-hidden />
      {/* dense hard decor */}
      <Parallax y={40} className="pointer-events-none absolute -left-10 top-40 -z-10 hidden lg:block">
        <Pinwheel className="h-32 w-32 spin-slow text-olive" />
      </Parallax>
      <Asterisk className="pointer-events-none absolute left-[46%] top-4 -z-10 hidden h-12 w-12 text-coral md:block" aria-hidden />
      <Checker n={4} a="var(--color-sage)" className="pointer-events-none absolute right-[8%] top-2 -z-10 hidden h-16 w-16 rotate-6 md:block" aria-hidden />
      <Hexagon className="pointer-events-none absolute bottom-8 left-[40%] -z-10 hidden h-14 w-14 bob text-lime md:block" aria-hidden />

      <div className="mx-auto grid w-full max-w-[1660px] items-center gap-10 px-4 pb-20 pt-12 md:px-8 lg:min-h-[88vh] lg:grid-cols-[48fr_52fr] lg:gap-10">
        {/* ── message (irregular type) ── */}
        <div className="relative z-10 order-2 lg:order-1">
          <span className="eyebrow bg-lime">
            <Sparkle className="h-3.5 w-3.5 text-coral" /> Creative AI for the physical world
          </span>

          <h1 className="mt-6 text-ink">
            <motion.span
              className="flex flex-wrap items-end gap-x-4 leading-[0.82]"
              custom={0}
              variants={rise}
              initial={reduce ? false : "hidden"}
              animate="show"
            >
              <span className="font-display text-mega font-extrabold">Describe</span>
              <span className="accent-serif -rotate-3 text-[clamp(2.2rem,1rem+5vw,5rem)] text-brown">it.</span>
            </motion.span>
            <motion.span
              className="mt-2 flex flex-wrap items-center gap-x-4 leading-[0.85]"
              custom={1}
              variants={rise}
              initial={reduce ? false : "hidden"}
              animate="show"
            >
              <span className="inline-block -rotate-2 rounded-xl border-[3px] border-ink bg-coral px-3 pb-1 font-display text-[clamp(2.6rem,1rem+7vw,6.5rem)] font-extrabold text-cream nb-shadow-sm">
                Archie
              </span>
              <span className="font-display text-[clamp(2.4rem,1rem+6vw,6rem)] font-extrabold">builds</span>
              <span className="font-display text-mega font-extrabold text-olive">it.</span>
            </motion.span>
          </h1>

          <motion.p
            className="mt-8 max-w-[42ch] text-lead text-ink-soft"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
          >
            Generative AI made media. ArchDisc makes{" "}
            <span className="accent-serif rounded-md bg-olive px-1.5 text-[1.14em] text-ink">matter</span>.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#matter"
              className="a-focus nb-card nb-hover inline-flex items-center gap-2 bg-lime px-5 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
            >
              See how it builds
              <ArrowDown size={15} className={reduce ? "" : "bob"} />
            </a>
            <span className="font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-ink-mute">
              Free · Local · Private
            </span>
          </motion.div>
        </div>

        {/* ── the live build window ── */}
        <div className="relative order-1 lg:order-2">
          <Parallax y={30} className="pointer-events-none absolute -right-10 -top-12 -z-10 hidden lg:block">
            <Concentric className="h-72 w-72 text-coral" />
          </Parallax>
          <DieDots className="absolute -right-3 -top-5 z-20 h-14 w-14 rotate-12 text-sky" aria-hidden />
          <ArrowSquiggle className="absolute -bottom-6 -left-5 z-20 hidden h-16 w-20 -rotate-6 text-brown sm:block" aria-hidden />
          <Checker n={3} a="var(--color-magenta)" className="absolute -bottom-4 right-6 z-20 hidden h-12 w-12 -rotate-6 md:block" aria-hidden />

          <div className="nb-card relative mx-auto aspect-square w-full max-w-[600px] overflow-hidden bg-peri nb-shadow-xl">
            <div className="hatch-soft absolute inset-0 opacity-[0.12]" aria-hidden />
            <BuildScene className="absolute inset-0" startDelay={TYPE_MS} />

            {sparked && !reduce && (
              <span
                key="spark"
                aria-hidden
                className="pop-flash pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-gold) 0%, color-mix(in srgb, var(--color-coral) 60%, transparent) 45%, transparent 70%)",
                }}
              />
            )}

            <div className="absolute inset-x-3 bottom-3">
              <div className="nb-2 flex items-center gap-2.5 rounded-lg bg-cream px-3 py-2.5">
                <span
                  className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink ${done ? "bg-lime" : "bg-coral"}`}
                  aria-hidden
                />
                <code className="u-mono truncate text-[12px] text-ink md:text-[13px]">
                  <span className="text-ink-mute">›</span> {typed}
                  {!done && <span className="caret text-coral">▌</span>}
                </code>
                <span className="ml-auto hidden shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-sage sm:inline">
                  {done ? "verified ✓" : "building…"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
