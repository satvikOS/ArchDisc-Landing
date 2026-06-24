import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BigWord } from "@/components/fx/BigWord";

/** The didactic wall text — the thesis, set as a museum statement. */
export function Statement() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-paper-2/60 py-24 md:py-32">
      <BigWord
        variant="outline"
        rotate={-90}
        className="absolute -right-10 top-1/2 hidden -translate-y-1/2 text-[clamp(4rem,9vw,8rem)] lg:block"
      >
        Build.
      </BigWord>

      <Container className="relative">
        <Reveal>
          <span className="u-label text-faint">Wall text — on the work</span>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-6 max-w-[20ch] text-balance font-display text-[clamp(2.2rem,1.2rem+4.4vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:max-w-[16ch]">
            You describe it. It gets{" "}
            <span className="iris-text iris-text-anim">built</span> — as something real.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-[58ch] text-pretty text-lead text-muted">
            Not a picture of a part. The part: precise, manufacturable geometry on a real
            kernel, with an editable history you can keep working. The artist is a model
            named <span className="text-ink">Archie</span>. The medium is geometry. The
            gallery is your own machine — and nothing leaves it.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
