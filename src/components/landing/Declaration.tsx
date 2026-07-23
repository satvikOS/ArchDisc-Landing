import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { RoughMark } from "@/components/motion/RoughMark";
import { ScribbleTangle, CurlyArrowLoop, WavyArrow, DartArrow, FlangeSketch } from "@/components/decor/HandDrawn";

const MODALITIES = ["text", "images", "video"];

export function Declaration() {
  return (
    <section id="matter" className="graph-grid relative overflow-hidden border-y-[2.5px] border-ink bg-peach py-24 md:py-32">
      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <span className="inline-flex items-center border-[2.5px] border-ink bg-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
            The shift
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-ink">
            {MODALITIES.map((m) => (
              <span key={m} className="inline-flex items-center gap-2.5">
                <span className="border-2 border-ink bg-cream px-2.5 py-1">{m}</span>
                <span aria-hidden>→</span>
              </span>
            ))}
            <span className="border-[2.5px] border-ink bg-olive px-3 py-1 font-display font-extrabold text-ink">matter</span>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <h2 className="mt-10 text-ink">
            <span className="block font-display text-[clamp(1.9rem,1rem+4vw,4rem)] font-extrabold leading-[0.95]">
              Generative AI learned to make <span className="accent-serif font-normal text-brown">media.</span>
            </span>
            <span className="mt-2 block font-display text-[clamp(2.1rem,1rem+5vw,4.6rem)] font-extrabold leading-[0.92]">
              Now it can make{" "}
              <RoughMark type="circle" color="var(--color-coral)" strokeWidth={2.5} padding={8}>
                real things
              </RoughMark>
              .
            </span>
          </h2>
        </Reveal>

        {/* the pencil flow — intent becomes matter */}
        <Reveal delay={0.18}>
          <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-8">
            <figure className="flex flex-col items-center">
              <ScribbleTangle className="h-24 w-28 text-ink" />
              <figcaption className="hand mt-1 -rotate-2 text-[19px] text-brown">your idea</figcaption>
            </figure>
            <CurlyArrowLoop className="h-16 w-24 text-ink" aria-hidden />
            <figure className="flex flex-col items-center">
              <div className="h-16 w-16 rotate-45 bg-sage" aria-hidden />
              <figcaption className="hand mt-4 rotate-1 text-[19px] text-brown">archie plans</figcaption>
            </figure>
            <WavyArrow className="h-14 w-24 text-ink" aria-hidden />
            <figure className="flex flex-col items-center">
              <FlangeSketch className="h-24 w-36 text-ink" />
              <figcaption className="hand mt-1 -rotate-1 text-[19px] text-brown">sketch</figcaption>
            </figure>
            <DartArrow className="h-12 w-20 text-ink" aria-hidden />
            <figure className="flex flex-col items-center">
              <div className="part-tile relative h-28 w-40">
                <Image
                  src="/parts/valve-housing.png"
                  alt="The real valve housing Archie built from a single line."
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
              <figcaption className="hand mt-1 rotate-2 text-[19px] text-coral">built. real.</figcaption>
            </figure>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <p className="mx-auto mt-12 max-w-[42ch] font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-brown">
            The beginning of{" "}
            <RoughMark type="underline" color="var(--color-peri)" strokeWidth={2}>
              <span className="accent-serif text-[1.35em] font-normal normal-case tracking-normal">vibe designing</span>
            </RoughMark>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
