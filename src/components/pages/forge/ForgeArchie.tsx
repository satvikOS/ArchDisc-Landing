import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ParametricRevolveLathe } from "@/components/artifacts/ParametricRevolveLathe";

const ROWS: { label: string; body: string }[] = [
  {
    label: "Reads like code, edits like CAD",
    body: "Every operation Archie calls lands in the normal feature tree. Change the wall from 4 mm to 3 mm and the part re-solves locally — no second prompt.",
  },
  {
    label: "Coherence gate",
    body: "A validation pass verifies and repairs each solid before it reaches you — checkValidity() → valid.",
  },
  {
    label: "Fully local, fully open",
    body: "A DeepSeek-R1-distilled per-discipline model fleet runs on your machine. No cloud, no API keys, no per-token bill — and the weights are open. Your geometry never leaves the room.",
  },
];

export function ForgeArchie() {
  return (
    <Section id="archie" className="relative">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-16">
          {/* heading + value rows + closing */}
          <div>
            <SectionHeader
              eyebrow="THE COPILOT"
              title="Describe the part. Read every move."
              lead="Archie drives Forge through structured, validated tool-calls into the real kernel — then hands back an editable feature tree, not a disposable script."
            />

            <div className="mt-10 flex flex-col">
              {ROWS.map((row, i) => (
                <Reveal key={row.label} delay={i * 0.06}>
                  <div className="border-t border-line py-5 last:border-b">
                    <p className="u-label text-ink">{row.label}</p>
                    <p className="mt-2 text-body leading-relaxed text-ink-soft">
                      {row.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-body leading-relaxed text-ink-soft">
                Other text-to-CAD tools hand you disposable script. Archie hands
                you an editable feature tree the kernel already validated.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-6">
                <Button href="/archie" variant="ghost" size="md" className="-ml-1 px-1">
                  Meet Archie
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Forge tool-call run resolving to a ✓ valid solid */}
          <Reveal y={24} className="w-full lg:pt-2">
            <div className="rounded-[2px] border border-line-strong bg-surface p-5 md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="u-label text-faint">tool-call run</span>
                <span className="u-spec text-faint">part.revolve()</span>
              </div>
              <div className="relative aspect-[3/2] w-full">
                <ParametricRevolveLathe
                  variant="inline"
                  toolCall="part.revolve()"
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
