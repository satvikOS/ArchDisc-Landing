import { ArrowRight, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { GradientField } from "@/components/visual/GradientField";
import { Vault } from "@/components/visual/Vault";
import { BigWord } from "@/components/fx/BigWord";
import { Decrypt } from "@/components/fx/Decrypt";
import { Redacted } from "@/components/fx/Redacted";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { LockedProbe } from "@/components/common/LockedProbe";
import { Admission } from "@/components/common/Admission";
import { Solid3D } from "@/components/artifacts/Solid3D";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";
import type { Dossier as DossierData } from "@/lib/dossiers";

export function Dossier({ d }: { d: DossierData }) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        <GradientField intensity={0.9} />
        <BigWord
          variant="ghost"
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-[clamp(5rem,20vw,17rem)]"
        >
          {d.role.replace(/^The /, "")}
        </BigWord>

        <Container className="relative grid items-center gap-12 lg:grid-cols-[48fr_52fr] lg:gap-16">
          <div className="flex flex-col items-start">
            <Reveal>
              <Chip tone="iris">
                <span className="signal-dot h-1.5 w-1.5 rounded-full bg-iris-magenta" aria-hidden />
                {d.designation} · {d.role}
              </Chip>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-mega font-display font-semibold leading-[0.9] text-ink">
                <span className="iris-text iris-text-anim">{d.codename}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 font-display text-h3 text-ink-soft">{d.tagline}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[52ch] text-pretty text-lead text-muted">{d.intro}</p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button href={ACCESS_URL} size="lg" variant="accent">
                  {CLEARANCE_CTA}
                  <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
                <Button href="/#exhibition" size="lg" variant="secondary">
                  <ArrowLeft size={16} /> Back to the exhibition
                </Button>
              </div>
            </Reveal>
          </div>

          {/* The key work, veiled */}
          <Reveal delay={0.1} y={24}>
            <figure className="relative aspect-square overflow-hidden rounded-2xl border border-line-strong bg-vault shadow-[0_30px_80px_-40px_rgba(12,19,34,0.55)]">
              <GradientField tone="vault" intensity={1} reactive={false} />
              <Solid3D variant={d.variant} dark className="absolute inset-0" />
              <div
                aria-hidden
                className="absolute inset-0 backdrop-blur-[5px]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,14,26,0.05), rgba(10,14,26,0.45) 70%, rgba(10,14,26,0.8))",
                }}
              />
              <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                {d.designation} · {d.codename}
              </span>
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                <span className="signal-dot h-1 w-1 rounded-full bg-signal" aria-hidden />
                on view soon
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 p-5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                The work stays under cloth until opening.
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* ── Wall text ────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-line bg-paper-2/60 py-24 md:py-32">
        <Container className="relative">
          <Reveal>
            <span className="u-label text-faint">Wall text — what it is</span>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[18ch] text-balance font-display text-[clamp(2rem,1.2rem+4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink">
              <Decrypt text={d.tagline} className="text-[1em] tracking-[-0.035em]" duration={1100} />
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-[60ch] text-pretty text-lead text-muted">{d.what}</p>
          </Reveal>
        </Container>
      </section>

      {/* ── The checklist (specs) ────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <BigWord variant="ghost" rotate={-90} className="absolute -right-8 top-1/2 hidden -translate-y-1/2 text-[clamp(3rem,7vw,6rem)] lg:block">
          Classified
        </BigWord>
        <Container className="relative">
          <Reveal>
            <Chip tone="line">The checklist · classified</Chip>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 max-w-[20ch] text-balance text-h2 text-ink">
              The wall label, redacted. Run your eye along it to decrypt.
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-line border-y border-line">
            {d.specs.map((s, i) => (
              <Reveal key={s.label} delay={Math.min(i * 0.04, 0.2)}>
                <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                    {s.label}
                  </span>
                  <Redacted value={s.value} className="sm:text-right" />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Inside the room (features) ───────────────────────── */}
      <section className="relative overflow-hidden border-t border-line bg-paper-2/40 py-24 md:py-32">
        <Container className="relative">
          <div className="max-w-2xl">
            <Reveal>
              <span className="u-label text-faint">Inside the room</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h1 text-ink">What you&rsquo;ll find when the cloth comes off.</h2>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {d.rooms.map((r, i) => (
              <Reveal key={r.title} delay={Math.min(i * 0.05, 0.25)}>
                <div className="border-t border-line pt-5">
                  <div className="flex items-center gap-2.5">
                    <span className="iris-fill h-2 w-2 rounded-full" aria-hidden />
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
        <section className="relative overflow-hidden py-24 md:py-32">
          <GradientField intensity={0.6} />
          <Container className="relative grid items-center gap-12 lg:grid-cols-[42fr_58fr]">
            <div>
              <Reveal>
                <span className="u-label text-faint">The interactive exhibit</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-balance text-h2 text-ink">
                  Touch this one. It builds for real.
                </h2>
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
      <Vault className="py-28 md:py-36">
        <BigWord variant="outline" className="absolute left-1/2 top-8 -translate-x-1/2 text-[clamp(4rem,16vw,14rem)] opacity-70">
          Shhh
        </BigWord>
        <Container className="relative flex flex-col items-center text-center">
          <Reveal>
            <span className="u-label text-faint">Why it&rsquo;s still under cloth</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-[24ch] text-balance text-h2 text-ink">{d.whyVeiled}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-10">
              <SignalCountdown />
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8">
              <Button href={ACCESS_URL} size="lg" variant="accent">
                {CLEARANCE_CTA}
              </Button>
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
