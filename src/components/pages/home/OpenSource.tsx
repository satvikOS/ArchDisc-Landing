import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { ConstellationField } from "@/components/artifacts/ConstellationField";
import { FlowFieldDrift } from "@/components/artifacts/FlowFieldDrift";
import { APP_URL, GITHUB_URL, CTA, CTA_SECONDARY } from "@/lib/site";

const ANCHORS: { label: string; body: string }[] = [
  {
    label: "Open code",
    body: "The platform source, kernel bindings, and tool-call schema, public on GitHub.",
  },
  {
    label: "Open weights",
    body: "The per-discipline Archie fleet weights, downloadable and self-hostable.",
  },
  {
    label: "Self-host",
    body: "Run Archie and ArchDisc entirely on your own machine. Geometry never leaves the room.",
  },
  {
    label: "Public release soon",
    body: "ArchDisc is in pre-release. A public release is coming; this is honest early access, not GA.",
  },
];

export function OpenSource() {
  return (
    <section
      id="open-source"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-24 text-paper md:py-32"
    >
      {/* substrate: drifting flow field in the empty margins + the star lattice */}
      <FlowFieldDrift
        variant="ambient"
        field="curl"
        dark
        className="absolute inset-0 -z-10 opacity-60"
      />
      <div className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-[420px] w-full max-w-5xl -translate-y-1/2">
        <ConstellationField dark nodeCount={70} className="h-full w-full" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2 text-white/55">
              <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
              OPEN SOURCE · PRE-RELEASE
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h2 text-white">
              Own your entire stack. Read every line of it.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-[60ch] text-pretty text-lead text-white/65">
              Both the ArchDisc software and the Archie model fleet are fully open
              source — open code and open model weights. Inspect the kernel bindings,
              fork the tool-call schema, run the models on your own hardware. The
              opposite of closed cloud text-to-CAD: no lock-in, no telemetry, no
              per-token bill.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {ANCHORS.map((a, i) => (
            <Reveal
              key={a.label}
              delay={i * 0.06}
              className="rounded-[2px] border border-white/10 bg-white/[0.02] p-6"
            >
              <h3 className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-white/55">
                {a.label}
              </h3>
              <p className="mt-2.5 text-body-sm text-white/65">{a.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
      </Container>
    </section>
  );
}
