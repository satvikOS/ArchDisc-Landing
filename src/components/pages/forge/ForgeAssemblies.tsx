"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { FacilitySwarm } from "@/components/artifacts/IsometricExploded";

/** Count-up on a numeric stat string (e.g. "107000"); renders the suffix verbatim. */
function StatCounter({ value, suffix }: { value: number; suffix?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    const dur = 1000;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  // Reduced motion can resolve to `true` only after mount; derive the final
  // value at render time so the stat is never stuck at 0 (no count-up).
  const display = reduce ? value : n;

  return (
    <span ref={ref} className="u-stat text-ink">
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

const SECONDARY = ["zoned bays", "real mates", "live spatial queries", "stays responsive"];

export function ForgeAssemblies() {
  return (
    <Section id="assemblies" className="relative isolate">
      <GenerativeGrid majorPitch={128} fade={62} />
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-14">
          {/* copy + stat */}
          <div>
            <SectionHeader
              eyebrow="ASSEMBLIES"
              title="A hundred thousand components, organized."
              lead="Forge handles assemblies the size of a real facility — past 100,000 components — with real mates and live spatial queries. The zoned-facility generator lays them out the way a plant actually is: racks, drum farms, and machine rows packed into bays with aisles between them. Structure, not confetti."
            />

            <Reveal delay={0.1}>
              <div className="mt-9">
                <StatCounter value={107000} suffix="+" />
                <p className="u-label mt-3 text-faint">
                  components placed in a single organized facility
                </p>
                <p className="u-spec mt-4 text-muted">{SECONDARY.join(" · ")}</p>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-7 text-body leading-relaxed text-ink-soft">
                Because the layout is structured, you can still select, query,
                and edit inside it — the assembly doesn&apos;t collapse into
                noise at scale. Archie can build the whole environment from one
                prompt and bound the camera to what matters.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="u-spec mt-5 text-faint">
                The facility generator ships in the open —
                window.__forgeBuildEnvironment is yours to read and drive.
              </p>
            </Reveal>
          </div>

          {/* zoned 100k swarm banner */}
          <Reveal y={24} className="w-full">
            <div className="rounded-[2px] border border-line-strong bg-surface p-4 md:p-5">
              <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
                <FacilitySwarm trigger="view" className="absolute inset-0 text-ink" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
