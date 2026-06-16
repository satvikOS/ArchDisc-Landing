import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { DimensionedDetail } from "@/components/artifacts/DimensionedDetail";

const FEATURES: { title: string; body: string }[] = [
  {
    title: "True B-rep solids",
    body: "Boundary-representation geometry with exact topology — faces, edges, vertices, and the relationships between them. Not meshes pretending to be solids.",
  },
  {
    title: "NURBS surfacing",
    body: "Sweeps, lofts, drafts, and variable-radius fillets on real surfaces, so curvature stays exact under edits.",
  },
  {
    title: "Boolean reliability",
    body: "Cuts, unions, and intersections resolved by a production kernel that ships in real engineering software.",
  },
  {
    title: "Validated output",
    body: "Every solid Archie produces passes a coherence gate — checkValidity() → valid — that verifies and repairs topology before you see it.",
  },
];

export function ForgeKernel() {
  return (
    <Section id="kernel" className="relative isolate">
      <GenerativeGrid majorPitch={120} fade={66} />
      <Container>
        <SectionHeader
          eyebrow="THE KERNEL"
          title="A native B-rep kernel, compiled from source."
          lead="Most browser CAD tools run a kernel through a WASM shim and pay for it in precision and speed. Forge links OpenCASCADE 7.9.3 directly as a native Node addon — the geometry path is C++ all the way down."
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-14">
          {/* sectioned counterbore detail */}
          <Reveal y={24} className="lg:sticky lg:top-28">
            <div className="rounded-[2px] border border-line-strong bg-surface p-5 md:p-6">
              <div className="relative aspect-[6/5] w-full">
                <DimensionedDetail
                  variant="hero"
                  trigger="view"
                  className="absolute inset-0 text-ink"
                />
              </div>
            </div>
          </Reveal>

          {/* feature grid + spec strip */}
          <div>
            <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.06}>
                  <div className="flex h-full flex-col bg-paper p-6">
                    <h3 className="text-h4 font-mono font-medium text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-2.5 text-body-sm leading-relaxed text-ink-soft">
                      {f.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <p className="u-spec mt-6 rounded-[2px] border border-line bg-surface px-4 py-3 text-ink-soft">
                forge-kernel.node · native C++ · OCCT 7.9.3 · no WASM
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 text-body-sm text-muted">
                The kernel binding is open — read exactly how every operation
                reaches OCCT.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
