import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { ToolCallLedger, type ToolCall } from "@/components/artifacts/ToolCallLedger";

type FeatureRow = { label: string; body: string };

const ROWS: FeatureRow[] = [
  {
    label: "NAMED PARAMETERS",
    body: "Every value is a parameter you can read and change, not a magic number baked into a mesh.",
  },
  {
    label: "SCHEMA-VALIDATED",
    body: "Calls are checked against the kernel's tool-call contract before they run; malformed intent is caught, not crashed.",
  },
  {
    label: "ORDERED & INSPECTABLE",
    body: "You see the plan before anything is drawn, and the plan is the part's construction history.",
  },
];

const CALLS: ToolCall[] = [
  { verb: "sketch.rect", args: "width=100, height=40", status: "ok" },
  { verb: "part.extrude", args: "distance=4", status: "ok" },
  { verb: "part.holes", args: 'd=6, pitch=60, std="M6"', status: "ok" },
  { verb: "part.filletEdges", args: "ids=[inner], r=3", status: "ok" },
  { verb: "part.shell", args: "thickness=4", status: "ok" },
];

export function ToolCalls() {
  return (
    <Section id="tool-calls" className="relative isolate">
      <GenerativeGrid />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow="READABLE BY DESIGN"
              title="Structured calls, not throwaway script."
              lead="Most text-to-CAD tools hand you a wall of generated code and wish you luck. Archie emits structured, schema-validated tool-calls into the real kernel — named operations with named parameters, in the order the engine runs them. Every call conforms to a tool-call schema the kernel actually exposes, so it can't ask for an operation that doesn't exist."
            />

            <ul className="mt-10 flex flex-col">
              {ROWS.map((r, i) => (
                <Reveal key={r.label} delay={i * 0.08}>
                  <li className="flex flex-col gap-2 border-t border-line py-5 sm:flex-row sm:gap-6">
                    <span className="u-label shrink-0 pt-1 text-faint sm:w-44">
                      {r.label}
                    </span>
                    <p className="max-w-[46ch] text-body text-ink-soft">
                      {r.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              <Reveal delay={0.1} y={20}>
                <ToolCallLedger
                  variant="hero"
                  tone="light"
                  trigger="view"
                  prompt="A wall-mount bracket — 100 mm wide, two M6 holes, 4 mm wall."
                  calls={CALLS}
                  gateLabel="schema · valid"
                  showTree={false}
                  className="w-full"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
