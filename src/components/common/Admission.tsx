import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ClearanceForm } from "@/components/forms/ClearanceForm";
import { BigWord } from "@/components/fx/BigWord";
import { GradientField } from "@/components/visual/GradientField";

/** Shared closing CTA — request admission to the private viewing. */
export function Admission({
  eyebrow = "Admission",
  headline = "Get on the list.",
  sub = "One email. One signal when the door opens. That's the whole arrangement.",
  defaultInterest = "all",
}: {
  eyebrow?: string;
  headline?: string;
  sub?: string;
  defaultInterest?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden py-24 md:py-32">
      <GradientField intensity={0.7} />
      <BigWord
        variant="ghost"
        rotate={-6}
        className="absolute -bottom-6 -left-4 text-[clamp(4rem,16vw,15rem)]"
      >
        Admit&nbsp;one
      </BigWord>

      <Container className="relative">
        <div className="mx-auto max-w-2xl rounded-2xl border border-line-strong bg-surface/80 p-8 backdrop-blur-md md:p-12">
          <Reveal>
            <span className="u-label text-faint">{eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-balance text-h1 text-ink">{headline}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[48ch] text-pretty text-lead text-muted">{sub}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8">
              <ClearanceForm defaultInterest={defaultInterest} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
