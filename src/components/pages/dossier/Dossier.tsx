import { ArrowRight, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { Vault } from "@/components/visual/Vault";
import { Decrypt } from "@/components/fx/Decrypt";
import { Redacted } from "@/components/fx/Redacted";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { LockedProbe } from "@/components/common/LockedProbe";
import { Admission } from "@/components/common/Admission";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";
import type { Dossier as DossierData } from "@/lib/dossiers";

const COLOR: Record<string, { panel: string; chip: string; soft: string }> = {
  forge: { panel: "bg-forest text-paper", chip: "border-white/25 text-paper/80", soft: "text-paper/70" },
  studio: { panel: "bg-coral text-white", chip: "border-white/35 text-white/85", soft: "text-white/80" },
  archie: { panel: "bg-lilac text-ink", chip: "border-ink/15 text-ink/75", soft: "text-ink/65" },
};

export function Dossier({ d }: { d: DossierData }) {
  const c = COLOR[d.key] ?? COLOR.forge;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-8 pb-14 md:pt-10 md:pb-20">
        <div className="mx-auto w-full max-w-[1680px] px-5 md:px-10">
          <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-3">
            <span className="u-label text-ink">
              {d.designation} — {d.role}
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-coral" aria-hidden />
              <span className="u-label text-ink">opens in</span>
              <SignalCountdown inline className="text-ink" />
            </span>
          </div>

          <div className="grid items-center gap-10 pt-6 md:grid-cols-[1fr_1fr] md:gap-14">
            <div>
              <h1 className="font-display text-mega font-[800] uppercase leading-[0.84] tracking-[-0.045em]">
                <span className="iris-text iris-text-anim">{d.codename}</span>
              </h1>
              <p className="mt-3 font-display text-h2 font-[700] text-ink">{d.tagline}</p>
              <p className="mt-6 max-w-[50ch] text-pretty text-lead text-muted">{d.intro}</p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button href={ACCESS_URL} size="lg" variant="accent">
                  {CLEARANCE_CTA}
                  <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
                <Button href="/#systems" size="lg" variant="secondary">
                  <ArrowLeft size={16} /> All systems
                </Button>
              </div>
            </div>

            {/* bold colored panel — the wall card */}
            <Reveal y={24}>
              <div className={`flex flex-col justify-between rounded-[28px] p-8 md:min-h-[26rem] md:p-10 ${c.panel}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">
                    {d.designation}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-current/25 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] opacity-80">
                    <span className="signal-dot h-1 w-1 rounded-full bg-current" aria-hidden />
                    on view soon
                  </span>
                </div>
                <div className="mt-10">
                  <p className="font-display text-[clamp(2rem,1.2rem+3vw,3.2rem)] font-[800] uppercase leading-[0.88] tracking-[-0.03em]">
                    {d.role}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {d.rooms.slice(0, 6).map((r) => (
                      <span key={r.title} className={`rounded-full border px-3 py-1.5 font-mono text-[11px] ${c.chip}`}>
                        {r.title}
                      </span>
                    ))}
                  </div>
                </div>
                <p className={`mt-10 border-t border-current/15 pt-5 font-mono text-[11px] uppercase tracking-[0.14em] ${c.soft}`}>
                  The work stays under wraps until opening.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Wall text ────────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-2/60 py-20 md:py-28">
        <Container className="max-w-4xl">
          <Reveal>
            <span className="u-label text-faint">What it is</span>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[20ch] text-balance font-display text-[clamp(2rem,1.2rem+4vw,4rem)] font-[800] leading-[0.96] tracking-[-0.035em] text-ink">
              <Decrypt text={d.tagline} className="text-[1em] tracking-[-0.035em]" duration={1100} />
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-[60ch] text-pretty text-lead text-muted">{d.what}</p>
          </Reveal>
        </Container>
      </section>

      {/* ── The checklist (specs, redacted) ──────────────────── */}
      <section className="py-20 md:py-28">
        <Container className="max-w-4xl">
          <Reveal>
            <Chip tone="coral">The checklist · classified</Chip>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 max-w-[22ch] text-balance text-h1 text-ink">
              The wall label, redacted. Run your eye along it to decrypt.
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-line border-y border-line">
            {d.specs.map((s, i) => (
              <Reveal key={s.label} delay={Math.min(i * 0.04, 0.2)}>
                <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">{s.label}</span>
                  <Redacted value={s.value} className="sm:text-right" />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Inside the room (features) ───────────────────────── */}
      <section className="border-t border-line bg-paper-2/40 py-20 md:py-28">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <span className="u-label text-faint">Inside the room</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h1 text-ink">What you&rsquo;ll find when the cloth comes off.</h2>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {d.rooms.map((r, i) => (
              <Reveal key={r.title} delay={Math.min(i * 0.05, 0.25)}>
                <div className="border-t border-ink/15 pt-5">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral" aria-hidden />
                    <h3 className="font-display text-h3 text-ink">{r.title}</h3>
                  </div>
                  <p className="mt-3 max-w-[46ch] text-pretty text-body text-muted">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── The interactive exhibit (locked) ─────────────────── */}
      {d.showProbe && (
        <section className="py-20 md:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[42fr_58fr]">
            <div>
              <Reveal>
                <Chip tone="coral">The interactive exhibit</Chip>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 text-balance text-h1 text-ink">Touch this one. It builds for real.</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-[44ch] text-pretty text-lead text-muted">
                  Describe a part and watch {d.codename}&rsquo;s collaborator work the tools —
                  the finished piece just stays a preview until opening.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.1} y={24}>
              <LockedProbe />
            </Reveal>
          </Container>
        </section>
      )}

      {/* ── Why it's veiled ──────────────────────────────────── */}
      <Vault field={false} className="py-24 md:py-32">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <span className="u-label text-faint">Why it&rsquo;s still under wraps</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-[24ch] text-balance text-h1 text-ink">{d.whyVeiled}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-10"><SignalCountdown /></div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8">
              <Button href={ACCESS_URL} size="lg" variant="accent">{CLEARANCE_CTA}</Button>
            </div>
          </Reveal>
        </Container>
      </Vault>

      <Admission
        eyebrow="Admission"
        headline={`Be first into ${d.codename}.`}
        sub="One email. One signal when the doors open. You'll be on the other side of them."
        defaultInterest={d.key}
      />
    </>
  );
}
