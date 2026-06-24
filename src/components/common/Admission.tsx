import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ClearanceForm } from "@/components/forms/ClearanceForm";
import { SignalCountdown } from "@/components/fx/SignalCountdown";

/** Closing CTA — request admission. Bold forest card with a white form panel. */
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
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-8 overflow-hidden rounded-[32px] bg-forest p-7 md:grid-cols-[1fr_1fr] md:gap-12 md:p-14">
          <div className="text-paper">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/80">
                <span className="signal-dot h-1.5 w-1.5 rounded-full bg-coral" aria-hidden />
                {eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-balance font-display text-h1 font-[800] text-paper">{headline}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-[42ch] text-pretty text-lead text-paper/75">{sub}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-7">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">
                  Opens in
                </span>
                <div className="mt-2">
                  <SignalCountdown inline className="text-paper" />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="rounded-2xl bg-surface p-6 text-ink md:p-8">
              <h3 className="font-display text-h4 font-[700] text-ink">Request clearance</h3>
              <p className="mt-1.5 text-body-sm text-muted">Ten seconds. We handle the rest.</p>
              <div className="mt-5">
                <ClearanceForm defaultInterest={defaultInterest} />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
