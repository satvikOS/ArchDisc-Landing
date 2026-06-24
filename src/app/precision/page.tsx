import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Plate } from "@/components/visual/Plate";

const TITLE = "Precision — why a sentence becomes a solid you can trust";
const DESCRIPTION =
  "ArchDisc doesn't draw pictures of parts. Archie calls real geometry-kernel operations, the kernel validates every result, and you keep an editable history — deterministic, local, made to be made. Coming soon.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/precision" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/precision" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const PILLARS = [
  {
    t: "Real operations, not pixels",
    b: "Every move Archie makes is a typed call into the geometry kernel — extrude, fillet, shell, sweep — the same operations a person would reach for in professional CAD.",
  },
  {
    t: "Valid, or it says so",
    b: "The OpenCASCADE kernel heals and checks each result. A solid is either watertight and buildable, or Forge tells you why it isn't. No quiet lies.",
  },
  {
    t: "An editable history",
    b: "You don't get a frozen mesh. You get a tree of parametric steps you can reopen, retime, and change — feature by feature.",
  },
  {
    t: "Constraints that solve",
    b: "Sketches are dimensioned and constrained, and they solve through planegcs — the way the constraint engines in real CAD do.",
  },
  {
    t: "Deterministic and local",
    b: "It runs on your own machine, on Apple Silicon. The same description and the same model hand you back the same part.",
  },
  {
    t: "Made to be made",
    b: "Output speaks STEP, IGES and DXF, carries tolerances, and is meant to reach a machine — not just a screen.",
  },
];

export default function PrecisionPage() {
  return (
    <div className="grade-cyan">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="atmos -z-10" aria-hidden />
        <Container className="relative max-w-4xl">
          <Reveal>
            <span className="u-label text-clay">The accuracy thesis</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-[20ch] text-balance font-display text-display font-[700] leading-[0.96] tracking-[-0.03em] text-ink">
              Why a sentence becomes a solid you can{" "}
              <span className="accent-serif">trust</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[58ch] text-pretty text-lead text-ink-soft">
              Most &ldquo;AI 3D&rdquo; hands you a picture that falls apart the moment you
              try to build it. ArchDisc works the other way around: Archie operates a real
              geometry kernel, and the kernel keeps everyone honest.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Six pillars ──────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-line bg-paper-2/40 py-24 md:py-32">
        <Container className="relative max-w-6xl">
          <Reveal>
            <span className="u-label text-faint">Six reasons it holds up</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 max-w-[22ch] text-balance text-h2 text-ink">
              Accuracy isn&rsquo;t a setting. It&rsquo;s how the whole thing is{" "}
              <span className="accent-serif">built</span>.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} delay={Math.min(i * 0.05, 0.25)}>
                <div className="border-t border-line pt-5">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-clay" aria-hidden />
                    <h3 className="font-display text-h4 text-ink">{p.t}</h3>
                  </div>
                  <p className="mt-3 text-pretty text-body-sm text-muted">{p.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Image band ───────────────────────────────────────── */}
      <section className="relative">
        <div className="relative h-[44vh] w-full overflow-hidden md:h-[56vh]">
          <div className="absolute inset-0">
            <Plate
              src="/img/cad-blueprint.jpg"
              alt="A dimensioned mechanical drawing — the sheet a machine shop builds from."
              sizes="100vw"
              className="h-full w-full"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,13,21,0.72), rgba(10,13,21,0.35) 50%, rgba(10,13,21,0.94))",
            }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1680px] px-5 pb-9 md:px-10">
              <Reveal>
                <span className="u-label text-clay-soft">From a sentence to a solid</span>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mt-3 max-w-[24ch] text-balance font-display text-h2 font-[700] text-ink">
                  Every line is a real operation, and the kernel{" "}
                  <span className="accent-serif">confirms</span> it.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
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
            <p className="mt-6 max-w-[20ch] text-balance font-display text-display font-[700] leading-[0.98] tracking-[-0.03em] text-ink">
              Geometry you can <span className="accent-serif">stand</span> behind.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[52ch] text-pretty text-lead text-muted">
              A real kernel, an editable history, and output meant to reach a machine —
              running locally, on your own hardware. Almost here.
            </p>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
