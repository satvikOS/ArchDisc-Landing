import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

const FORMATS: { fmt: string; in: boolean; out: boolean; note: string }[] = [
  { fmt: "STEP", in: true, out: true, note: "solids" },
  { fmt: "IGES", in: true, out: true, note: "surfaces" },
  { fmt: "DXF", in: true, out: true, note: "2D / drawings" },
  { fmt: "glTF", in: true, out: true, note: "web / viz" },
  { fmt: "STL", in: true, out: true, note: "mesh / print" },
];

export function ForgeInterop() {
  return (
    <Section id="interop" className="relative">
      <Container>
        <SectionHeader
          eyebrow="INTEROP"
          title="It moves both ways, losslessly."
          lead="Native STEP and IGES read and write means your model opens in SolidWorks, NX, Creo, and Fusion — and theirs opens in Forge — without a lossy re-import."
        />

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-[2px] border border-line-strong bg-surface">
            {/* header row */}
            <div className="grid grid-cols-[1.4fr_0.6fr_0.6fr_1.6fr] items-center gap-4 border-b border-line-strong bg-paper px-5 py-3">
              <span className="u-label text-faint">format</span>
              <span className="u-label text-center text-faint">in</span>
              <span className="u-label text-center text-faint">out</span>
              <span className="u-label text-faint">use</span>
            </div>

            {FORMATS.map((f) => (
              <div
                key={f.fmt}
                className="grid grid-cols-[1.4fr_0.6fr_0.6fr_1.6fr] items-center gap-4 border-b border-line px-5 py-4 last:border-b-0"
              >
                <span className="u-spec text-ink">{f.fmt}</span>
                <span className="text-center font-mono text-[13px] text-ink">
                  {f.in ? "✓" : "—"}
                </span>
                <span className="text-center font-mono text-[13px] text-ink">
                  {f.out ? "✓" : "—"}
                </span>
                <span className="u-spec text-muted">{f.note}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-8 max-w-2xl text-body leading-relaxed text-ink-soft">
            Because the geometry is real B-rep, a STEP export is a true solid a
            machinist can program against — not a tessellated approximation.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="u-spec mt-4 text-faint">
            In and out · no lossy bridge · your model is portable, not trapped.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
