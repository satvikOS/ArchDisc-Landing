import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { DimensionedDetail } from "@/components/artifacts/DimensionedDetail";

const KERNEL_SPECS: { key: string; value: string }[] = [
  { key: "kernel", value: "OpenCASCADE 7.9.3" },
  { key: "binding", value: "forge-kernel.node (native Node-API)" },
  { key: "geometry", value: "B-rep solids + NURBS surfaces" },
  { key: "features", value: "sweeps · lofts · drafts · variable fillets" },
  { key: "sketcher", value: "planegcs constraint solver" },
  { key: "dof", value: "live degree-of-freedom tracking" },
  { key: "wasm", value: "none, in the geometry path" },
];

export function Kernel() {
  return (
    <Section id="kernel" className="relative isolate overflow-hidden">
      <GenerativeGrid majorPitch={128} />
      <Container className="relative">
        <SectionHeader
          eyebrow="THE KERNEL"
          title="A real kernel, compiled from source."
          lead="ArchDisc geometry lives in forge-kernel.node — OpenCASCADE 7.9.3 built natively in C++, with no WASM in the geometry path and no browser sandbox tax. The same class of B-rep kernel production CAD runs on."
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* spec ledger */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="u-label mb-4 text-faint">kernel capabilities</p>
            </Reveal>
            <dl className="divide-y divide-line border-y border-line">
              {KERNEL_SPECS.map((row, i) => (
                <Reveal key={row.key} delay={0.04 * i}>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="u-spec shrink-0 text-muted">{row.key}</dt>
                    <dd className="u-spec text-right text-ink">{row.value}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={0.32}>
              <p className="u-spec mt-6 text-muted">
                A native, from-source OCCT 7.9.3 build — the same kernel binding
                runs in every ArchDisc app, free to use on your machine.
              </p>
            </Reveal>
          </div>

          {/* dimensioned section detail */}
          <div className="lg:col-span-7">
            <Reveal y={24}>
              <div className="relative aspect-[6/5] w-full rounded-[2px] border border-line-strong bg-surface p-6">
                <DimensionedDetail
                  variant="hero"
                  trigger="view"
                  className="text-ink"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="u-spec mt-4 text-faint">
                section A–A · counterbored, filleted hole · real Ø / R / ± and a
                GD&amp;T feature-control frame, drawn by the kernel — not faked.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
