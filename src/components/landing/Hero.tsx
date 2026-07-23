"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { BuildScene } from "@/components/three/BuildScene";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { AaSpecimen, NumberSpecimen } from "@/components/decor/Specimens";
import { DimLine } from "@/components/decor/EngMarks";
import { QuarterTargetPixel, BarcodeBars, SelectionFrame } from "@/components/decor/ArtTiles";

const PROMPT = "a bearing flange — Ø90 bore, four bolt holes, raised boss";
const CHAR_MS = 30;
const TYPE_MS = PROMPT.length * CHAR_MS;

export function Hero() {
  const reduce = usePrefersReducedMotion();
  const [typed, setTyped] = useState(reduce ? PROMPT : "");
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
    <section className="relative grid grid-cols-1 border-b-[2.5px] border-ink lg:min-h-[92vh] lg:grid-cols-[55fr_45fr]">
      {/* ── headline field ── */}
      <div className="relative flex flex-col justify-center bg-cream px-5 py-12 md:px-10 lg:py-8">
        <span className="mb-8 inline-flex w-fit items-center border-[2.5px] border-ink bg-lime px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
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
            <span className="bubble font-display text-[clamp(3.4rem,0.4rem+12vw,11.5rem)] font-extrabold">
              Describe
            </span>
            <span className="accent-serif -rotate-6 text-[clamp(2.2rem,1rem+5vw,5rem)] text-brown">it.</span>
          </motion.span>
          <motion.span
            className="mt-2 flex flex-wrap items-center gap-x-3 leading-[0.82]"
            custom={1}
            variants={rise}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <span className="inline-block -rotate-2 bg-coral px-3 pb-1 font-display text-[clamp(2.6rem,1rem+7.5vw,7rem)] font-extrabold uppercase italic text-cream">
              Archie
            </span>
            <span className="font-display text-[clamp(2.4rem,1rem+6vw,6rem)] font-extrabold">builds</span>
            <span className="rotate-2 font-display text-[clamp(3.2rem,1rem+10vw,10rem)] font-extrabold text-olive">
              it.
            </span>
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
            <ArrowDown size={15} />
          </a>
          <span className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink-mute">
            Local · Private · On-device
          </span>
        </motion.div>
      </div>

      {/* ── butted poster mosaic (no seams — fields butt raw) ── */}
      <div className="grid grid-cols-2 border-t-[2.5px] border-ink lg:border-l-[2.5px] lg:border-t-0">
        {/* the model — static, no bg, "selected" on the canvas */}
        <div className="relative col-span-2 aspect-[16/10] bg-cream">
          <SelectionFrame className="absolute inset-0" color="var(--color-peri)">
            <BuildScene className="absolute inset-0" startDelay={TYPE_MS} />
          </SelectionFrame>
          {/* engineering annotation under the part */}
          <div className="pointer-events-none absolute bottom-12 left-1/2 w-40 -translate-x-1/2 text-ink" aria-hidden>
            <DimLine label="Ø90" className="w-full" />
          </div>
          <span className="hand pointer-events-none absolute right-4 top-3 rotate-2 text-[19px] text-brown">
            built from one line ↓
          </span>
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

        {/* Aa on lime — CROPPED, bleeding off the field edges */}
        <div className="relative aspect-square overflow-hidden bg-lime">
          <AaSpecimen
            c1="var(--color-sage)"
            c2="var(--color-brown)"
            className="absolute -left-[8%] top-[4%] text-[42vw] lg:text-[17vw]"
          />
        </div>

        {/* quarter-target dissolving into pixels — probabilistic → deterministic */}
        <div className="aspect-square overflow-hidden">
          <QuarterTargetPixel className="h-full w-full" preserveAspectRatio="xMidYMid slice" />
        </div>

        {/* bar-stripe block with selection dots */}
        <div className="aspect-square overflow-hidden">
          <BarcodeBars className="h-full w-full" preserveAspectRatio="xMidYMid slice" />
        </div>

        {/* 0110 on coral — cropped bleed */}
        <div className="relative aspect-square overflow-hidden bg-coral">
          <NumberSpecimen
            n="0110"
            className="absolute -right-[10%] top-1/2 -translate-y-1/2 text-[26vw] text-ink lg:text-[10vw]"
          />
        </div>

        {/* lavender base bar with one lime block — board 13's bottom strip */}
        <div className="col-span-2 flex h-10 bg-lav">
          <div className="ml-auto h-full w-10 bg-lime" />
          <div className="h-full w-10 bg-peri" />
        </div>
      </div>
    </section>
  );
}
