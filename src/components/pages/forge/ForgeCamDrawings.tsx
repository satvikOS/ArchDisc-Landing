import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { DimensionedDetail } from "@/components/artifacts/DimensionedDetail";

const BLOCKS: { title: string; body: string; spec: string }[] = [
  {
    title: "Drawings + GD&T",
    body: "Generate sectioned views with hatching, dimension them, and stamp feature-control frames — datums, position, profile, tolerances — straight onto the geometry. The drawing updates when the model does.",
    spec: "witness lines · ⌖ position · datums A·B·C · ±0.1 · title block",
  },
  {
    title: "CAM",
    body: "Drive toolpaths off the solid you designed, in the same kernel — no lossy round-trip to a separate CAM package.",
    spec: "toolpaths from B-rep · same kernel · no re-import",
  },
];

export function ForgeCamDrawings() {
  return (
    <Section id="cam-drawings" className="border-y border-line bg-surface">
      <Container>
        <SectionHeader
          eyebrow="MANUFACTURING OUTPUT"
          title="The part leaves as something a shop can read."
          lead="A model that can't become a drawing or a toolpath is a render. Forge closes the loop: associative drawings with a title block, full GD&T, and CAM on the same B-rep solid."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* stacked feature blocks */}
          <div className="flex flex-col gap-8">
            {BLOCKS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="rounded-[2px] border border-line bg-paper p-6 md:p-7">
                  <h3 className="text-h3 font-display text-ink">{b.title}</h3>
                  <p className="mt-3 text-body leading-relaxed text-ink-soft">
                    {b.body}
                  </p>
                  <p className="u-spec mt-4 border-t border-line pt-3 text-muted">
                    {b.spec}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* GD&T detail — feature-control frame prominent */}
          <Reveal y={24} className="w-full">
            <div className="rounded-[2px] border border-line-strong bg-paper p-5 md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="u-label text-faint">section A–A</span>
                <span className="u-spec text-faint">GD&amp;T</span>
              </div>
              <div className="relative aspect-[6/5] w-full">
                <DimensionedDetail
                  variant="hero"
                  trigger="view"
                  showFCF
                  className="absolute inset-0 text-ink"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
