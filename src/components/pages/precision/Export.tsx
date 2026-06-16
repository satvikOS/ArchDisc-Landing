import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { DimensionedDetail } from "@/components/artifacts/DimensionedDetail";

const FORMATS: { name: string; read: boolean; write: boolean }[] = [
  { name: "STEP", read: true, write: true },
  { name: "IGES", read: true, write: true },
  { name: "DXF", read: true, write: true },
  { name: "glTF", read: false, write: true },
  { name: "STL", read: false, write: true },
];

function Cell({ on }: { on: boolean }) {
  return (
    <span className={on ? "u-spec text-ink" : "u-spec text-faint"}>
      {on ? "✓" : "—"}
    </span>
  );
}

export function Export() {
  return (
    <Section id="export">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="THE EXPORT"
          title="Built to be made."
          lead="Native B-rep means the solid leaves cleanly. Read and write STEP, IGES, DXF, glTF, and STL — both directions, no lossy re-import — so your model opens in SolidWorks, NX, Creo, or Fusion and goes straight to a shop."
        />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* interop ledger */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-10 border-b border-line pb-3">
                <span className="u-label text-faint">format</span>
                <span className="u-label justify-self-end text-faint">in</span>
                <span className="u-label justify-self-end text-faint">out</span>
              </div>
            </Reveal>
            <div className="divide-y divide-line border-b border-line">
              {FORMATS.map((f, i) => (
                <Reveal key={f.name} delay={0.05 * i}>
                  <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-10 py-3.5">
                    <span className="u-spec text-ink">{f.name}</span>
                    <span className="justify-self-end">
                      <Cell on={f.read} />
                    </span>
                    <span className="justify-self-end">
                      <Cell on={f.write} />
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.28}>
              <p className="mt-6 text-pretty text-body text-ink-soft">
                Every operation Archie calls is a real kernel feature — editable,
                exportable, and built to be made.
              </p>
            </Reveal>
          </div>

          {/* GD&T fragment */}
          <div className="lg:col-span-5">
            <Reveal y={24}>
              <div className="relative aspect-square w-full rounded-[2px] border border-line-strong bg-surface p-6">
                <DimensionedDetail
                  variant="inline"
                  trigger="view"
                  showDims={false}
                  className="text-ink"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="u-spec mt-4 text-faint">
                feature-control frame + datum — real drawings, real tolerances,
                manufacturable.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
