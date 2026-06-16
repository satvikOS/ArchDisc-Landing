import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { FlowFieldDrift } from "@/components/artifacts/FlowFieldDrift";
import { APP_URL, GITHUB_URL } from "@/lib/site";

export function ForgeFinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line py-28 md:py-36">
      {/* resolved-and-held airfoil streamlines, masked low-contrast behind the CTA */}
      <FlowFieldDrift
        variant="static"
        field="airfoil"
        fade={84}
        className="opacity-60"
      />

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="u-label inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
            READY WHEN YOU ARE
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-[20ch] text-balance text-h1 font-display text-ink">
            Describe the part. Forge will make it real.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-lead text-muted">
            A from-source CAD kernel, a real constraint solver, the full FEA
            set, drawings, and CAM — driven by a local, open copilot, in one
            native app on your machine.
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
              <Star size={15} />
              Star on GitHub
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="u-spec mt-5 text-faint">
            Open source · free forever · public release soon · native for Apple
            Silicon.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
