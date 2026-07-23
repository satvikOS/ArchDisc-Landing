import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Asterisk, Sparkle, Flower, Zigzag } from "@/components/decor/Stickers";

export function Closing() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden border-t-[2.5px] border-ink bg-coral py-24 text-cream">
      <Asterisk className="absolute left-6 top-10 h-20 w-20 spin-slow text-olive" aria-hidden />
      <Flower className="absolute right-10 top-14 hidden h-16 w-16 text-lime md:block" aria-hidden />
      <Zigzag className="absolute bottom-10 left-1/4 hidden h-10 w-28 text-cream/40 md:block" aria-hidden />
      <Sparkle className="absolute bottom-16 right-1/4 h-12 w-12 text-cream" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <span className="eyebrow bg-cream text-ink">The beginning</span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-8 font-display text-mega leading-[0.9] text-cream">
            Make anything{" "}
            <span className="inline-block rotate-2 rounded-2xl border-[4px] border-ink bg-lime px-4 pb-2 text-ink nb-shadow-lg">
              real.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-9 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-cream/90">
            Describe it. Archie builds it.
          </p>
        </Reveal>

        <Reveal delay={0.28}>
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
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-cream">
              <span className="h-1.5 w-1.5 rounded-full bg-lime bob" aria-hidden />
              Public release soon
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
