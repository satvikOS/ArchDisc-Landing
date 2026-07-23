import { Reveal } from "@/components/motion/Reveal";
import { Clover, Flower, Sparkle, Target } from "@/components/decor/Stickers";

const MODALITIES = ["text", "images", "video"];

export function Declaration() {
  return (
    <section id="matter" className="relative overflow-hidden border-y-[2.5px] border-ink bg-lav py-24 md:py-32">
      <Clover className="absolute -left-8 top-10 h-28 w-28 -rotate-12 text-sage/70" aria-hidden />
      <Target className="absolute right-6 bottom-10 hidden h-20 w-20 text-coral md:block" aria-hidden />
      <Flower className="absolute right-16 top-8 hidden h-14 w-14 spin-slow text-lime md:block" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <span className="eyebrow bg-cream">
            <Sparkle className="h-3 w-3 text-coral" /> The shift
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-ink">
            {MODALITIES.map((m) => (
              <span key={m} className="inline-flex items-center gap-2.5">
                <span className="nb-2 rounded-md bg-cream px-2.5 py-1">{m}</span>
                <span aria-hidden>→</span>
              </span>
            ))}
            <span className="tag bg-olive px-3 py-1 text-cream nb-shadow-sm">matter</span>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <h2 className="mt-10 font-display text-display text-ink">
            Generative AI learned to make media.
            <br className="hidden sm:block" /> Now it can make{" "}
            <span className="inline-block rotate-1 rounded-xl border-[3px] border-ink bg-coral px-3 pb-1 text-cream nb-shadow">
              real things
            </span>
            .
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-[42ch] font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-brown">
            The beginning of{" "}
            <span className="accent-serif text-[1.35em] font-normal normal-case tracking-normal">vibe designing</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
