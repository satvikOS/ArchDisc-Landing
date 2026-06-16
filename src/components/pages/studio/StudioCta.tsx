import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { DitherPortrait } from "@/components/artifacts/DitherPortrait";
import { APP_URL, GITHUB_URL, CTA, CTA_SECONDARY } from "@/lib/site";

const SUBHEAD =
  "A full 3D creation suite and a local copilot that sculpts, shades, and stages on command — Studio and Archie in one native app, on your machine.";

const MICRO =
  "Open source · free forever · public release soon · native for Apple Silicon.";

export function StudioCta() {
  return (
    <section
      id="cta"
      className="relative isolate overflow-hidden border-t border-line py-28 md:py-36"
    >
      <GenerativeGrid majorPitch={120} />

      {/* faint resolved DitherPortrait reprise behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[300px] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] md:w-[380px]"
      >
        <DitherPortrait variant="tile" showTag={false} pitch={5} className="text-ink" />
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="u-label inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
            READY WHEN YOU ARE
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-2xl text-balance text-h2 font-display text-ink">
            Open the studio. Talk to it.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-lead text-muted">
            {SUBHEAD}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href={APP_URL} size="lg">
              {CTA}
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href={GITHUB_URL} size="lg" variant="secondary">
              <Star size={15} />
              {CTA_SECONDARY}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 u-spec text-faint">{MICRO}</p>
        </Reveal>
      </Container>
    </section>
  );
}
