import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CircleGridTile } from "@/components/decor/ArtTiles";
import { DatumFlag } from "@/components/decor/EngMarks";

const HF = "https://huggingface.co/spaces/HuggingAI4Engineering/CADGenBench";

export function Benchmark() {
  return (
    <section id="benchmark" className="relative overflow-hidden border-b-[2.5px] border-ink bg-gold py-12 md:py-16">
      {/* scattered part — floats at the left edge, half off-canvas */}
      <figure className="part-tile pointer-events-none absolute -left-16 bottom-6 z-10 hidden h-52 w-72 bg-gold lg:block" aria-hidden>
        <Image src="/parts/gearbox-housing.png" alt="" fill sizes="260px" className="object-contain" />
        <figcaption className="hand absolute -bottom-1 left-20 -rotate-3 text-[18px] text-brown">
          a gearbox, from one line
        </figcaption>
      </figure>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-violet/80" />
        <div className="absolute right-1/4 bottom-2 h-24 w-24 rotate-45 bg-sky/90" />
        <div className="absolute left-1/3 -top-8 h-20 w-40 -rotate-6 bg-coral/90" />
      </div>
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[1180px] px-4 md:px-8">
          <Reveal>
            <span className="inline-flex items-center border-[2.5px] border-ink bg-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
              Benchmarked · not vibes
            </span>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="mt-8 grid grid-cols-1 overflow-hidden border-y-[2.5px] border-ink md:grid-cols-[minmax(260px,auto)_1fr_auto]">
            {/* big number specimen */}
            <div className="relative flex flex-col justify-center overflow-hidden bg-olive p-8 text-ink">
              <DatumFlag letter="A" className="absolute right-2 top-2 h-12 w-16" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">CADGenBench</span>
              <span className="specimen mt-1 text-[clamp(4.5rem,12vw,8.5rem)]">#2</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">overall leaderboard</span>
            </div>

            {/* claim */}
            <div className="flex flex-col justify-center bg-cream p-8 md:p-10">
              <p className="font-display text-[clamp(2rem,1rem+3.4vw,3.8rem)] font-extrabold leading-[0.92] text-ink">
                <span className="mr-1 inline-block -rotate-3 border-[3px] border-ink bg-lime px-2">#1</span> among{" "}
                <span className="bubble text-peach">local models</span>.
              </p>
              <p className="mt-4 max-w-[40ch] font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-ink-mute">
                Near-frontier accuracy — running on your own machine.
              </p>
            </div>

            {/* link on a circle-grid field */}
            <div className="relative flex items-center justify-center overflow-hidden p-8">
              <CircleGridTile className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" />
              <a
                href={HF}
                target="_blank"
                rel="noopener noreferrer"
                className="a-focus relative inline-flex items-center gap-2 border-[2.5px] border-ink bg-cream px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink transition-transform hover:-translate-y-0.5"
              >
                See the leaderboard
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
