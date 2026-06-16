import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { Lattice3D } from "@/components/artifacts/Lattice3D";
import { InTolStat } from "@/components/instrument/InTolStat";
import { OnDeviceBoundary } from "@/components/instrument/OnDeviceBoundary";

type Stat = { stat: string; label: string; body: string };

const STATS: Stat[] = [
  {
    stat: "0",
    label: "CLOUD ROUND-TRIPS",
    body: "Inference happens on-device. Your prompts and your geometry stay on your hardware — private by default, and fast because there's nothing to wait for over the wire.",
  },
  {
    stat: "R1",
    label: "DISTILLED, PER-DISCIPLINE",
    body: "A DeepSeek-R1-distilled base with discipline-specific fine-tunes, so the model that plans a sketch isn't the one that lights a scene. The right specialist answers each call.",
  },
  {
    stat: "$0",
    label: "PER-TOKEN BILL",
    body: "No metered API. Run it as much as you want on hardware you already own. Iterate at the speed of thought, not the speed of your quota.",
  },
];

export function LocalFleet() {
  return (
    <Section id="local-fleet" className="relative isolate">
      <GenerativeGrid />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow="PRIVATE BY ARCHITECTURE"
              title="It runs on your machine. All of it."
              lead="Archie is not one model behind an API — it's a fleet of small, per-discipline models, DeepSeek-R1-distilled and fine-tuned for the operation in front of you. They're served on your own hardware. There is no cloud round-trip to wait on, no API key to manage, and no per-token meter running while you iterate."
              className="max-w-xl"
            />
            <Reveal delay={0.15}>
              <p className="u-spec mt-6 text-faint">
                Open weights — download the fleet and run it yourself.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.1} y={20}>
              {/* The per-discipline fleet lives INSIDE a sealed on-device
                  boundary: activity streams on the local bus while
                  "bytes leaving machine" stays pegged at 0 — the no-cloud /
                  open-weights / no-keys moat made visible. */}
              <OnDeviceBoundary tone="light" className="pt-1.5 pb-3">
                <div className="relative overflow-hidden rounded-[2px] border border-line-strong bg-surface">
                  <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                    <span className="u-label text-faint">
                      archie · per-discipline fleet
                    </span>
                    <span className="u-spec text-faint">on-device</span>
                  </div>
                  <div className="relative h-[300px] w-full md:h-[360px]">
                    <Lattice3D seed={11} nodes={56} className="absolute inset-0" />
                  </div>
                </div>
              </OnDeviceBoundary>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-line bg-line md:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <article className="h-full bg-surface p-7">
                <InTolStat value={s.stat} className="text-ink" />
                <p className="u-label mt-4 text-faint">{s.label}</p>
                <p className="mt-3 max-w-[42ch] text-body text-ink-soft">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
