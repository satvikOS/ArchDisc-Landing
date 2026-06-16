import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { ConstellationField } from "@/components/artifacts/ConstellationField";
import { FlowFieldDrift } from "@/components/artifacts/FlowFieldDrift";
import { APP_URL, GITHUB_URL } from "@/lib/site";

const ANCHORS = [
  "OPEN CODE",
  "OPEN WEIGHTS",
  "SELF-HOST",
  "PUBLIC RELEASE SOON",
];

export function OpenSource() {
  return (
    <section
      id="open-source"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-28 text-paper md:py-36"
    >
      {/* substrate: flow drift far behind, constellation lattice in front */}
      <FlowFieldDrift
        variant="ambient"
        field="curl"
        dark
        className="absolute inset-0 -z-10 opacity-70"
      />
      <ConstellationField
        dark
        ambient
        seed={3}
        nodeCount={70}
        labels={[
          "open code",
          "open weights",
          "self-host",
          "public release soon",
        ]}
        className="absolute inset-0 -z-[5] opacity-90"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2 text-white/55">
              <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
              OPEN SOURCE · PRE-RELEASE
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-4 text-balance text-h2 font-display text-white">
              Open weights. Open code. Yours to run.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-[54ch] text-pretty text-lead text-white/65">
              The closed cloud text-to-CAD tools want you renting access to a
              model you can&rsquo;t see, on a server you don&rsquo;t control,
              billed by the token. Archie is the opposite. Both the ArchDisc
              software and the Archie model fleet are fully open source — open
              code and open weights. Read it, audit it, fork it, and self-host
              the whole stack on your own machine. No lock-in, ever.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mx-auto mt-9 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {ANCHORS.map((a) => (
                <li
                  key={a}
                  className="u-label flex items-center gap-2 text-white/55"
                >
                  <span aria-hidden className="text-white/40">
                    ✶
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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

          <Reveal delay={0.25}>
            <p className="u-spec mx-auto mt-6 text-white/45">
              ArchDisc is in pre-release. The code and weights are open; a
              public release is coming soon. Free forever.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
