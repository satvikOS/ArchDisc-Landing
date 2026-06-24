import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { BigWord } from "@/components/fx/BigWord";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { Button } from "@/components/ui/Button";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

const TITLE = "Status — where each system stands";
const DESCRIPTION =
  "An honest board: Forge, Studio and Archie are in preparation; clearance intake is open; the signal to public release is pending. No invented uptime, just where things really are.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/status" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/status" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

type State = "prep" | "training" | "live" | "open";
const STATE: Record<State, { label: string; cls: string }> = {
  prep: { label: "In preparation", cls: "border-iris-amber/40 text-iris-amber" },
  training: { label: "In training", cls: "border-iris-magenta/40 text-iris-magenta" },
  live: { label: "Operational", cls: "border-signal/40 text-signal" },
  open: { label: "Open", cls: "border-signal/40 text-signal" },
};

const ROWS: { name: string; designation: string; state: State; note: string }[] = [
  { name: "Forge — the kernel", designation: "SYS-01", state: "prep", note: "Kernel and tooling hardening before public hands." },
  { name: "Studio — the surface", designation: "SYS-02", state: "prep", note: "Creation surface mid-installation." },
  { name: "Archie — the model", designation: "SYS-00", state: "training", note: "The model is still learning the tools." },
  { name: "Clearance intake", designation: "ACCESS", state: "open", note: "Requests accepted now — you can hold a place." },
  { name: "Public signal", designation: "SIGNAL", state: "prep", note: "Pending. The countdown is the source of truth." },
  { name: "This site", designation: "WWW", state: "live", note: "Operational." },
];

export default function StatusPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
        <BigWord variant="ghost" className="absolute -top-2 left-1/2 -translate-x-1/2 text-[clamp(4rem,18vw,16rem)]">
          Status
        </BigWord>
        <Container className="relative max-w-3xl">
          <Reveal>
            <Chip tone="line">System status · honest board</Chip>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-[18ch] text-balance text-display font-display font-semibold leading-[0.96] text-ink">
              Where each system actually{" "}
              <span className="iris-text iris-text-anim">stands</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[56ch] text-pretty text-lead text-muted">
              No invented uptime, no green-checkmark theatre. Three systems in preparation,
              one door already taking names.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-line py-16 md:py-24">
        <Container className="relative max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-line">
            {ROWS.map((r, i) => (
              <Reveal key={r.name} delay={Math.min(i * 0.04, 0.2)}>
                <div className={`flex flex-col gap-3 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between ${i > 0 ? "border-t border-line" : ""}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">{r.designation}</span>
                    <span className="font-display text-h4 text-ink">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden max-w-[34ch] text-right text-body-sm text-muted md:block">{r.note}</span>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] ${STATE[r.state].cls}`}>
                      <span className="signal-dot h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                      {STATE[r.state].label}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-line bg-paper-2/50 p-8 text-center">
              <span className="u-label text-faint">Public release · pending the signal</span>
              <SignalCountdown />
              <Button href={ACCESS_URL} size="lg" variant="accent">{CLEARANCE_CTA}</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
