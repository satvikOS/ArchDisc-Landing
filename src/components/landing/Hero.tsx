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
    <section className="relative overflow-hidden border-b-[2.5px] border-ink bg-cream">
      {/* ── rich art tiles spread CLEANLY across the background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-45">
        <QuarterTargetPixel className="absolute -right-8 -top-8 h-[30rem] w-[30rem] opacity-95 lg:h-[44rem] lg:w-[44rem]" />
        <BarcodeBars className="absolute -bottom-14 right-[16%] h-[26rem] w-[26rem] opacity-95" />
        <AaSpecimen
          c1="var(--color-sage)"
          c2="var(--color-brown)"
          className="absolute -bottom-10 -left-6 text-[22vw] opacity-90 lg:text-[19vw]"
        />
        <NumberSpecimen n="0110" className="absolute right-[38%] top-6 text-[11vw] text-coral opacity-90" />
        
        
        
      </div>

      <div className="relative z-10 flex min-h-[88vh] flex-col justify-between gap-8 px-4 pb-10 pt-8 md:px-10">
        <span className="inline-flex w-fit items-center border-[2.5px] border-ink bg-lime px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-ink">
          Creative AI for the physical world
        </span>

        <h1 className="text-ink">
          <motion.span
            className="flex flex-wrap items-end gap-x-5 leading-[0.9]"
            custom={0}
            variants={rise}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <span className="bubble text-[clamp(3.4rem,0.4rem+13vw,13rem)] text-lav">Describe</span>
            <span className="accent-serif -rotate-6 text-[clamp(2.4rem,1rem+6vw,6rem)] text-brown">it.</span>
          </motion.span>
          <motion.span
            className="mt-3 flex flex-wrap items-center gap-x-5 leading-[0.85]"
            custom={1}
            variants={rise}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <span className="inline-block -rotate-2 bg-coral px-4 pb-1.5 font-display text-[clamp(3rem,1rem+9vw,9rem)] font-extrabold uppercase italic text-cream">
              Archie
            </span>
            <span className="font-display text-[clamp(2.8rem,1rem+7.5vw,7.5rem)] font-extrabold">builds</span>
            <span className="bubble rotate-2 text-[clamp(3.4rem,1rem+11.5vw,11.5rem)] text-gold">it.</span>
          </motion.span>
        </h1>

        {/* the model — floating at the side like every other part */}
        <div className="pointer-events-none relative ml-auto w-[320px] max-w-[74vw] lg:absolute lg:right-8 lg:top-24 lg:z-10 lg:w-[400px]">
          <span className="hand absolute -top-5 left-2 -rotate-3 text-[22px] text-brown">built from one line ↓</span>
          <BuildScene className="h-[220px] w-full lg:h-[270px]" startDelay={TYPE_MS} />
          <div className="flex items-center gap-2 border-[2.5px] border-ink bg-cream px-2.5 py-1.5">
            <span className={`h-2 w-2 shrink-0 border-2 border-ink ${done ? "bg-lime" : "bg-coral"}`} aria-hidden />
            <code className="u-mono truncate text-[11.5px] text-ink">
              › {typed}
              {!done && <span className="caret text-coral">▌</span>}
            </code>
          </div>
        </div>

        <motion.div
          className="flex flex-wrap items-center gap-5"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="max-w-[30ch] text-[clamp(1.2rem,1rem+1vw,1.7rem)] font-semibold leading-snug text-ink">
            Generative AI made media. ArchDisc makes{" "}
            <span className="accent-serif border-b-[3px] border-olive text-[1.14em] text-brown">matter</span>.
          </p>
          <a
            href="#matter"
            className="a-focus inline-flex items-center gap-2 border-[2.5px] border-ink bg-lime px-6 py-3 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-transform hover:-translate-y-0.5"
          >
            See how it builds
            <ArrowDown size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
