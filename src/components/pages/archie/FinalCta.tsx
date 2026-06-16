import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { ParametricRevolveLathe } from "@/components/artifacts/ParametricRevolveLathe";
import { APP_URL, GITHUB_URL } from "@/lib/site";

export function FinalCta() {
  return (
    <section
      id="final-cta"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-white/10 bg-ink py-28 text-paper md:py-36"
    >
      {/* quiet closing echo of the hero idiom — resolved, faint, decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center opacity-[0.12] lg:flex"
      >
        <ParametricRevolveLathe
          variant="inline"
          showDims
          className="h-auto w-full max-w-lg text-paper"
        />
      </div>

      <Container className="relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2 text-white/55">
              <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
              READY WHEN YOU ARE
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-4 max-w-[16ch] text-balance text-h1 font-display text-white">
              Say it. Watch Archie build it.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[54ch] text-pretty text-lead text-white/65">
              A local, open-weights AI copilot, a real CAD kernel, and a full 3D
              studio — Archie, Forge, and Studio in one native app on your own
              machine.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button
                href={APP_URL}
                size="lg"
                className="bg-paper text-ink hover:bg-paper/90 active:bg-paper focus-visible:ring-white/40 focus-visible:ring-offset-ink"
              >
                Open ArchDisc
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button
                href={GITHUB_URL}
                size="lg"
                className="border border-white/25 bg-transparent text-paper hover:border-white/50 hover:bg-white/[0.06] focus-visible:ring-white/40 focus-visible:ring-offset-ink"
              >
                <GitHubIcon size={16} />
                Star on GitHub
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="u-spec mt-6 text-white/45">
              Open source · free forever · public release soon · native for
              Apple Silicon · your work stays on your machine.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
