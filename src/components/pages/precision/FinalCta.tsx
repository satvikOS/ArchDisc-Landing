import { ArrowRight, Star } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { StressFieldHalftone } from "@/components/artifacts/StressFieldHalftone";
import { APP_URL, GITHUB_URL } from "@/lib/site";

export function FinalCta() {
  return (
    <section
      id="finalcta"
      className="relative isolate overflow-hidden border-t border-line py-28 md:py-32"
    >
      {/* faint resolved stress-plot bookend, mirroring the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
      >
        <StressFieldHalftone showAnnotations={false} showLegend={false} />
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="u-label inline-flex items-center gap-2 text-muted">
            <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
            READY WHEN YOU ARE
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-[46ch] text-balance text-h2 font-display text-ink">
            See it for yourself.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-lead text-muted">
            A native CAD kernel, real FEA, manufacturable export, and a local AI
            copilot — open source, on your machine. Don&apos;t take the
            readout&apos;s word for it. Open it and run the math yourself.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href={APP_URL} size="lg">
              Open ArchDisc
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href={GITHUB_URL} size="lg" variant="secondary">
              <GitHubIcon size={16} />
              Star on GitHub
              <Star size={14} />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="u-spec mt-6 text-faint">
            Open source · free forever · public release soon · native for Apple
            Silicon, Windows in progress
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
