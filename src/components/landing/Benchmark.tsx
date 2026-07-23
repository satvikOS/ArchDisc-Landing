import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Concentric, Checker } from "@/components/decor/Stickers";

const HF = "https://huggingface.co/spaces/HuggingAI4Engineering/CADGenBench";

export function Benchmark() {
  return (
    <section id="benchmark" className="relative overflow-hidden border-y-[2.5px] border-ink bg-peach py-20 md:py-28">
      <Parallax y={40} className="pointer-events-none absolute -left-12 top-8 hidden md:block">
        <Concentric className="h-36 w-36 text-brown" />
      </Parallax>
      <Checker n={4} a="var(--color-ink)" className="pointer-events-none absolute right-1/4 bottom-6 hidden h-14 w-14 -rotate-6 md:block" aria-hidden />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 md:px-8">
        <Reveal>
          <span className="inline-flex items-center border-[2.5px] border-ink bg-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
            Benchmarked · not vibes
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border-[2.5px] border-ink nb-shadow-lg md:grid-cols-[minmax(220px,auto)_1fr_auto]">
            {/* big number specimen */}
            <div className="flex flex-col justify-center border-b-[2.5px] border-ink bg-olive p-8 text-ink md:border-b-0 md:border-r-[2.5px]">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">CADGenBench</span>
              <span className="specimen mt-1 text-[clamp(4.5rem,12vw,8.5rem)]">#2</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">overall leaderboard</span>
            </div>

            {/* claim */}
            <div className="flex flex-col justify-center bg-cream p-8 md:p-10">
              <p className="font-display text-[clamp(1.6rem,1rem+2.4vw,2.8rem)] font-extrabold leading-[0.95] text-ink">
                <span className="mr-1 inline-block -rotate-2 rounded-xl border-[3px] border-ink bg-lime px-2 nb-shadow-sm">#1</span>{" "}
                among local models.
              </p>
              <p className="mt-4 max-w-[40ch] font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-ink-mute">
                Near-frontier accuracy — running on your own machine.
              </p>
            </div>

            {/* link */}
            <div className="flex items-center justify-center border-t-[2.5px] border-ink bg-peri p-8 md:border-l-[2.5px] md:border-t-0">
              <a
                href={HF}
                target="_blank"
                rel="noopener noreferrer"
                className="a-focus nb-card nb-hover inline-flex items-center gap-2 bg-cream px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
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
