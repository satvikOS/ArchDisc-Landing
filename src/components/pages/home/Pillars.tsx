import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ThroughLine } from "@/components/visual/ThroughLine";
import { cn } from "@/lib/utils";

type Motif = "mesh" | "sketch" | "caret";

type Card = {
  id: string;
  motif: Motif;
  kicker: string;
  title: string;
  body: string;
  proof: string;
  link: string;
  href: string;
};

const CARDS: Card[] = [
  {
    id: "studio",
    motif: "mesh",
    kicker: "3D content creation",
    title: "Studio",
    body: "Modeling, sculpting, UV, shading, rigging, animation, VFX, simulation, rendering, compositing, a game engine, and a GPU path tracer — Blender-, Maya-, and Houdini-class breadth. Ask Archie for a scene and watch it compose, light, and frame the shot.",
    proof: "modeling · sculpt · animation · sim · render · path-tracer",
    link: "Explore Studio",
    href: "/studio",
  },
  {
    id: "forge",
    motif: "sketch",
    kicker: "Native parametric CAD",
    title: "Forge",
    body: "A from-source C++ kernel on OpenCASCADE 7.9.3 — parametric sketching with the planegcs constraint solver and DOF tracking, assemblies to 100,000 components, FEA, CAM, and drawings with GD&T. Native B-rep geometry that's manufacturable, not just renderable.",
    proof: "sketcher · assemblies · FEA · CAM · STEP / DXF",
    link: "Explore Forge",
    href: "/forge",
  },
  {
    id: "archie",
    motif: "caret",
    kicker: "The local AI copilot",
    title: "Archie",
    body: "One copilot drives both surfaces through structured tool-calls. It reasons about geometry, picks the right operation, builds it parametrically, then runs a coherence gate that verifies and repairs the solid before you see it. Local, private, open-weights — and every step is a call you can read.",
    proof: "local fleet · validated tool-calls · editable tree",
    link: "Meet Archie",
    href: "/archie",
  },
];

/** Small hairline motif per surface — static, currentColor, decorative. */
function Motif({ kind }: { kind: Motif }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className="h-9 w-9 text-ink-soft"
    >
      {kind === "mesh" && (
        <>
          <path
            d="M8 30 L24 10 L40 30 L24 40 Z"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
          <path d="M8 30 L24 24 L40 30 M24 10 L24 24 L24 40" stroke="currentColor" strokeWidth={0.9} opacity={0.5} />
        </>
      )}
      {kind === "sketch" && (
        <>
          <line x1="6" y1="42" x2="42" y2="42" stroke="currentColor" strokeWidth={1} strokeDasharray="3 4" opacity={0.5} />
          <path d="M10 36 L10 16 L30 16 L30 28 L38 28 L38 36" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" />
          <circle cx="10" cy="16" r="1.6" className="fill-current" />
          <circle cx="30" cy="16" r="1.6" className="fill-current" />
          <circle cx="38" cy="28" r="1.6" className="fill-current" />
        </>
      )}
      {kind === "caret" && (
        <>
          <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" strokeWidth={1.2} opacity={0.5} />
          <path d="M14 20 L19 24 L14 28" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
          <line x1="22" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Pillars() {
  return (
    <Section id="pillars">
      <Container>
        <SectionHeader
          eyebrow="ONE UNIVERSE, ONE COPILOT"
          title="Archie is the spine. Studio and Forge are the surfaces it acts on."
          lead="ArchDisc unifies creative 3D and precision engineering under a single AI copilot. You don't switch tools — you change intent."
        />

        <Reveal delay={0.1} className="mt-14">
          <ThroughLine variant="pillar" className="text-ink" />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.08}>
              <Link
                href={card.href}
                className={cn(
                  "group flex h-full flex-col rounded-[2px] border border-line bg-surface p-7",
                  "transition-colors duration-200 hover:border-ink/40",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                )}
              >
                <Motif kind={card.motif} />
                <span className="u-label mt-6 text-faint">{card.kicker}</span>
                <h3 className="mt-2 text-h3 text-ink">{card.title}</h3>
                <p className="mt-3 flex-1 text-body text-ink-soft">{card.body}</p>
                <p className="u-spec mt-5 text-muted">{card.proof}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] font-medium text-ink">
                  {card.link}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
