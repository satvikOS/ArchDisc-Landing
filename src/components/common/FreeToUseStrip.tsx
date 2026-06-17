import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ConstellationField } from "@/components/artifacts/ConstellationField";
import { APP_URL } from "@/lib/site";

const ANCHORS = [
  { k: "Free to use", v: "Create on your own machine at no cost — no metered API, no per-token bill." },
  { k: "Local & private", v: "Inference runs on-device. Your prompts and your geometry never leave the machine." },
  { k: "We build & maintain", v: "ArchDisc builds and ships the kernel, the app, and the model fleet — you just create." },
  { k: "Public release soon", v: "Pre-release today — pre-release access, with the public launch coming soon." },
];

/** The single, shared free-to-use moment — used once per page (replaces the
 *  five duplicated dark sections). ArchDisc is free to use, local, and private;
 *  the team builds and maintains the tech. */
export function FreeToUseStrip() {
  return (
    <Section id="free-to-use" className="border-t border-line">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="u-label inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
                Free to use · public release soon
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h2 text-ink">
                Free to use. Local and private. Built and maintained by us.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mt-8 grid gap-px overflow-hidden rounded-[2px] border border-line bg-line sm:grid-cols-2">
                {ANCHORS.map((a) => (
                  <div key={a.k} className="bg-surface p-4">
                    <dt className="u-label text-ink">{a.k}</dt>
                    <dd className="mt-1.5 text-body-sm leading-relaxed text-muted">
                      {a.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.15}>
              <Button href={APP_URL} variant="secondary" className="mt-7">
                Open ArchDisc
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative hidden aspect-[5/4] w-full text-ink lg:block">
            <ConstellationField ambient className="absolute inset-0 h-full w-full" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
