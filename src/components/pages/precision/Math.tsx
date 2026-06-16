import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { IsoContourBands } from "@/components/artifacts/IsoContourBands";
import { StressFieldHalftone } from "@/components/artifacts/StressFieldHalftone";

const FEA_SET: { label: string; gloss: string }[] = [
  { label: "LINEAR-STATIC", gloss: "Stress and deflection under steady load." },
  { label: "MODAL", gloss: "Natural frequencies and mode shapes." },
  { label: "THERMAL", gloss: "Steady-state heat and gradients." },
  { label: "BUCKLING", gloss: "Critical loads and instability modes." },
  { label: "FATIGUE", gloss: "Cyclic life against the stress history." },
];

export function Math() {
  return (
    <Section
      id="math"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      <GenerativeGrid dark majorPitch={136} />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionHeader
              dark
              eyebrow="THE MATH"
              title="Real math, shown as value — never color."
              lead="Linear-static, modal, thermal, buckling, and fatigue analysis — with contact — run on the exact solids you design. We render results as greyscale density and contour, never a marketing rainbow, because a real plot doesn't need one. Archie can build a part, simulate it, read the result, and propose a fix."
            />
          </div>

          {/* iso-contour plate + halftone legend reprise */}
          <div className="lg:col-span-6">
            <Reveal y={24}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-white/12 bg-white/[0.02]">
                <IsoContourBands
                  variant="plate"
                  inverted
                  bands={7}
                  bumps={3}
                  seed={19}
                  className="h-full w-full"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative h-12 w-40 shrink-0">
                  <StressFieldHalftone
                    dark
                    showAnnotations={false}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <p className="u-spec text-white/55">
                  greyscale density · iso-bands + contour lines · value, not hue
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 5-up FEA instrument row */}
        <div className="mt-16 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5">
          {FEA_SET.map((item, i) => (
            <Reveal key={item.label} delay={0.05 * i}>
              <div className="px-0 py-6 sm:px-6 sm:py-7 lg:border-l lg:border-white/10 lg:first:border-l-0">
                <p className="u-label text-white/55">{item.label}</p>
                <p className="mt-3 text-body-sm text-white/65">{item.gloss}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-pretty text-lead text-white/80">
            Same solids in, real fields out. No false color, no estimate.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
