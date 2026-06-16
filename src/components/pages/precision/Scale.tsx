import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { FacilitySwarm } from "@/components/artifacts/IsometricExploded";

const SCALE_CHIPS = ["mates · real constraints", "queries · live spatial"];

export function Scale() {
  return (
    <Section id="scale" className="relative isolate overflow-hidden">
      <GenerativeGrid majorPitch={128} />
      <Container className="relative">
        <SectionHeader
          eyebrow="THE SCALE"
          title="Real scale, organized — not confetti."
          lead="Industrial assemblies past one hundred thousand components — racks, machine rows, tank farms — packed into zoned structure with real mates and live spatial queries, and they stay responsive. Scale you can navigate, not a polygon dump."
        />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* the quantified claim */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="u-stat text-ink">100,000</p>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="u-spec mt-3 text-muted">
                components per assembly · zoned · queryable
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <ul className="mt-7 flex flex-col gap-2">
                {SCALE_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="u-spec w-fit rounded-[2px] border border-line-strong bg-surface px-2.5 py-1 text-ink"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* zoned facility swarm */}
          <div className="lg:col-span-8">
            <Reveal y={24}>
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[2px] border border-line-strong bg-surface p-4">
                <FacilitySwarm trigger="view" className="text-ink" />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
