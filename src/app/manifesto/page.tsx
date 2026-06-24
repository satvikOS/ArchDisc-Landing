import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { Vault } from "@/components/visual/Vault";
import { BigWord } from "@/components/fx/BigWord";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

const TITLE = "Manifesto — why the cloth stays on";
const DESCRIPTION =
  "ArchDisc is one idea in three parts — Forge, Studio, and Archie. We build the thing, not the demo of the thing: real geometry, run locally, opened when it's worth standing in front of.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/manifesto" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/manifesto" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const STATEMENTS = [
  "ArchDisc is one idea in three parts. Forge makes real geometry. Studio makes the world around it. Archie — the model — is the hand that moves between them, turning what you say into what gets built. Apart, they're tools. Together, they're a way of working.",
  "Design software has spent forty years asking people to translate themselves into menus. We think the machine should meet you where you think — in plain language — and hand back something real: a solid you could machine, a scene you could ship. Not a picture of the answer. The answer.",
  "So why can't you see it yet? Because a private viewing is a promise. The work goes up when it's worth standing in front of — when the kernel doesn't lie, when the model stops surprising us in the wrong ways, when the room is finished. We'd rather be late and real than early and fake.",
  "Everything runs on your machine. Nothing you make leaves it. It's free to use — we build and keep the technology; you make things with it. That's the whole arrangement, and it isn't going to change.",
];

const PRINCIPLES = [
  { t: "Real over rendered", b: "Geometry you can actually build — not images of it." },
  { t: "Local over cloud", b: "It runs where your work lives. Nothing leaves the machine." },
  { t: "Plain language over menus", b: "Describe it; the tools move. The menu was never the point." },
  { t: "Late and real over early and fake", b: "We open the doors when it's worth walking through them." },
  { t: "Free to use", b: "Make things with it. We keep the lights on and the kernel honest." },
];

export default function ManifestoPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <BigWord variant="ghost" className="absolute -top-2 left-1/2 -translate-x-1/2 text-[clamp(5rem,22vw,20rem)]">
          Manifesto
        </BigWord>
        <Container className="relative">
          <Reveal>
            <Chip tone="iris">Manifesto · why the cloth stays on</Chip>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-[18ch] text-balance text-display font-display font-semibold leading-[0.96] text-ink">
              We&rsquo;re building the thing, not the{" "}
              <span className="iris-text iris-text-anim">demo</span> of the thing.
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden border-y border-line bg-paper-2/50 py-24 md:py-32">
        <Container className="relative max-w-3xl">
          <div className="space-y-10">
            {STATEMENTS.map((s, i) => (
              <Reveal key={i} delay={Math.min(i * 0.04, 0.16)}>
                <p
                  className={
                    i === 0
                      ? "text-balance font-display text-[clamp(1.6rem,1.1rem+2.2vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
                      : "text-pretty text-lead text-ink-soft"
                  }
                >
                  {s}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <BigWord variant="outline" rotate={-90} className="absolute -left-10 top-1/2 hidden -translate-y-1/2 text-[clamp(3rem,8vw,7rem)] lg:block">
          Real
        </BigWord>
        <Container className="relative">
          <Reveal>
            <span className="u-label text-faint">What we hold to</span>
          </Reveal>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={Math.min(i * 0.05, 0.25)}>
                <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-10">
                  <h3 className="font-display text-h3 text-ink sm:w-[34%] sm:shrink-0">{p.t}</h3>
                  <p className="text-pretty text-lead text-muted">{p.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Vault className="py-28 md:py-36">
        <BigWord variant="outline" className="absolute left-1/2 top-8 -translate-x-1/2 text-[clamp(5rem,20vw,18rem)] opacity-70">
          Soon
        </BigWord>
        <Container className="relative flex flex-col items-center text-center">
          <Reveal>
            <h2 className="max-w-[16ch] text-balance text-h1 text-ink">The cloth comes off soon.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10"><SignalCountdown /></div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8">
              <Button href={ACCESS_URL} size="lg" variant="accent">{CLEARANCE_CTA}</Button>
            </div>
          </Reveal>
        </Container>
      </Vault>
    </>
  );
}
