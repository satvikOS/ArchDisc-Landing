import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { InkBurst, SpeedLines } from "@/components/decor/HandDrawn";
import { PixelSteps } from "@/components/decor/ArtTiles";

export function Closing() {
  return (
    <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden border-t-[2.5px] border-ink bg-coral py-24 text-cream md:py-32">
      <Parallax y={40} className="pointer-events-none absolute -left-10 top-10 hidden md:block">
        <PixelSteps className="h-40 w-40 opacity-90" />
      </Parallax>
      <InkBurst className="pointer-events-none absolute right-14 top-16 hidden h-20 w-20 text-cream lg:block" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-violet/80" />
        <div className="absolute right-[12%] top-1/3 h-40 w-40 rotate-45 bg-gold/90" />
        <div className="absolute -right-16 -bottom-14 h-64 w-64 rounded-tl-full bg-magenta/80" />
        <div className="absolute left-[22%] top-12 h-28 w-28 rounded-full bg-sky/90" />
        <div className="absolute left-1/2 -bottom-8 h-20 w-44 -rotate-6 bg-lime/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <span className="inline-flex items-center border-[2.5px] border-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-cream">
            The beginning
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-8 text-cream">
            <span className="block -rotate-1 font-display text-[clamp(2.4rem,1rem+7vw,7rem)] font-extrabold leading-[0.82]">Make</span>
            <span className="bubble -mt-1 block text-[clamp(3rem,0.4rem+11vw,11rem)] leading-[0.92] text-lav">
              anything
            </span>
            <span className="relative mt-3 inline-block">
              <span className="inline-block -rotate-1 border-[3px] border-ink bg-lime px-5 pb-2 font-display text-[clamp(3rem,1rem+9vw,8.5rem)] font-extrabold leading-[0.82] text-ink">
                real.
              </span>
              <SpeedLines
                className="pointer-events-none absolute -left-16 top-1/2 h-12 w-14 -translate-y-1/2 text-cream"
                aria-hidden
              />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mx-auto mt-10 font-mono text-[13px] font-bold uppercase tracking-[0.16em] text-ink">
            Describe it. Archie builds it.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex items-center justify-center">
            <span className="inline-flex items-center gap-2.5 border-[2.5px] border-ink bg-cream px-5 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-ink">
              <span className="h-2 w-2 rounded-full bg-coral" aria-hidden />
              Public release soon
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
