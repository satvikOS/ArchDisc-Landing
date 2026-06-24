import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { BigWord } from "@/components/fx/BigWord";
import { LockedProbe } from "@/components/common/LockedProbe";
import { Admission } from "@/components/common/Admission";

const TITLE = "Precision — why a sentence becomes a solid you can trust";
const DESCRIPTION =
  "ArchDisc doesn't draw pictures of parts. Archie calls real geometry-kernel operations, the kernel validates every result, and you keep an editable history — deterministic, local, made to be made.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/precision" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/precision" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const PILLARS = [
  { t: "Real operations, not pixels", b: "Every move Archie makes is a typed call into the geometry kernel — extrude, fillet, shell, sweep — the same operations a person would reach for." },
  { t: "Valid, or it says so", b: "The kernel heals and checks each result. A solid is either watertight and buildable, or Forge tells you why it isn't. No quiet lies." },
  { t: "An editable history", b: "You don't get a frozen mesh. You get a tree of parametric steps you can reopen, retime, and change." },
  { t: "Constraints that solve", b: "Sketches are dimensioned and constrained — and they solve, the way the constraint engines in professional CAD do." },
  { t: "Deterministic and local", b: "It runs on your machine. The same description and the same model hand you back the same part." },
  { t: "Made to be made", b: "Output speaks STEP, IGES and DXF, carries tolerances, and is meant to reach a machine — not just a screen." },
];

export default function PrecisionPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <BigWord variant="ghost" className="absolute -top-2 left-1/2 -translate-x-1/2 text-[clamp(4rem,18vw,16rem)]">
          Precision
        </BigWord>
        <Container className="relative max-w-3xl">
          <Reveal>
            <Chip tone="iris">The accuracy thesis</Chip>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-[20ch] text-balance text-display font-display font-semibold leading-[0.96] text-ink">
              Why a sentence becomes a solid you can{" "}
              <span className="iris-text iris-text-anim">stand behind</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[58ch] text-pretty text-lead text-muted">
              Most &ldquo;AI 3D&rdquo; gives you a picture that falls apart the moment you
              try to build it. ArchDisc works the other way around: Archie operates a real
              geometry kernel, and the kernel keeps everyone honest.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden border-y border-line bg-paper-2/40 py-24 md:py-32">
        <Container className="relative">
          <Reveal>
            <span className="u-label text-faint">Six reasons it holds up</span>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} delay={Math.min(i * 0.05, 0.25)}>
                <div className="border-t border-line pt-5">
                  <div className="flex items-center gap-2.5">
                    <span className="iris-fill h-2 w-2 rounded-full" aria-hidden />
                    <h3 className="font-display text-h4 text-ink">{p.t}</h3>
                  </div>
                  <p className="mt-3 text-pretty text-body-sm text-muted">{p.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <Container className="relative grid items-center gap-12 lg:grid-cols-[42fr_58fr]">
          <div>
            <Reveal>
              <span className="u-label text-faint">From a sentence to a solid</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h2 text-ink">
                Watch the tool-calls. They&rsquo;re the real thing.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[44ch] text-pretty text-lead text-muted">
                Each line is an operation Archie actually performs on the kernel — and the
                last one is the kernel confirming the result is valid. Type your own and
                follow the trace.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={24}>
            <LockedProbe />
          </Reveal>
        </Container>
      </section>

      <Admission
        eyebrow="Admission"
        headline="See it hold up for yourself."
        sub="Clearance opens the real thing — kernel, history and all — on your own machine. Be first in."
      />
    </>
  );
}
