import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[78dvh] items-center overflow-hidden py-24">
      <div className="atmos -z-10" aria-hidden />
      <Container className="relative text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft backdrop-blur-sm">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
            Error · 404
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-7 text-balance font-display text-display font-[700] leading-[0.98] tracking-[-0.03em] text-ink">
            This page doesn&rsquo;t <span className="accent-serif text-[1.06em]">exist.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-[46ch] text-pretty text-lead text-ink-soft">
            The link is broken, or the page hasn&rsquo;t been built yet. Most of ArchDisc
            is still coming online — here&rsquo;s the way back.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg" variant="accent">
              Back home
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
