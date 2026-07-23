import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function Closing() {
  return (
    <section className="relative isolate flex min-h-[82vh] items-center overflow-hidden py-28">
      <div className="atmos -z-20 opacity-70" aria-hidden />
      <div
        className="stage-ring pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="eyebrow justify-center">The beginning</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-8 font-display text-mega text-ink text-balance">
            Creative AI for the{" "}
            <span className="accent-serif glow-accent text-[1.04em]">physical</span> world.
          </h2>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mx-auto mt-8 max-w-[44ch] text-lead text-ink-soft text-pretty">
            Describe it. Archie builds it. If you can dream it and dare to make it, you can
            make real things — in a sentence.
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href="https://app.archdisc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="a-focus group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-6 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-clay/50 hover:text-clay"
            >
              Enter ArchDisc
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Public release soon · free · local · private
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
