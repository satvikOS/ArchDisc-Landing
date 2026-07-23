import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import {
  Asterisk, Sparkle, Concentric, Pinwheel, Hexagon, Checker, DieDots, Bolt, Zigzag,
} from "@/components/decor/Stickers";

export function Closing() {
  return (
    <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden border-t-[2.5px] border-ink bg-coral py-24 text-cream md:py-32">
      {/* dense hard decor */}
      <Parallax y={60} className="pointer-events-none absolute -left-10 top-10 hidden md:block">
        <Concentric className="h-44 w-44 text-peri" />
      </Parallax>
      <Parallax y={-50} className="pointer-events-none absolute -right-8 bottom-10 hidden md:block">
        <Pinwheel className="h-40 w-40 spin-slow text-lime" />
      </Parallax>
      <Asterisk className="pointer-events-none absolute left-8 bottom-16 h-16 w-16 spin-slow text-cream" aria-hidden />
      <Hexagon className="pointer-events-none absolute right-12 top-14 hidden h-16 w-16 bob text-peri md:block" aria-hidden />
      <Checker n={4} a="var(--color-ink)" className="pointer-events-none absolute left-1/4 top-8 hidden h-16 w-16 rotate-6 md:block" aria-hidden />
      <DieDots className="pointer-events-none absolute right-1/4 bottom-20 hidden h-14 w-14 -rotate-6 text-sky md:block" aria-hidden />
      <Bolt className="pointer-events-none absolute left-1/3 bottom-8 hidden h-12 w-12 text-cream lg:block" aria-hidden />
      <Zigzag className="pointer-events-none absolute right-1/3 top-24 hidden h-8 w-24 text-cream/50 lg:block" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <span className="eyebrow bg-cream text-ink">The beginning</span>
        </Reveal>

        {/* irregular type — three words, three sizes/treatments */}
        <Reveal delay={0.08}>
          <h2 className="mt-8 text-cream">
            <span className="block font-display text-[clamp(2.4rem,1rem+7vw,7rem)] font-extrabold leading-[0.85]">
              Make
            </span>
            <span className="-mt-1 block font-display text-mega font-extrabold leading-[0.82]">
              anything
            </span>
            <span className="mt-2 inline-block rotate-2 rounded-xl border-[3px] border-ink bg-lime px-5 pb-2 font-display text-[clamp(3rem,1rem+9vw,8.5rem)] font-extrabold leading-[0.85] text-ink nb-shadow-xl">
              real.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mx-auto mt-10 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
            Describe it. Archie builds it.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href="https://app.archdisc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="a-focus nb-card nb-hover inline-flex items-center gap-2 bg-cream px-7 py-3.5 font-display text-[15px] font-extrabold text-ink"
            >
              Enter ArchDisc
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-ink bob" aria-hidden />
              Public release soon
            </span>
          </div>
        </Reveal>
      </div>
      <Sparkle className="pointer-events-none absolute bottom-6 right-8 h-10 w-10 text-cream" aria-hidden />
    </section>
  );
}
