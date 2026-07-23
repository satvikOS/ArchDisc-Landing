"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { BuildScene } from "@/components/three/BuildScene";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { Concentric } from "@/components/decor/Stickers";
import { AaSpecimen, NumberSpecimen } from "@/components/decor/Specimens";

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
    hidden: { y: 22 },
    show: (i: number) => ({ y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.06 + i * 0.08 } }),
  };

  return (
    <section className="relative grid grid-cols-1 border-b-[2.5px] border-ink lg:min-h-[92vh] lg:grid-cols-[57fr_43fr]">
      {/* ── headline field (cream) ── */}
      <div className="relative flex flex-col justify-center px-5 py-16 md:px-10 lg:py-10">
        <span className="mb-8 inline-flex w-fit items-center gap-2 border-[2.5px] border-ink bg-lime px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
          Creative AI for the physical world
        </span>

        <h1 className="text-ink">
          <motion.span
            className="flex flex-wrap items-end gap-x-4 leading-[0.8]"
            custom={0}
            variants={rise}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <span className="font-display text-mega font-extrabold">Describe</span>
            <span className="accent-serif -rotate-3 text-[clamp(2rem,1rem+4.5vw,4.5rem)] text-brown">it.</span>
          </motion.span>
          <motion.span
            className="mt-2 flex flex-wrap items-center gap-x-3 leading-[0.82]"
            custom={1}
            variants={rise}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <span className="inline-block -rotate-1 border-[3px] border-ink bg-coral px-2.5 pb-1 font-display text-[clamp(2.4rem,1rem+6.5vw,6rem)] font-extrabold text-cream">
              Archie
            </span>
            <span className="font-display text-[clamp(2.2rem,1rem+5.5vw,5.4rem)] font-extrabold">builds</span>
            <span className="font-display text-mega font-extrabold text-olive">it.</span>
          </motion.span>
        </h1>

        <motion.p
          className="mt-9 max-w-[40ch] text-lead text-ink-soft"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
        >
          Generative AI made media. ArchDisc makes{" "}
          <span className="accent-serif border-b-[3px] border-olive text-[1.14em] text-brown">matter</span>.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="#matter"
            className="a-focus inline-flex items-center gap-2 border-[2.5px] border-ink bg-lime px-5 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-transform hover:-translate-y-0.5"
          >
            See how it builds
            <ArrowDown size={15} className={reduce ? "" : "bob"} />
          </a>
          <span className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink-mute">
            Free · Local · Private
          </span>
        </motion.div>
      </div>

      {/* ── butted color-field gallery ── */}
      <div className="grid grid-cols-2 border-t-[2.5px] border-ink lg:border-l-[2.5px] lg:border-t-0">
        {/* 3D part — flat field, no background clutter */}
        <div className="relative col-span-2 aspect-[16/10] border-b-[2.5px] border-ink bg-peri">
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
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t-[2.5px] border-ink bg-cream px-3 py-2">
            <span
              className={`inline-block h-2.5 w-2.5 shrink-0 border-2 border-ink ${done ? "bg-lime" : "bg-coral"}`}
              aria-hidden
            />
            <code className="u-mono truncate text-[12px] text-ink">
              <span className="text-ink-mute">›</span> {typed}
              {!done && <span className="caret text-coral">▌</span>}
            </code>
            <span className="ml-auto hidden shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-sage sm:inline">
              {done ? "verified ✓" : "building…"}
            </span>
          </div>
        </div>

        {/* Aa specimen */}
        <div className="flex aspect-square items-center justify-center overflow-hidden border-b-[2.5px] border-r-[2.5px] border-ink bg-olive">
          <AaSpecimen c1="var(--color-sage)" c2="var(--color-cream)" className="text-[30vw] lg:text-[13vw]" />
        </div>

        {/* number specimen */}
        <div className="flex aspect-square items-center justify-center overflow-hidden border-b-[2.5px] border-ink bg-coral">
          <NumberSpecimen n="0110" className="text-[15vw] text-cream lg:text-[5vw]" />
        </div>

        {/* concentric */}
        <div className="flex aspect-square items-center justify-center overflow-hidden border-r-[2.5px] border-ink bg-lime p-5">
          <Concentric className="h-full w-full text-peri" />
        </div>

        {/* checker */}
        <div className="checker-bg aspect-square overflow-hidden bg-ink" aria-hidden />
      </div>
    </section>
  );
}
