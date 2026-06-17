import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { ParametricRevolveLathe } from "@/components/artifacts/ParametricRevolveLathe";
import { APP_URL } from "@/lib/site";

/** The single, shared closing CTA — dark bookend used as the last section on
 *  every page (replaces the four per-page Final CTA variants). */
export function FinalCta({
  eyebrow = "Ready when you are",
  headline = "Say it. Watch Archie build it.",
  subhead = "A local AI copilot, a real CAD kernel, and a full 3D studio — Studio, Forge, and Archie in one app, on your machine. Free to use, built and maintained by us.",
  micro = "Free to use · local & private · public release soon",
}: {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  micro?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-28 text-paper md:py-36">
      <GenerativeGrid dark />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[460px] -translate-x-1/2 -translate-y-1/2 text-paper opacity-[0.12]"
      >
        <ParametricRevolveLathe variant="inline" showDims={false} className="text-paper" />
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="u-label text-white/55">{eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-3xl text-balance text-h1 text-white">{headline}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-lead text-white/65">{subhead}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href={APP_URL} size="lg" className="bg-paper text-ink hover:bg-white">
              Open ArchDisc
            </Button>
            <Button
              href="/precision"
              size="lg"
              variant="secondary"
              className="border-white/25 bg-transparent text-paper hover:border-white/50 hover:bg-white/[0.06]"
            >
              See the precision
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 font-mono text-[12px] tracking-wide text-white/40">{micro}</p>
        </Reveal>
      </Container>
    </section>
  );
}
