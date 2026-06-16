import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { DimensionedDetail } from "@/components/artifacts/DimensionedDetail";

export function CoherenceGate() {
  return (
    <Section id="coherence-gate" className="relative isolate">
      <GenerativeGrid />
      <Container className="relative">
        <SectionHeader
          align="center"
          eyebrow="THE COHERENCE GATE"
          title="A gate that repairs the solid before you see it."
          lead="A plausible-looking model can still be a broken solid — non-manifold edges, self-intersections, a shell that didn't close. Archie doesn't hand you the first thing it generates. Every result passes a coherence gate that runs checkValidity() against the kernel, and when something is off, the gate repairs it and re-checks — before the geometry ever reaches your viewport."
          className="mx-auto max-w-[46ch]"
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal y={20}>
              <div className="relative overflow-hidden rounded-[2px] border border-line-strong bg-surface p-6 md:p-8">
                <DimensionedDetail
                  variant="hero"
                  trigger="view"
                  className="mx-auto h-auto w-full max-w-xl text-ink"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} y={20}>
              <GateLedger />
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.05}>
          <div className="mx-auto mt-16 max-w-3xl border-t border-line pt-10">
            <p className="text-balance text-h3 font-display text-ink">
              Other tools verify nothing and ship you the failure. Archie ships
              you a solid the kernel already agreed is valid.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* A compact instrument readout of the gate: an invalid first pass, struck
   through, then the repair → re-check resolving to a ✓ valid topology stamp. */
function GateLedger() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-[2px] border border-line bg-surface"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="u-label text-faint">coherence gate</span>
        <span className="u-label text-faint">heal()</span>
      </div>

      <div className="flex flex-col p-4">
        <div className="flex items-baseline gap-3 border-b border-line py-2.5">
          <span className="shrink-0 font-mono text-[10px] text-faint">→</span>
          <span className="min-w-0 flex-1 font-mono text-[12px] text-muted line-through decoration-faint">
            heal.checkValidity() → invalid · non-manifold edge
          </span>
          <span className="shrink-0 font-mono text-[11px] text-faint">×</span>
        </div>

        <div className="flex items-baseline gap-3 border-b border-line py-2.5">
          <span className="shrink-0 font-mono text-[10px] text-faint">→</span>
          <span className="min-w-0 flex-1 font-mono text-[12px]">
            <span className="font-medium text-ink">heal.repair</span>
            <span className="text-faint">(</span>
            <span className="text-muted">edges=[non-manifold]</span>
            <span className="text-faint">)</span>
          </span>
          <span className="shrink-0 font-mono text-[11px] text-faint">± healed</span>
        </div>

        <div className="flex items-baseline gap-3 py-2.5">
          <span className="shrink-0 font-mono text-[10px] text-faint">→</span>
          <span className="min-w-0 flex-1 font-mono text-[12px]">
            <span className="font-medium text-ink">heal.checkValidity</span>
            <span className="text-faint">()</span>
          </span>
          <span className="shrink-0 font-mono text-[11px] text-ink">✓ valid</span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-[2px] border border-line px-3.5 py-3">
          <span className="font-mono text-[12px] text-ink">✓</span>
          <p className="font-mono text-[12px] leading-tight text-ink">
            valid topology · solid released to viewport
          </p>
        </div>
      </div>
    </div>
  );
}
