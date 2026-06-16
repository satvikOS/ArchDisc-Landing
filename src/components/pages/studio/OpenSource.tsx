import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ConstellationField } from "@/components/artifacts/ConstellationField";
import { FlowFieldDrift } from "@/components/artifacts/FlowFieldDrift";
import { APP_URL, GITHUB_URL, CTA, CTA_SECONDARY } from "@/lib/site";

const DECK =
  "ArchDisc is open source — and so is Archie. The software and the model fleet are both open: read the code, inspect the weights, run the whole thing on your own hardware.";

const TILES: { label: string; body: string }[] = [
  {
    label: "READ THE CODE",
    body: "The Studio engine, the kernel bindings, the composer — all inspectable. No black box, no lock-in.",
  },
  {
    label: "RUN THE WEIGHTS",
    body: "Archie's per-discipline model fleet is open-weight and on-device. Your hardware, your models, your geometry.",
  },
  {
    label: "OWN THE STACK",
    body: "Self-host the entire pipeline. The opposite of a closed cloud tool that rents you your own designs.",
  },
];

/* Dark-field CTA buttons — focus-ring + radius parity with the shared Button,
   but inverted for the ink gravity field (paper primary, hairline secondary). */
const ctaBase =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-[4px] px-6 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

export function OpenSource() {
  return (
    <section
      id="open-source"
      className="relative isolate overflow-hidden border-t border-white/10 bg-ink py-24 text-paper md:py-32"
    >
      {/* substrate — local-fleet lattice + faint ambient streamlines far from text */}
      <ConstellationField
        dark
        nodeCount={66}
        seed={11}
        className="absolute inset-0 -z-10 h-full w-full opacity-90"
      />
      <FlowFieldDrift
        variant="ambient"
        field="curl"
        dark
        alpha={0.05}
        className="-z-10 opacity-60"
      />

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="u-label inline-flex items-center gap-2 text-white/50">
            <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
            OPEN SOURCE · PRE-RELEASE
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-2xl text-balance text-h2 font-display text-white">
            Open code. Open weights. Yours to run.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-lead text-white/65">
            {DECK}
          </p>
        </Reveal>

        {/* 3-up anchor tiles */}
        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 sm:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal key={tile.label} delay={0.12 + i * 0.06}>
              <div className="h-full bg-ink px-5 py-6 text-left">
                <p className="u-label text-white/55">{tile.label}</p>
                <p className="mt-3 text-body-sm text-white/65">{tile.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-xl text-pretty text-body text-white/80">
            We&rsquo;re in pre-release; the public release is coming soon. Star
            the repo to follow it.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaBase} bg-paper text-ink hover:bg-white`}
            >
              {CTA}
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaBase} border border-white/20 text-paper hover:border-white/40 hover:bg-white/[0.06]`}
            >
              <Star size={15} />
              {CTA_SECONDARY}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-6 u-spec text-white/40">
            Open source · free forever · public release soon.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
