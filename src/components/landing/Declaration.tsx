import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Concentric, Pinwheel, Hexagon, Checker, Asterisk, Sparkle, Bolt } from "@/components/decor/Stickers";

const MODALITIES = ["text", "images", "video"];

export function Declaration() {
  return (
    <section id="matter" className="relative overflow-hidden border-y-[2.5px] border-ink bg-peach py-24 md:py-32">
      {/* dense hard decor */}
      <Parallax y={50} className="pointer-events-none absolute -left-12 top-6 hidden md:block">
        <Concentric className="h-44 w-44 text-peri" />
      </Parallax>
      <Parallax y={-40} className="pointer-events-none absolute -right-8 top-16 hidden md:block">
        <Pinwheel className="h-40 w-40 spin-slow text-violet" />
      </Parallax>
      <Checker n={4} a="var(--color-ink)" className="pointer-events-none absolute bottom-8 left-10 hidden h-20 w-20 -rotate-6 md:block" aria-hidden />
      <Hexagon className="pointer-events-none absolute bottom-14 right-16 hidden h-16 w-16 bob text-coral md:block" aria-hidden />
      <Bolt className="pointer-events-none absolute right-1/3 top-4 hidden h-12 w-12 rotate-12 text-olive lg:block" aria-hidden />

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
            <span className="tag bg-olive px-3 py-1 text-ink nb-shadow-sm">matter</span>
          </div>
        </Reveal>

        {/* irregular type — mixed sizes, one boxed word, a serif kicker */}
        <Reveal delay={0.12}>
          <h2 className="mt-10 text-ink">
            <span className="block font-display text-[clamp(1.9rem,1rem+4vw,4rem)] font-extrabold leading-[0.95]">
              Generative AI learned to make{" "}
              <span className="accent-serif font-normal text-brown">media.</span>
            </span>
            <span className="mt-2 block font-display text-[clamp(2.1rem,1rem+5vw,4.6rem)] font-extrabold leading-[0.92]">
              Now it can make{" "}
              <span className="inline-block rotate-1 rounded-xl border-[3px] border-ink bg-coral px-3 pb-1 text-cream nb-shadow">
                real things
              </span>
              .
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-[42ch] font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-brown">
            The beginning of{" "}
            <span className="accent-serif text-[1.35em] font-normal normal-case tracking-normal">vibe designing</span>.
          </p>
        </Reveal>
      </div>

      <Asterisk className="pointer-events-none absolute bottom-6 left-1/2 h-8 w-8 -translate-x-1/2 spin-slow text-ink" aria-hidden />
    </section>
  );
}
