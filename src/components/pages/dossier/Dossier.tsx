import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Plate } from "@/components/visual/Plate";
import type { Dossier as DossierData } from "@/lib/dossiers";

const IMG: Record<string, { hero: string; band: string }> = {
  forge: { hero: "/img/hero-model2.jpg", band: "/img/cad-blueprint.jpg" },
  studio: { hero: "/img/abstract-1.jpg", band: "/img/cad-render.jpg" },
  archie: { hero: "/img/abstract-3.jpg", band: "/img/cad-raw.jpg" },
};

export function Dossier({ d }: { d: DossierData }) {
  const img = IMG[d.key] ?? IMG.forge;

  return (
    <>
      {/* ── Hero (split) ─────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="atmos -z-10" aria-hidden />
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-10 px-5 pt-14 pb-16 md:px-10 md:pt-16 lg:min-h-[78vh] lg:grid-cols-[46fr_54fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft backdrop-blur-sm">
                <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
                {d.designation} · {d.role}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display text-mega font-[700] leading-[0.92] tracking-[-0.035em] text-ink">
                {d.codename}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 font-serif text-[clamp(1.6rem,1.1rem+2vw,2.6rem)] italic leading-[1.1] text-clay-soft">
                {d.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[50ch] text-pretty text-lead text-ink-soft">{d.intro}</p>
            </Reveal>
            <Reveal delay={0.22}>
              <Link
                href="/#systems"
                className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-clay"
              >
                <ArrowLeft size={15} /> All systems
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={26} className="order-1 lg:order-2">
            <figure className="relative overflow-hidden rounded-2xl border border-line-strong shadow-[0_40px_120px_-50px_rgba(109,140,255,0.4)]">
              <Plate src={img.hero} alt={`${d.codename} — ${d.role}`} priority sizes="(max-width:1024px) 100vw, 54vw" className="aspect-[4/3] w-full" />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,8,14,0.1), rgba(6,8,14,0) 42%, rgba(6,8,14,0.7))" }} />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">
                {d.role} — coming soon
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── What it is ───────────────────────────────────────── */}
      <section className="border-y border-line py-20 md:py-28">
        <Container className="max-w-4xl">
          <Reveal>
            <span className="u-label text-clay">What it is</span>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[24ch] text-balance font-display text-[clamp(1.9rem,1.2rem+3.4vw,3.4rem)] font-[700] leading-[1.0] tracking-[-0.03em] text-ink">
              {d.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[62ch] text-pretty text-lead text-muted">{d.what}</p>
          </Reveal>
        </Container>
      </section>

      {/* ── The spec ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <Container className="max-w-4xl">
          <Reveal>
            <span className="u-label text-clay">The spec</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 max-w-[20ch] text-balance text-h1 text-ink">What&rsquo;s actually under the hood.</h2>
          </Reveal>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {d.specs.map((s, i) => (
              <Reveal key={s.label} delay={Math.min(i * 0.04, 0.2)}>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">{s.label}</span>
                  <span className="font-mono text-[13px] tabular-nums text-ink sm:text-right">{s.value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Image band ───────────────────────────────────────── */}
      <section className="relative">
        <div className="relative h-[42vh] w-full overflow-hidden md:h-[54vh]">
          <div className="absolute inset-0">
            <Plate src={img.band} alt="" sizes="100vw" className="h-full w-full" />
          </div>
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,13,21,0.7), rgba(10,13,21,0.35) 50%, rgba(10,13,21,0.92))" }} />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1680px] px-5 pb-8 md:px-10">
              <p className="max-w-[22ch] text-balance font-display text-h2 font-[700] text-ink">
                Made to be <span className="accent-serif">built</span>, not just shown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inside ───────────────────────────────────────────── */}
      <section className="border-t border-line py-20 md:py-28">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <span className="u-label text-clay">Inside</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h1 text-ink">What you&rsquo;ll reach for.</h2>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {d.rooms.map((r, i) => (
              <Reveal key={r.title} delay={Math.min(i * 0.05, 0.25)}>
                <div className="border-t border-line pt-5">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-clay" aria-hidden />
                    <h3 className="font-display text-h3 text-ink">{r.title}</h3>
                  </div>
                  <p className="mt-3 max-w-[46ch] text-pretty text-body text-muted">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="border-t border-line py-24 md:py-32">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Coming soon
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[18ch] text-balance font-display text-display font-[700] leading-[0.98] tracking-[-0.03em] text-ink">
              {d.codename} is <span className="accent-serif">almost</span> here.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
