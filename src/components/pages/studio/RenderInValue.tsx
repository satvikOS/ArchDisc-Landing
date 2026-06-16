import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { IsoContourBands } from "@/components/artifacts/IsoContourBands";

const BODY =
  "Studio's renderer is a GPU path tracer — true light transport, soft shadows, and global illumination, not a faked screen-space approximation. For look-dev and iteration there's a fast raster viewport; for the final frame, the path tracer takes over. On this site we render everything in greyscale on purpose — value, never color — because the geometry and the light are the point.";

const SPECS: { key: string; value: string }[] = [
  { key: "Renderer", value: "GPU path tracer" },
  { key: "Light", value: "global illumination" },
  { key: "Viewport", value: "interactive raster" },
  { key: "Output", value: "passes for comp" },
];

export function RenderInValue() {
  return (
    <Section id="render" className="border-t border-line">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
          {/* artifact — luminance / curvature field */}
          <Reveal y={24}>
            <div className="relative overflow-hidden rounded-[2px] border border-line-strong bg-surface">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="u-label text-faint">render · value field</span>
                <span className="u-spec text-faint">σ greyscale</span>
              </div>
              <div className="relative aspect-[4/3] w-full bg-paper">
                <IsoContourBands variant="plate" bands={7} seed={5} bumps={3} />
              </div>
            </div>
          </Reveal>

          {/* copy + spec table */}
          <div>
            <Reveal>
              <span className="u-label inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
                GPU PATH TRACER
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h2 font-display text-ink">
                Real light, rendered in value
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-pretty text-body text-muted">{BODY}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[2px] border border-line bg-line">
                {SPECS.map((s) => (
                  <div key={s.key} className="bg-surface px-4 py-3.5">
                    <dt className="u-label text-faint">{s.key}</dt>
                    <dd className="mt-1.5 u-spec text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 u-spec text-faint">
                same monochrome instrument as the FEA plot on /precision — one
                machine, two sides.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
