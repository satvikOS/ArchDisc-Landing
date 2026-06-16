import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ToolCallLedger, type ToolCall } from "@/components/artifacts/ToolCallLedger";
import { ConstraintSolverBench } from "@/components/instrument/ConstraintSolverBench";

const PROOF: { label: string; body: string }[] = [
  {
    label: "DOF readout",
    body: "A live degrees-of-freedom counter — under-, fully-, or over-constrained, never a guess.",
  },
  {
    label: "Geometric + dimensional",
    body: "Coincident, tangent, parallel, equal, symmetric, plus driven and reference dimensions.",
  },
  {
    label: "Archie speaks constraints",
    body: 'Ask for "two M6 holes 60 mm apart, symmetric about the centerline" and Archie emits the constrained sketch — fully defined, editable by hand after.',
  },
];

const SKETCH_CALLS: ToolCall[] = [
  { verb: "sketch.rect", args: "width=100, height=40", status: "ok" },
  { verb: "sketch.constrain.symmetric", args: "holeA, holeB, axis=Y", status: "ok" },
  { verb: "sketch.dim", args: "holeA, holeB, value=60", status: "ok" },
  { verb: "sketch.dof", args: "", status: "ok" },
];

export function ForgeSketcher() {
  return (
    <Section id="sketcher" className="relative">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* heading + deck + proof rows */}
          <div>
            <SectionHeader
              eyebrow="PARAMETRIC SKETCHING"
              title="Constraints that actually solve."
              lead="Forge sketches on the planegcs constraint solver — the same class of solver that drives professional parametric CAD. Add coincidence, tangency, equal, parallel, and dimensional constraints; the solver tracks degrees of freedom in real time and tells you exactly when a sketch is fully defined."
            />

            <div className="mt-10 flex flex-col">
              {PROOF.map((p, i) => (
                <Reveal key={p.label} delay={i * 0.06}>
                  <div className="border-t border-line py-5 last:border-b">
                    <p className="u-label text-ink">{p.label}</p>
                    <p className="mt-2 text-body leading-relaxed text-ink-soft">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* DOF console + tool-call ledger */}
          <Reveal y={24} className="lg:pt-2">
            <div className="rounded-[2px] border border-line-strong bg-surface p-5 md:p-6">
              {/* interactive constraint-solver bench — drag the corner to DOF 0 */}
              <div className="relative aspect-[360/280] w-full overflow-hidden rounded-[2px] border border-line bg-paper text-ink">
                <ConstraintSolverBench className="h-full w-full" />
              </div>

              {/* operator hint — degrades silently on touch / reduced motion */}
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                <span aria-hidden>drag the corner handle</span>
                <span className="sr-only">
                  Focus the corner handle and use arrow keys to move it; Enter
                  fully constrains the sketch.
                </span>{" "}
                — watch the degrees of freedom fall to zero.
              </p>

              {/* validated tool-call stream */}
              <ToolCallLedger
                variant="compact"
                tone="light"
                trigger="view"
                showTree={false}
                prompt='Two M6 holes 60 mm apart, symmetric about the centerline.'
                calls={SKETCH_CALLS}
                gateLabel="sketch.dof() → 0 · fully constrained"
                className="mt-4 w-full"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
