import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";

const TITLE = "Status — where each system stands";
const DESCRIPTION =
  "An honest board: Forge, Studio and Archie are in preparation and training; the site is live; public release is coming soon. No invented uptime — just where things really are.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/status" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/status" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

type State = "prep" | "training" | "live";
const STATE: Record<State, { label: string; cls: string }> = {
  prep: { label: "In preparation", cls: "border-clay/40 text-clay" },
  training: { label: "In training", cls: "border-clay/40 text-clay-soft" },
  live: { label: "Operational", cls: "border-line-strong text-ink-soft" },
};

const ROWS: { name: string; designation: string; state: State; note: string }[] = [
  {
    name: "Forge — the kernel",
    designation: "SYS-01",
    state: "prep",
    note: "OpenCASCADE solid kernel, planegcs constraints and the FEA stack are hardening before public hands.",
  },
  {
    name: "Studio — the surface",
    designation: "SYS-02",
    state: "prep",
    note: "The 3D creation surface is mid-build — viewport, tools and exports being wired in.",
  },
  {
    name: "Archie — the model",
    designation: "SYS-00",
    state: "training",
    note: "The local Apple-Silicon model is still learning to drive the tools end to end.",
  },
  {
    name: "STEP · IGES · DXF",
    designation: "I/O",
    state: "prep",
    note: "Real interchange formats are in test against reference geometry, not yet open.",
  },
  {
    name: "Public release",
    designation: "RELEASE",
    state: "prep",
    note: "Coming soon. No date theatre — it ships when it's right.",
  },
  {
    name: "This site",
    designation: "WWW",
    state: "live",
    note: "Live and operational.",
  },
];

export default function StatusPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="atmos -z-10" aria-hidden />
        <Container className="relative max-w-3xl">
          <Reveal>
            <span className="u-label text-clay">Status</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 max-w-[18ch] text-balance font-display text-display font-[700] leading-[0.96] tracking-[-0.03em] text-ink">
              Where each system actually{" "}
              <span className="accent-serif text-[1.04em]">stands.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[56ch] text-pretty text-lead text-ink-soft">
              No invented uptime, no green-checkmark theatre. Three systems still in the
              shop, real file formats in test, and a site that&rsquo;s already on.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Board ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line py-16 md:py-24">
        <Container className="relative max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-line">
            {ROWS.map((r, i) => (
              <Reveal key={r.name} delay={Math.min(i * 0.04, 0.2)}>
                <div
                  className={`flex flex-col gap-3 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                      {r.designation}
                    </span>
                    <span className="font-display text-h4 text-ink">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden max-w-[40ch] text-right text-body-sm text-muted md:block">
                      {r.note}
                    </span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] ${STATE[r.state].cls}`}
                    >
                      <span className="signal-dot h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                      {STATE[r.state].label}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── Coming soon ──────────────────────────────────── */}
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-5 rounded-2xl border border-line bg-paper-2/50 p-10 text-center">
              <Chip tone="line">
                <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
                Coming soon
              </Chip>
              <p className="max-w-[34ch] text-balance text-lead text-ink-soft">
                Everything you see above is real and in progress. The public release lands
                when the kernel, the surface and the model are all ready — not a day before.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
