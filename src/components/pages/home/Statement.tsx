import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** The problem, in the deck's own voice. */
export function Statement() {
  return (
    <section className="border-y border-line bg-paper-2/60 py-24 md:py-32">
      <Container className="max-w-4xl">
        <Reveal>
          <span className="u-label text-clay">The problem</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-[18ch] text-balance font-display text-[clamp(2.2rem,1.2rem+4.6vw,4.6rem)] font-[800] leading-[0.94] tracking-[-0.04em] text-ink">
            Even experts lose hours to the simplest things.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-[58ch] text-pretty text-lead text-muted">
            A small bracket. A coffee mug. One little tool. Hours inside a CAD program, or a
            3D app, for something you pictured in seconds — and if you never trained for
            years, you can&rsquo;t even begin. So most ideas never get made.{" "}
            <span className="text-ink">We&rsquo;re here to change that.</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
