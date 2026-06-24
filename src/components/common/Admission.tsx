import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ClearanceForm } from "@/components/forms/ClearanceForm";
import { SignalCountdown } from "@/components/fx/SignalCountdown";

/** Closing CTA — early access. Stark near-black card with a bone form panel. */
export function Admission({
  eyebrow = "Early access",
  headline = "Be first to build with it.",
  sub = "Leave an email. One message when it opens — nothing else. Free to use, on your own machine.",
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
        <div
          data-theme="vault"
          className="grid items-center gap-8 overflow-hidden rounded-[28px] bg-night p-7 md:grid-cols-[1fr_1fr] md:gap-12 md:p-14"
        >
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
                {eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-balance font-display text-h1 font-[800] text-ink">{headline}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-[42ch] text-pretty text-lead text-muted">{sub}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-7">
                <span className="u-label text-faint">Public release in</span>
                <div className="mt-2">
                  <SignalCountdown inline className="text-ink" />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="rounded-2xl bg-surface-2 p-6 text-ink md:p-8" data-theme="light">
              <h3 className="font-display text-h4 font-[700] text-ink">Get early access</h3>
              <p className="mt-1.5 text-body-sm text-muted">Ten seconds. No spam, ever.</p>
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
