import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ScribbleTangle, CurlyArrowLoop, WavyArrow, DartArrow, FlangeSketch } from "@/components/decor/HandDrawn";

const MODALITIES = ["text", "images", "video"];

export function Declaration() {
  return (
    <section id="matter" className="relative overflow-hidden border-y-[2.5px] border-ink bg-peach py-14 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-peri/85" />
        <div className="absolute left-8 bottom-24 h-40 w-40 rotate-12 bg-magenta/80" />
        <div className="absolute -right-16 top-1/4 h-72 w-72 rounded-bl-full bg-violet/80" />
        <div className="absolute right-10 bottom-10 h-32 w-32 rotate-45 bg-lime" />
        <div className="absolute left-1/4 -top-8 h-24 w-48 -rotate-6 bg-gold/90" />
        <div className="absolute right-1/4 -bottom-10 h-36 w-36 rounded-full bg-sky/90" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <span className="inline-flex items-center border-[2.5px] border-ink bg-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
            The shift
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mx-auto mt-6 flex w-fit flex-wrap items-center justify-center gap-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-ink">
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
              <span className="relative inline-block">
                <span className="bubble text-gold">real things</span>
                <svg className="pointer-events-none absolute -left-[6%] -top-[12%] h-[124%] w-[112%]" viewBox="0 0 100 40" preserveAspectRatio="none" fill="none" aria-hidden>
                  <path d="M8 21 C10 9 38 4 62 6 C86 8 96 15 94 23 C92 33 62 38 38 36 C16 34 6 29 8 21" stroke="var(--color-coral)" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </span>
              .
            </span>
          </h2>
        </Reveal>

        {/* the doodle flow — COMICALLY large, arrows only BETWEEN steps */}
        <Reveal delay={0.18}>
          <div className="mx-auto mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-12">
            <figure className="flex flex-col items-center">
              <span className="relative"><span className="absolute -left-4 -top-3 h-40 w-48 rounded-full bg-lav" aria-hidden /><ScribbleTangle className="relative h-44 w-52 text-ink" /></span>
              <figcaption className="hand -rotate-3 text-[28px] text-brown">your idea</figcaption>
            </figure>
            <CurlyArrowLoop className="h-24 w-36 shrink-0 text-coral" aria-hidden />
            <figure className="flex flex-col items-center">
              <code className="u-mono max-w-[22ch] border-[3px] border-ink bg-cream px-5 py-4 text-[17px] font-bold text-ink">
                “a bearing flange — Ø90 bore”
              </code>
              <figcaption className="hand mt-4 rotate-2 text-[28px] text-brown">say it. one line.</figcaption>
            </figure>
            <WavyArrow className="h-20 w-36 shrink-0 text-peri" aria-hidden />
            <figure className="flex flex-col items-center">
              <div className="flex h-32 w-32 rotate-45 items-center justify-center bg-sage" aria-hidden>
                <span className="-rotate-45 font-mono text-[15px] font-bold uppercase text-cream">plan</span>
              </div>
              <figcaption className="hand mt-8 -rotate-1 text-[28px] text-brown">archie plans it</figcaption>
            </figure>
            <DartArrow className="h-18 w-32 shrink-0 text-violet" aria-hidden />
            <figure className="flex flex-col items-center">
              <span className="relative"><span className="absolute -left-2 top-2 h-40 w-64 rounded-[2rem] bg-sky/80" aria-hidden /><FlangeSketch className="relative h-44 w-64 text-ink" /></span>
              <figcaption className="hand rotate-1 text-[28px] text-brown">the kernel builds it</figcaption>
            </figure>
            <span className="font-display text-6xl font-extrabold text-ink" aria-hidden>
              =
            </span>
            <figure className="flex flex-col items-center">
              <div className="part-tile relative h-48 w-72 bg-peach">
                <Image
                  src="/parts/valve-housing.png"
                  alt="The real part Archie built and verified."
                  fill
                  sizes="290px"
                  className="object-contain"
                />
              </div>
              <figcaption className="hand mt-1 -rotate-2 text-[28px] text-coral">verified. real. ✓</figcaption>
            </figure>
          </div>
        </Reveal>

        {/* the statement to the industry */}
        <Reveal delay={0.26}>
          <p className="mx-auto mt-14 whitespace-nowrap font-display text-[clamp(1.4rem,0.6rem+3vw,3.4rem)] font-extrabold leading-[0.95] text-ink">
            The beginning of{" "}
            <span className="relative inline-block">
              <span className="accent-serif font-normal text-brown">vibe designing</span>
              <svg className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" aria-hidden>
                <path d="M2 7 Q50 0 98 5" stroke="var(--color-peri)" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
