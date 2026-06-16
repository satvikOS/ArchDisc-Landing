import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const CELLS: { label: string; body: string }[] = [
  {
    label: "Native CAD kernel",
    body: "OpenCASCADE 7.9.3, compiled from source. Real B-rep solids, no WASM in the geometry path.",
  },
  {
    label: "Local model fleet",
    body: "Archie runs on-device. Prompts and geometry never leave your machine.",
  },
  {
    label: "Open source",
    body: "Open code and open model weights. Read it, fork it, self-host the whole stack.",
  },
  {
    label: "Real scale",
    body: "Organized assemblies past 100,000 components, structured, not confetti.",
  },
  {
    label: "Real simulation",
    body: "Structural, modal, thermal, buckling, and fatigue FEA on the solids you design.",
  },
];

export function SubstanceStrip() {
  return (
    <section
      id="substance-strip"
      className="relative scroll-mt-24 border-y border-line bg-paper py-16 md:py-20"
    >
      <Container>
        <Reveal>
          <span className="u-label flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
            BUILT ON SUBSTANCE, NOT A DEMO
          </span>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border-y border-line sm:grid-cols-2 lg:grid-cols-5 lg:border-x">
          {CELLS.map((cell, i) => (
            <Reveal
              key={cell.label}
              delay={i * 0.06}
              className="bg-paper px-5 py-6 ring-1 ring-line"
            >
              <p className="u-label text-faint">{`0${i + 1}`}</p>
              <h3 className="mt-3 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-ink">
                {cell.label}
              </h3>
              <p className="mt-2 text-body-sm text-ink-soft">{cell.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="u-spec mt-8 text-faint">
            No cloud round-trips · no per-token bill · no data leaving the room.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
