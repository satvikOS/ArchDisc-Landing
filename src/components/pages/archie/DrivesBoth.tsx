import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { IsometricExploded } from "@/components/artifacts/IsometricExploded";

type RouteCard = {
  kicker: string;
  title: string;
  body: string;
  proof: string;
  href: string;
  cta: string;
};

const CARDS: RouteCard[] = [
  {
    kicker: "3D CONTENT CREATION",
    title: "Studio",
    body: "Modeling, sculpting, UV, shading, rigging, animation, VFX, simulation, rendering, compositing, a game engine and a GPU path tracer. Archie composes the scene; you direct it.",
    proof: "studio · sculpt → retopo → shade → render",
    href: "/studio",
    cta: "Explore Studio",
  },
  {
    kicker: "NATIVE PARAMETRIC CAD",
    title: "Forge",
    body: "A from-source OpenCASCADE 7.9.3 kernel: parametric sketching with the planegcs solver, assemblies to 100,000 components, FEA, CAM, and drawings with GD&T. Archie emits the exact kernel operations.",
    proof: "forge · sketch → constrain → assemble → simulate",
    href: "/forge",
    cta: "Explore Forge",
  },
];

export function DrivesBoth() {
  return (
    <Section id="drives-both" className="relative isolate">
      <GenerativeGrid />
      <Container className="relative">
        <SectionHeader
          eyebrow="ONE BRAIN, TWO HANDS"
          title="One copilot. Both surfaces."
          lead="Archie isn't bolted onto two apps — it is the spine that drives both. Ask it to sculpt, light, and frame a scene in Studio; ask it to sketch, constrain, assemble, and simulate a part in Forge. Same copilot, same readable tool-calls, same coherence gate — it just changes which engine it's speaking to."
          className="max-w-[48ch]"
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <CardLink card={CARDS[0]} delay={0} />
          </div>

          {/* shared-kernel accent — the assembly both surfaces act on */}
          <div className="flex items-center justify-center lg:col-span-4">
            <Reveal delay={0.08} y={20} className="w-full">
              <div className="relative flex h-full min-h-[260px] flex-col items-center justify-center rounded-[2px] border border-line bg-surface p-4">
                <IsometricExploded
                  trigger="view"
                  showBom={false}
                  className="h-[220px] w-full text-ink"
                />
                <p className="u-label mt-1 text-faint">
                  archie · one kernel, two engines
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <CardLink card={CARDS[1]} delay={0.16} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function CardLink({ card, delay }: { card: RouteCard; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={card.href}
        className="group flex h-full flex-col rounded-[2px] border border-line bg-surface p-7 transition-colors duration-200 hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <span className="u-label text-faint">{card.kicker}</span>
        <h3 className="mt-4 text-h3 font-display text-ink">{card.title}</h3>
        <p className="mt-3 flex-1 text-body text-ink-soft">{card.body}</p>
        <p className="u-spec mt-5 text-faint">{card.proof}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[13px] font-medium text-ink">
          {card.cta}
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </Link>
    </Reveal>
  );
}
