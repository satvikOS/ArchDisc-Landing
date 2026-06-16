import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { DotGrid } from "@/components/visual/DotGrid";
import { ThroughLine } from "@/components/visual/ThroughLine";
import { finalCta, APP_URL, WATCH_URL } from "@/lib/content";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-36">
      <DotGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[300px] w-[460px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
      >
        <ThroughLine variant="final" trigger="view" />
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow>{finalCta.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-balance text-h2 font-semibold text-ink">
            {finalCta.headline}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
            {finalCta.subhead}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href={APP_URL} size="lg">
              {finalCta.primaryCta}
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href={WATCH_URL} size="lg" variant="secondary">
              <Play size={15} />
              {finalCta.secondaryCta}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 font-mono text-[12px] tracking-wide text-faint">
            {finalCta.micro}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
