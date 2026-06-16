import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { StressFieldHalftone } from "@/components/artifacts/StressFieldHalftone";

const ANALYSES: { tag: string; body: string }[] = [
  { tag: "Linear-static", body: "Stress and deflection under load, with contact between parts." },
  { tag: "Modal", body: "Natural frequencies and mode shapes — find resonance before the shop does." },
  { tag: "Thermal", body: "Steady-state heat and the temperature field across the part." },
  { tag: "Buckling", body: "Critical load and buckling modes for slender members." },
  { tag: "Fatigue", body: "Cycle life under repeated loading." },
];

export function ForgeSimulation() {
  return (
    <Section id="simulation" className="relative">
      <Container>
        <SectionHeader
          eyebrow="SIMULATION"
          title="Real FEA, on the geometry you designed."
          lead="No export, no second tool. Forge runs finite-element analysis directly on the solids you build — and Archie can read the result and propose a fix."
        />

        {/* FEA type chip row */}
        <Reveal delay={0.08}>
          <ul className="mt-9 flex flex-wrap gap-2">
            {ANALYSES.map((a) => (
              <li
                key={a.tag}
                className="u-label rounded-[2px] border border-line bg-surface px-3 py-2 text-ink-soft"
              >
                {a.tag}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-14">
          {/* von-Mises halftone plot */}
          <Reveal y={24} className="w-full">
            <div className="rounded-[2px] border border-line-strong bg-surface p-5 md:p-6">
              <div className="relative aspect-square w-full">
                <StressFieldHalftone className="absolute inset-0 h-full w-full" />
              </div>
            </div>
          </Reveal>

          {/* analysis descriptions + closing */}
          <div>
            <div className="flex flex-col">
              {ANALYSES.map((a, i) => (
                <Reveal key={a.tag} delay={i * 0.05}>
                  <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-t border-line py-3.5 last:border-b">
                    <span className="u-label text-ink">{a.tag}</span>
                    <span className="text-body-sm leading-relaxed text-ink-soft">
                      {a.body}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <p className="u-spec mt-6 text-faint">
                σ_vM · MIN → MAX · rendered as dot density, never color
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-body leading-relaxed text-ink-soft">
                Build a part, load it, read the stress field, change a
                dimension, re-solve — the same loop a real analyst runs, with
                Archie in the seat next to you.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
