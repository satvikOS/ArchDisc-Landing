import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import {
  ToolCallLedger,
  type ToolCall,
} from "@/components/artifacts/ToolCallLedger";

const VERIFY_CALLS: ToolCall[] = [
  { verb: "part.extrude", args: "distance=4", status: "ok" },
  { verb: "part.filletEdges", args: "ids=[inner], r=3", status: "healed" },
  { verb: "part.shell", args: "thickness=4", status: "ok" },
  { verb: "heal.checkValidity", args: "", status: "ok" },
];

export function Verify() {
  return (
    <Section id="verify">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="THE GUARANTEE"
              title="Every solid is verified before you see it."
              lead="Archie doesn't hand you raw output. A coherence gate runs checkValidity() on the topology and self-corrects if something's off — so what reaches you is a valid solid with an editable feature tree, not a script you have to debug."
            />
          </div>

          <div className="lg:col-span-7">
            <Reveal y={24}>
              <ToolCallLedger
                variant="compact"
                tone="light"
                trigger="view"
                prompt="Verify the bracket solid before it reaches the canvas."
                calls={VERIFY_CALLS}
                gateLabel="coherence gate · checkValidity() → valid"
                showTree
                className="w-full"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
