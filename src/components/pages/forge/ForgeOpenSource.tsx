import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ConstellationField } from "@/components/artifacts/ConstellationField";
import { FlowFieldDrift } from "@/components/artifacts/FlowFieldDrift";
import { APP_URL, GITHUB_URL } from "@/lib/site";

export function ForgeOpenSource() {
  return (
    <section
      id="open-source"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-24 text-paper md:py-32"
    >
      {/* depth in the empty margins, far from text */}
      <FlowFieldDrift variant="ambient" field="curl" dark className="opacity-70" />
      {/* the open-source star/git lattice substrate */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <ConstellationField
          dark
          seed={11}
          nodeCount={68}
          labels={["open code", "open weights", "self-host", "public release soon"]}
          className="absolute inset-0 h-full w-full opacity-90"
        />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2 text-white/55">
              <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
              OPEN SOURCE · PRE-RELEASE
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h2 font-display text-white">
              Read the code. Run the models. Own the stack.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-lead text-white/65">
              Forge and the Archie model fleet are both fully open — open code
              and open model weights. Inspect the kernel binding, self-host the
              copilot on your own hardware, fork what you need. The opposite of
              a closed cloud CAD service.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-pretty text-body text-white/80">
              ArchDisc is in pre-release — a public release is coming soon.
              Today you can open it, drive it, and read every line behind it.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              {/* inverted primary for the dark field */}
              <Button
                href={APP_URL}
                size="lg"
                className="bg-paper text-ink hover:bg-paper/90 focus-visible:ring-paper/40 focus-visible:ring-offset-ink"
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
                className="border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/[0.06] focus-visible:ring-white/40 focus-visible:ring-offset-ink"
              >
                <Star size={15} />
                Star on GitHub
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="u-spec mt-5 text-white/45">
              github.com/archdisc · open source · free forever.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
