import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ThroughLine } from "@/components/visual/ThroughLine";
import { pillars } from "@/lib/content";

function PillarMotif({ kind }: { kind: "mesh" | "sketch" | "caret" }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    "aria-hidden": true as const,
    className: "h-9 w-9 text-ink",
  };
  if (kind === "mesh") {
    return (
      <svg {...common}>
        <g stroke="currentColor" strokeWidth={1.25}>
          <circle cx={24} cy={24} r={15} />
          <ellipse cx={24} cy={24} rx={15} ry={6} />
          <ellipse cx={24} cy={24} rx={6} ry={15} />
          <line x1={9} y1={24} x2={39} y2={24} opacity={0.5} />
        </g>
      </svg>
    );
  }
  if (kind === "sketch") {
    return (
      <svg {...common}>
        <g stroke="currentColor" strokeWidth={1.25}>
          <rect x={11} y={14} width={26} height={20} rx={1} />
          <line x1={11} y1={9} x2={37} y2={9} opacity={0.6} />
          <line x1={11} y1={6} x2={11} y2={12} opacity={0.6} />
          <line x1={37} y1={6} x2={37} y2={12} opacity={0.6} />
          <circle cx={11} cy={14} r={1.6} fill="currentColor" />
          <circle cx={37} cy={34} r={1.6} fill="currentColor" />
        </g>
      </svg>
    );
  }
  return (
    <svg {...common}>
      <g stroke="currentColor" strokeWidth={1.25}>
        <path d="M10 16 L18 24 L10 32" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 16 H38 V32 H26 Z" />
        <path d="M26 16 L31 12 H43 L38 16" opacity={0.55} />
        <path d="M38 16 L43 12 V28 L38 32" opacity={0.55} />
      </g>
    </svg>
  );
}

export function Pillars() {
  return (
    <Section id="pillars" className="relative">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{pillars.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h2 font-semibold text-ink">
              {pillars.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-[17px] leading-relaxed text-muted">
              {pillars.intro}
            </p>
          </Reveal>
        </div>

        <div className="relative mt-14">
          <ThroughLine variant="pillar" className="mb-10 hidden md:block" />

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.cards.map((card, i) => (
              <Reveal key={card.id} delay={i * 0.08}>
                <article
                  id={card.id}
                  className="group flex h-full scroll-mt-24 flex-col rounded-[2px] border border-line bg-surface p-6 transition-colors duration-200 hover:border-ink/40"
                >
                  <PillarMotif kind={card.motif} />
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-muted">
                    {card.kicker}
                  </p>
                  <h3 className="mt-1.5 text-h3 font-semibold text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">
                    {card.body}
                  </p>
                  <div className="mt-6 border-t border-line pt-4">
                    <p className="font-mono text-[11px] text-faint">{card.proof}</p>
                    <a
                      href="#"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-[2px] text-[14px] font-medium text-ink transition-colors hover:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    >
                      {card.link}
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
