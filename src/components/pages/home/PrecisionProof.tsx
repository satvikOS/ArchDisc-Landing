import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StressFieldHalftone } from "@/components/artifacts/StressFieldHalftone";

type Proof = { stat: string; label: string; body: string };

const PROOFS: Proof[] = [
  {
    stat: "7.9.3",
    label: "OpenCASCADE, from source",
    body: "A native C++ B-rep kernel, no WASM shim. True solids, NURBS surfacing, sweeps, lofts, drafts, variable fillets — exportable to STEP and sent to a shop.",
  },
  {
    stat: "100,000",
    label: "Components per assembly",
    body: "Organized industrial assemblies — racks, machine rows, tank farms — packed into structure with real mates and live spatial queries.",
  },
  {
    stat: "0",
    label: "Cloud round-trips",
    body: "A local DeepSeek-R1-distilled fleet, fine-tuned per discipline, served on your machine. No API keys, no per-token bill, private and fast.",
  },
  {
    stat: "REAL",
    label: "Simulation on the same solids",
    body: "Linear-static, modal, thermal, buckling, and fatigue FEA, with contact — on the geometry you designed.",
  },
];

export function PrecisionProof() {
  return (
    <Section id="precision-proof" className="border-t border-line">
      <Container>
        <SectionHeader
          eyebrow="WHY YOU CAN TRUST THE GEOMETRY"
          title="AI-native doesn't mean approximate."
          lead="The magic is the copilot. The substance underneath is a real engineering stack — the same class of kernel and math production CAD runs on."
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_440px] lg:gap-16">
          {/* stat grid */}
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-line sm:grid-cols-2">
            {PROOFS.map((p, i) => (
              <Reveal
                key={p.label}
                delay={i * 0.06}
                className="bg-surface px-6 py-7 ring-1 ring-line"
              >
                <p className="u-stat text-ink">{p.stat}</p>
                <p className="u-label mt-3 text-muted">{p.label}</p>
                <p className="mt-3 text-body-sm text-ink-soft">{p.body}</p>
              </Reveal>
            ))}
          </div>

          {/* stress halftone tile */}
          <Reveal delay={0.1}>
            <div className="rounded-[2px] border border-line-strong bg-surface">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="u-label">fea · von mises</span>
                <span className="u-label text-faint">value, not color</span>
              </div>
              <div className="relative aspect-[5/4] w-full">
                <StressFieldHalftone className="absolute inset-0 h-full w-full text-ink" />
              </div>
            </div>
            <Link
              href="/precision"
              className="group mt-6 inline-flex items-center gap-1.5 font-mono text-[12px] font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              See the engineering substance
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
