import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { Plate } from "@/components/visual/Plate";

const TITLE = "Manifesto — make anything real";
const DESCRIPTION =
  "Engineering software has spent forty years asking people to translate themselves into menus. ArchDisc puts a real CAD kernel — solids, sketches, simulation, manufacturable drawings — behind plain language, running on your own machine. The tools were the barrier, not you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/manifesto" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/manifesto" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const BELIEFS = [
  "Plenty of people can picture the thing they want to build. Almost none of them have ten years of CAD to make it. That gap was never about talent. It was about software that made you learn it before it would let you build anything.",
  "So the machine should meet you where you actually think — in plain language — and hand back something real. Not a picture of the answer. A solid you could machine. A drawing a shop can hold. A scene you could ship.",
  "Real geometry has always been the hard part, and it has always lived behind a paywall and a manual. We put a genuine kernel underneath the words: OpenCASCADE solids, constrained sketches, real FEA, exports a fabricator trusts — STEP, IGES, DXF — driven by a sentence.",
  "It runs on your machine. The model is local, on Apple Silicon, and nothing you make leaves the room. Your design is yours before it's anyone else's, and it stays that way whether or not you're online.",
  "And it's free to use. We build and keep the technology honest; you make things with it. That's the whole arrangement, and it isn't going to change.",
];

const PRINCIPLES = [
  { t: "Real over rendered", b: "Geometry you can actually build — solids and drawings, not images of them." },
  { t: "Local over cloud", b: "It runs where your work lives. The model is on your machine; nothing leaves it." },
  { t: "Plain language over menus", b: "Describe it and the tools move. The menu was never the point." },
  { t: "Honest over impressive", b: "A kernel that doesn't lie beats a demo that does. We ship the thing, not the trick." },
  { t: "Free to use", b: "Make things with it. We keep the lights on and the geometry true." },
];

export default function ManifestoPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="atmos -z-10" aria-hidden />
        <Container className="relative pt-20 pb-16 md:pt-28 md:pb-20">
          <Reveal>
            <Chip tone="iris">Manifesto</Chip>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-7 max-w-[20ch] text-balance font-display text-display font-[700] leading-[0.96] tracking-[-0.03em] text-ink">
              The tools were the barrier.{" "}
              <span className="accent-serif text-[1.06em]">Not you.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-7 max-w-[56ch] text-pretty text-lead text-ink-soft">
              Real engineering — solids, sketches, simulation, and drawings a shop can build
              from — should belong to everyone who can picture it. Free to use, local to your
              machine, spoken in plain language. This is what we believe and why we&rsquo;re
              building it.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Beliefs ──────────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-2/50 py-24 md:py-32">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {BELIEFS.map((s, i) => (
              <Reveal key={i} delay={Math.min(i * 0.04, 0.16)}>
                <p
                  className={
                    i === 0
                      ? "text-balance font-display text-[clamp(1.6rem,1.1rem+2.2vw,2.6rem)] font-[700] leading-[1.12] tracking-[-0.025em] text-ink"
                      : "text-pretty text-lead text-ink-soft"
                  }
                >
                  {s}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Image band ───────────────────────────────────────── */}
      <section className="relative">
        <div className="relative h-[42vh] w-full overflow-hidden md:h-[54vh]">
          <div className="absolute inset-0">
            <Plate src="/img/cad-render.jpg" alt="" sizes="100vw" className="h-full w-full" />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(10,13,21,0.7), rgba(10,13,21,0.35) 50%, rgba(10,13,21,0.92))" }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1680px] px-5 pb-8 md:px-10">
              <p className="max-w-[24ch] text-balance font-display text-h2 font-[700] text-ink">
                Made to be <span className="accent-serif">built</span>, not just shown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <Container>
          <Reveal>
            <span className="u-label text-clay">What we hold to</span>
          </Reveal>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={Math.min(i * 0.05, 0.25)}>
                <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-10">
                  <div className="flex items-center gap-2.5 sm:w-[34%] sm:shrink-0">
                    <span className="h-2 w-2 rounded-full bg-clay" aria-hidden />
                    <h3 className="font-display text-h3 text-ink">{p.t}</h3>
                  </div>
                  <p className="text-pretty text-lead text-muted">{p.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="border-t border-line py-24 md:py-32">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft backdrop-blur-sm">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Coming soon
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-7 max-w-[18ch] text-balance font-display text-display font-[700] leading-[0.98] tracking-[-0.03em] text-ink">
              Soon, anyone can <span className="accent-serif">make</span> anything real.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
