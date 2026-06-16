import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ToolCallLedger, type ToolCall } from "@/components/artifacts/ToolCallLedger";

const BUILD_CALLS: ToolCall[] = [
  { verb: "sketch.rect", args: "width=100, height=40", status: "ok" },
  { verb: "part.extrude", args: "distance=4", status: "ok" },
  { verb: "part.holes", args: 'd=6, pitch=60, std="M6"', status: "ok" },
  { verb: "part.filletEdges", args: "ids=[inner], r=3", status: "ok" },
  { verb: "part.shell", args: "thickness=4", status: "ok" },
  { verb: "heal.checkValidity", args: "", status: "ok" },
];

type Step = {
  n: string;
  label: string;
  body: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    label: "Describe",
    body: '"A wall-mount bracket, 100 mm wide, two M6 holes 60 mm apart, 4 mm wall, fillet the inside corners." Plain language — no menus, no parameters to hunt for.',
  },
  {
    n: "02",
    label: "Reason",
    body: "The local model resolves intent into named parameters and an ordered feature plan — structured tool-calls you can inspect before anything is drawn.",
  },
  {
    n: "03",
    label: "Build",
    body: "Archie emits the exact operations the kernel runs — readable, ordered, parametric.",
  },
  {
    n: "04",
    label: "Verify",
    body: "A coherence gate checks the solid — valid topology — and self-corrects if something is off before you ever see it. Then every value becomes editable: change the wall from 4 to 3 and the part re-solves locally. No second prompt.",
  },
];

function StepCard({ step, children }: { step: Step; children?: React.ReactNode }) {
  return (
    <div className="relative flex flex-col rounded-[2px] border border-line bg-surface p-7">
      <div className="flex items-baseline gap-3">
        <span className="u-stat text-[2rem] leading-none text-faint">{step.n}</span>
        <span className="u-label text-muted">{step.label}</span>
      </div>
      <p className="mt-4 text-body text-ink-soft">{step.body}</p>
      {children}
    </div>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="border-t border-line">
      <Container>
        <SectionHeader
          eyebrow="INTENT IN, GEOMETRY OUT"
          title="From a sentence to a solid in four moves."
          lead="No black box. Archie plans, then emits the exact parametric operations the kernel runs. You can read every call, edit any dimension, and the feature tree stays live."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Reveal delay={0}>
            <StepCard step={STEPS[0]} />
          </Reveal>
          <Reveal delay={0.06}>
            <StepCard step={STEPS[1]} />
          </Reveal>
          <Reveal delay={0.12}>
            <StepCard step={STEPS[2]}>
              <div className="mt-6">
                <ToolCallLedger
                  variant="compact"
                  tone="light"
                  trigger="view"
                  showTree={false}
                  prompt="Build the bracket."
                  calls={BUILD_CALLS}
                  gateLabel="checkValidity() → valid"
                  className="w-full"
                />
              </div>
            </StepCard>
          </Reveal>
          <Reveal delay={0.18}>
            <StepCard step={STEPS[3]} />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-3xl border-t border-line pt-6 text-lead text-muted">
            Other text-to-CAD tools hand you disposable script. Archie hands you an
            editable feature tree the kernel already validated — and the code that
            runs it is open.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
