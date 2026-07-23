import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { RoughMark } from "@/components/motion/RoughMark";
import { ScribbleTangle, CurlyArrowLoop, WavyArrow, DartArrow, FlangeSketch } from "@/components/decor/HandDrawn";

const MODALITIES = ["text", "images", "video"];

export function Declaration() {
  return (
    <section id="matter" className="relative overflow-hidden border-y-[2.5px] border-ink bg-peach py-12 md:py-16">
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
          <h2 className="mt-8 text-ink">
            <span className="block font-display text-[clamp(2.2rem,1rem+5vw,5.2rem)] font-extrabold leading-[0.92]">
              Generative AI learned to make{" "}
              <span className="accent-serif -rotate-2 inline-block font-normal text-brown">media.</span>
            </span>
            <span className="mt-2 block font-display text-[clamp(2.6rem,1rem+6.5vw,6.4rem)] font-extrabold leading-[0.9]">
              Now it can make{" "}
              <RoughMark type="circle" color="var(--color-coral)" strokeWidth={3} padding={10}>
                <span className="bubble">real things</span>
              </RoughMark>
              .
            </span>
          </h2>
        </Reveal>

        {/* the pencil flow — the TRUE pipeline: idea → say it → plan → build → verified */}
        <Reveal delay={0.18}>
          <div className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-10">
            <figure className="flex flex-col items-center">
              <ScribbleTangle className="h-32 w-36 text-ink" />
              <figcaption className="hand mt-1 -rotate-3 text-[22px] text-brown">your idea</figcaption>
            </figure>
            <CurlyArrowLoop className="h-20 w-28 text-ink" aria-hidden />
            <figure className="flex flex-col items-center">
              <code className="u-mono max-w-[24ch] border-[2.5px] border-ink bg-cream px-3 py-2 text-[13px] font-bold text-ink">
                “a bearing flange — Ø90 bore”
              </code>
              <figcaption className="hand mt-3 rotate-2 text-[22px] text-brown">say it. one line.</figcaption>
            </figure>
            <WavyArrow className="h-16 w-28 text-ink" aria-hidden />
            <figure className="flex flex-col items-center">
              <div className="flex h-20 w-20 rotate-45 items-center justify-center bg-sage" aria-hidden>
                <span className="-rotate-45 font-mono text-[11px] font-bold uppercase text-cream">plan</span>
              </div>
              <figcaption className="hand mt-5 -rotate-1 text-[22px] text-brown">archie plans it</figcaption>
            </figure>
            <DartArrow className="h-14 w-24 text-ink" aria-hidden />
            <figure className="flex flex-col items-center">
              <FlangeSketch className="h-32 w-48 text-ink" />
              <figcaption className="hand mt-1 rotate-1 text-[22px] text-brown">the kernel builds it</figcaption>
            </figure>
            <span className="font-display text-4xl font-extrabold text-ink" aria-hidden>
              =
            </span>
            <figure className="flex flex-col items-center">
              <div className="part-tile relative h-36 w-52">
                <Image
                  src="/parts/valve-housing.png"
                  alt="The real part Archie built and verified."
                  fill
                  sizes="210px"
                  className="object-contain"
                />
              </div>
              <figcaption className="hand mt-1 -rotate-2 text-[22px] text-coral">verified. real. ✓</figcaption>
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
