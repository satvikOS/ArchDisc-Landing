import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { ParametricRevolveLathe } from "@/components/artifacts/ParametricRevolveLathe";
import { APP_URL, GITHUB_URL, CTA, CTA_SECONDARY } from "@/lib/site";

const MICRO =
  "Open source · free forever · public release soon · native for Apple Silicon · your work stays on your machine.";

export function FinalCta() {
  return (
    <section
      id="final-cta"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-28 text-paper md:py-36"
    >
      <GenerativeGrid dark majorPitch={132} fade={66} />
      {/* resting lathe reprise — already at its final held frame, decorative */}
      <div
        className="pointer-events-none absolute right-[6%] top-1/2 -z-10 hidden h-[360px] w-[360px] -translate-y-1/2 opacity-[0.14] lg:block"
        aria-hidden
      >
        <ParametricRevolveLathe
          variant="inline"
          showDims={false}
          className="h-full w-full text-paper"
        />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2 text-white/55">
              <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
              READY WHEN YOU ARE
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h1 text-white">
              Say it. Watch Archie build it.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-[56ch] text-pretty text-lead text-white/65">
              A local AI copilot, a real CAD kernel, and a full 3D studio — Studio,
              Forge, and Archie in one native app, open source, on your machine.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={APP_URL} size="lg" className="bg-paper text-ink hover:bg-paper/90">
                {CTA}
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button
                href={GITHUB_URL}
                size="lg"
                variant="secondary"
                className="border-white/20 bg-transparent text-paper hover:border-white/40 hover:bg-white/[0.04]"
              >
                <GitHubIcon size={15} />
                {CTA_SECONDARY}
                <Star size={14} className="text-white/55" />
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="u-spec mx-auto mt-7 max-w-[64ch] text-white/40">{MICRO}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
