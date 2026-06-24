import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ExhibitCard } from "@/components/common/ExhibitCard";
import { BigWord } from "@/components/fx/BigWord";
import { Chip } from "@/components/ui/Chip";
import { PRODUCTS } from "@/lib/site";

export function TheExhibition() {
  return (
    <section id="exhibition" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <BigWord
        variant="ghost"
        className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-[clamp(4.5rem,18vw,14rem)]"
      >
        Veiled
      </BigWord>

      <Container className="relative">
        <div className="max-w-2xl">
          <Reveal>
            <Chip tone="line">On view soon · three rooms</Chip>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-balance text-h1 text-ink">The exhibition</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-pretty text-lead text-muted">
              Three systems, hung side by side. You can read the wall labels now — the
              works themselves stay under cloth until opening night. Step up to any room.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.08}>
              <ExhibitCard exhibit={p} index={i} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
