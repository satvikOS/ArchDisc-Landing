import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion, type FaqItem } from "./FaqAccordion";

const SPEC_ROWS: { k: string; v: string }[] = [
  { k: "Runs on", v: "Native Apple Silicon app. Windows in progress." },
  { k: "Kernel", v: "OpenCASCADE 7.9.3, from source, no WASM." },
  { k: "Solids", v: "B-rep, NURBS, sweeps, lofts, drafts, variable fillets." },
  { k: "Assemblies", v: "To 100,000 components, real mates, live spatial queries." },
  { k: "Simulation", v: "Linear-static, modal, thermal, buckling, fatigue, with contact." },
  { k: "Sketching", v: "planegcs constraint solver, full DOF tracking." },
  { k: "Interop", v: "STEP, IGES, DXF, glTF, STL — in and out." },
  { k: "AI", v: "Local DeepSeek-R1-distilled fleet, per-discipline fine-tunes, structured tool-calls." },
  { k: "Source", v: "Open code + open model weights, self-hostable." },
  { k: "Privacy", v: "On-device inference, no telemetry of your geometry." },
  { k: "Cost", v: "Open source, free forever; public release soon." },
];

const FAQ: FaqItem[] = [
  {
    q: "Is it really open source?",
    a: "Yes — open code and open model weights. You can read the kernel bindings and tool-call schema, and run the Archie fleet on your own hardware. ArchDisc is in pre-release; a public release is coming soon.",
  },
  {
    q: "Is this just text-to-CAD that spits out a script?",
    a: "No. Archie emits structured tool-calls into a real B-rep kernel and returns an editable feature tree — then verifies the solid before handing it back. You get geometry you can edit, simulate, and export, not disposable code.",
  },
  {
    q: "Will my models open in SolidWorks, NX, Creo, or Fusion?",
    a: "Yes. ArchDisc reads and writes native STEP, IGES, and DXF, so the model moves both directions without a lossy re-import.",
  },
  {
    q: "Do my designs or prompts leave my machine?",
    a: "No. The model fleet runs locally. Your geometry and your words stay on your hardware — private by default, and fast because there's no round-trip.",
  },
  {
    q: "Do I still have full manual control?",
    a: "Yes. Archie is a copilot, not a wall. Every operation lands in the normal feature tree and toolbars — drive it by hand any time.",
  },
  {
    q: "Is the simulation real or an estimate?",
    a: "Real FEA on real meshes — linear-static, modal, thermal, buckling, and fatigue, with contact. Archie can simulate a part and propose a fix from the result.",
  },
];

export function SpecsFaq() {
  return (
    <Section id="specs-faq" className="border-t border-line">
      <Container>
        <SectionHeader
          eyebrow="FOR PEOPLE WHO READ THE SPEC SHEET"
          title="The questions a serious team asks."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* spec table */}
          <Reveal>
            <dl className="border-t border-line">
              {SPEC_ROWS.map((row) => (
                <div
                  key={row.k}
                  className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-[140px_1fr] sm:gap-4"
                >
                  <dt className="u-label pt-0.5 text-muted">{row.k}</dt>
                  <dd className="text-body-sm text-ink-soft">{row.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* accordion FAQ */}
          <Reveal delay={0.08}>
            <FaqAccordion items={FAQ} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
