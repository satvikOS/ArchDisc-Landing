import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Concentric, Pinwheel, Hexagon, Checker } from "@/components/decor/Stickers";
import { AaSpecimen } from "@/components/decor/Specimens";

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
      <Hexagon className="pointer-events-none absolute bottom-14 right-16 hidden h-16 w-16 text-coral md:block" aria-hidden />
      <div className="pointer-events-none absolute right-[6%] top-10 hidden select-none lg:block" aria-hidden>
        <AaSpecimen c1="var(--color-brown)" c2="var(--color-peri)" className="text-[7rem] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <span className="inline-flex items-center border-[2.5px] border-ink bg-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
            The shift
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

    </section>
  );
}
