import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Vault } from "@/components/visual/Vault";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { BigWord } from "@/components/fx/BigWord";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

/** The darkened gallery room — the opening-night countdown. */
export function OpeningNight() {
  return (
    <Vault id="opening" className="py-28 md:py-36">
      <BigWord
        variant="outline"
        className="absolute left-1/2 top-6 -translate-x-1/2 text-[clamp(5rem,22vw,20rem)] opacity-70"
      >
        Opening
      </BigWord>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="u-label text-faint">Opening night</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-[16ch] text-balance text-h1 text-ink">
            The doors open once. Be on the other side of them.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10">
            <SignalCountdown />
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-8 max-w-[48ch] text-pretty text-lead text-muted">
            When the signal goes live, ArchDisc opens to the people holding clearance
            first. No launch email lottery — just the list, and the door.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-8">
            <Button href={ACCESS_URL} size="lg" variant="accent">
              {CLEARANCE_CTA}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Vault>
  );
}
