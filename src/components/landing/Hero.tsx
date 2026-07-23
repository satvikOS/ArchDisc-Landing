"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { BuildScene } from "@/components/three/BuildScene";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { AaSpecimen, NumberSpecimen } from "@/components/decor/Specimens";
import { QuarterTargetPixel, BarcodeBars } from "@/components/decor/ArtTiles";

const PROMPT = "a bearing flange — Ø90 bore, four bolt holes";
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
    <section className="relative grid grid-cols-1 border-b-[2.5px] border-ink lg:grid-cols-[58fr_42fr]">
      {/* ── headline field — packed, voids filled with flat shapes ── */}
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden bg-cream px-4 pb-8 pt-6 md:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-[30%] h-52 w-52 rounded-full bg-magenta/85" />
          <div className="absolute left-[36%] -top-10 h-44 w-44 rotate-45 bg-violet/80" />
          <div className="absolute right-[26%] top-[52%] h-40 w-40 rounded-tl-full bg-sky" />
          <div className="absolute -bottom-12 left-[18%] h-44 w-44 rounded-full bg-gold/90" />
          <div className="absolute bottom-[26%] -right-8 h-24 w-56 -rotate-12 bg-lime" />
          <div className="absolute left-[58%] bottom-4 h-16 w-16 rotate-12 bg-peri" />
        </div>
        <span className="relative z-10 inline-flex w-fit items-center border-[2.5px] border-ink bg-lime px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
          Creative AI for the physical world
        </span>

        <h1 className="relative z-10 text-ink">
          <motion.span
            className="flex flex-wrap items-end gap-x-4 leading-[0.9]"
            custom={0}
            variants={rise}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <span className="bubble text-[clamp(3rem,0.4rem+10.5vw,10rem)] text-lav">Describe</span>
            <span className="accent-serif -rotate-6 text-[clamp(2.2rem,1rem+5vw,5rem)] text-brown">it.</span>
          </motion.span>
          <motion.span
            className="mt-3 flex flex-wrap items-center gap-x-4 leading-[0.85]"
            custom={1}
            variants={rise}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <span className="inline-block -rotate-2 bg-coral px-3 pb-1 font-display text-[clamp(2.6rem,1rem+7.5vw,7.2rem)] font-extrabold uppercase italic text-cream">
              Archie
            </span>
            <span className="font-display text-[clamp(2.4rem,1rem+6vw,6rem)] font-extrabold">builds</span>
            <span className="bubble rotate-2 text-[clamp(3rem,1rem+9.5vw,9.5rem)] text-gold">it.</span>
          </motion.span>
        </h1>

        {/* the model — floating at the side like every other part */}
        <div className="pointer-events-none relative -mr-2 ml-auto w-[300px] max-w-[70vw] lg:absolute lg:-right-16 lg:top-4 lg:z-20 lg:m-0 lg:w-[360px]">
          <span className="hand absolute -top-4 left-2 -rotate-3 text-[20px] text-brown">built from one line ↓</span>
          <BuildScene className="h-[210px] w-full lg:h-[250px]" startDelay={TYPE_MS} />
          <div className="flex items-center gap-2 border-[2.5px] border-ink bg-cream px-2.5 py-1.5">
            <span className={`h-2 w-2 shrink-0 border-2 border-ink ${done ? "bg-lime" : "bg-coral"}`} aria-hidden />
            <code className="u-mono truncate text-[11px] text-ink">
              › {typed}
              {!done && <span className="caret text-coral">▌</span>}
            </code>
          </div>
        </div>

        <motion.div
          className="relative z-10 flex flex-wrap items-center gap-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="max-w-[34ch] text-lead font-medium text-ink-soft">
            Generative AI made media. ArchDisc makes{" "}
            <span className="accent-serif border-b-[3px] border-olive text-[1.14em] text-brown">matter</span>.
          </p>
          <a
            href="#matter"
            className="a-focus inline-flex items-center gap-2 border-[2.5px] border-ink bg-lime px-5 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-transform hover:-translate-y-0.5"
          >
            See how it builds
            <ArrowDown size={15} />
          </a>
        </motion.div>
      </div>

      {/* ── butted poster mosaic — pure art, full column ── */}
      <div className="grid grid-cols-2 grid-rows-[1fr_1fr_2.5rem] border-t-[2.5px] border-ink lg:border-l-[2.5px] lg:border-t-0">
        <div className="relative min-h-[38vw] overflow-hidden bg-lime lg:min-h-0">
          <AaSpecimen
            c1="var(--color-sage)"
            c2="var(--color-brown)"
            className="absolute -left-[8%] top-[2%] text-[46vw] lg:text-[19vw]"
          />
        </div>
        <div className="relative overflow-hidden">
          <QuarterTargetPixel className="h-full w-full" preserveAspectRatio="xMidYMid slice" />
        </div>
        <div className="relative overflow-hidden">
          <BarcodeBars className="h-full w-full" preserveAspectRatio="xMidYMid slice" />
        </div>
        <div className="relative min-h-[38vw] overflow-hidden bg-coral lg:min-h-0">
          <NumberSpecimen
            n="0110"
            className="absolute -right-[12%] top-1/2 -translate-y-1/2 text-[30vw] text-ink lg:text-[12vw]"
          />
        </div>
        <div className="col-span-2 flex bg-lav">
          <div className="ml-auto h-full w-12 bg-lime" />
          <div className="h-full w-12 bg-peri" />
        </div>
      </div>
    </section>
  );
}
