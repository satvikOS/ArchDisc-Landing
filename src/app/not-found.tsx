import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GradientField } from "@/components/visual/GradientField";
import { BigWord } from "@/components/fx/BigWord";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[72dvh] items-center overflow-hidden py-24">
      <GradientField intensity={0.9} />
      <BigWord
        variant="ghost"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(8rem,30vw,26rem)]"
      >
        Lost
      </BigWord>
      <Container className="relative text-center">
        <Reveal>
          <p className="u-label text-faint">Error · 404 · wrong corridor</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 text-balance text-display font-display font-semibold text-ink">
            This room isn&rsquo;t on the <span className="iris-text iris-text-anim">map</span>.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-[44ch] text-pretty text-lead text-muted">
            You&rsquo;ve wandered past a wall that doesn&rsquo;t exist yet. Most of the
            exhibition is still under cloth — here&rsquo;s the way back.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg" variant="secondary">Back to the entrance</Button>
            <Button href={ACCESS_URL} size="lg" variant="accent">{CLEARANCE_CTA}</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
