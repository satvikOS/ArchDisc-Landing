import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { GradientField } from "@/components/visual/GradientField";

export type LegalSection = { h: string; p: string[] };

export function LegalPage({
  kicker,
  title,
  updated,
  intro,
  sections,
}: {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-20 pb-10 md:pt-28 md:pb-14">
        <GradientField intensity={0.6} />
        <Container className="relative max-w-3xl">
          <Reveal>
            <Chip tone="line">{kicker}</Chip>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 text-balance text-h1 font-display font-semibold text-ink">{title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-faint">
              Updated {updated}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 text-pretty text-lead text-muted">{intro}</p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-line py-16 md:py-24">
        <Container className="relative max-w-3xl">
          <div className="space-y-12">
            {sections.map((s, i) => (
              <Reveal key={s.h} delay={Math.min(i * 0.03, 0.15)}>
                <div>
                  <h2 className="font-display text-h3 text-ink">{s.h}</h2>
                  <div className="mt-4 space-y-4">
                    {s.p.map((para, j) => (
                      <p key={j} className="text-pretty text-body text-muted">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
