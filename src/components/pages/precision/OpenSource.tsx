import { ArrowRight, Star } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { ConstellationField } from "@/components/artifacts/ConstellationField";
import { FlowFieldDrift } from "@/components/artifacts/FlowFieldDrift";
import { APP_URL, GITHUB_URL } from "@/lib/site";

const ANCHORS = ["open code", "open weights", "self-host", "public release soon"];

export function OpenSource() {
  return (
    <Section
      id="opensource"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      {/* faint streamline drift, far behind the centered column */}
      <FlowFieldDrift
        variant="ambient"
        field="curl"
        dark
        alpha={0.06}
        className="opacity-70"
      />
      {/* open-source signature lattice */}
      <div aria-hidden className="absolute inset-0 -z-0">
        <ConstellationField
          dark
          labels={ANCHORS}
          nodeCount={68}
          seed={23}
          className="h-full w-full opacity-80"
        />
      </div>

      <Container className="relative z-10">
        <SectionHeader
          align="center"
          dark
          eyebrow="OPEN SOURCE · PRE-RELEASE"
          title="Don't trust it. Read it."
          lead="Both the ArchDisc software and the Archie model fleet are fully open source — open code and open weights. Inspect the kernel binding, read the FEA math, and run the per-discipline models on your own hardware. No lock-in, no closed cloud, the opposite of a black box."
        />

        <Reveal delay={0.14}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={APP_URL} size="lg">
              Open ArchDisc
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button
              href={GITHUB_URL}
              size="lg"
              variant="secondary"
              className="border-white/20 bg-transparent text-paper hover:border-white/45 hover:bg-white/[0.04] focus-visible:ring-white/30 focus-visible:ring-offset-ink"
            >
              <GitHubIcon size={16} />
              Star on GitHub
              <Star size={14} />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="u-spec mt-6 text-center text-white/45">
            Open source · free forever · public release soon
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
