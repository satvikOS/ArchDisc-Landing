import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/icons";
import { ConstellationField } from "@/components/artifacts/ConstellationField";
import { GITHUB_URL } from "@/lib/site";

const ANCHORS = [
  { k: "Open code", v: "Read every line — the kernel, the app, the model harness." },
  { k: "Open weights", v: "Archie's per-discipline fleet ships with weights you can run." },
  { k: "Self-host", v: "Runs on your own machine. No cloud, no API keys, no lock-in." },
  { k: "Public release soon", v: "Pre-release today — star the repo to follow the launch." },
];

/** The single, shared open-source moment — used once per page (replaces the
 *  five duplicated dark open-source sections). */
export function OpenSourceStrip() {
  return (
    <Section id="open-source" className="border-t border-line">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="u-label inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
                Open source · public release soon
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h2 text-ink">
                Open code. Open weights. Yours to run.
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
              <Button href={GITHUB_URL} variant="secondary" className="mt-7">
                <GitHubIcon size={15} />
                Star on GitHub
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative hidden aspect-[5/4] w-full text-ink lg:block">
            <ConstellationField className="absolute inset-0 h-full w-full" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
