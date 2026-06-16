import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";

type Route = { kicker: string; verb: string; copy: string; href: string };

const ROUTES: Route[] = [
  {
    kicker: "STUDIO",
    verb: "Create",
    copy: "Full DCC: model, sculpt, animate, simulate, render.",
    href: "/studio",
  },
  {
    kicker: "FORGE",
    verb: "Engineer",
    copy: "Native-kernel parametric CAD, assemblies, FEA, drawings.",
    href: "/forge",
  },
  {
    kicker: "ARCHIE",
    verb: "The copilot",
    copy: "The local, open-weights model fleet that drives both.",
    href: "/archie",
  },
  {
    kicker: "PRECISION",
    verb: "The substance",
    copy: "Why the geometry is trustworthy and manufacturable.",
    href: "/precision",
  },
];

export function Explore() {
  return (
    <Section id="explore" className="relative isolate border-t border-line">
      <GenerativeGrid majorPitch={120} fade={64} />
      <Container className="relative">
        <Reveal>
          <span className="u-label flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
            GO DEEPER
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 text-balance text-h3 text-ink">
            Four ways into one machine.
          </h2>
        </Reveal>

        <div className="mt-10 border-t border-line">
          {ROUTES.map((r, i) => (
            <Reveal key={r.kicker} delay={i * 0.06}>
              <Link
                href={r.href}
                className="group flex items-center gap-5 border-b border-line py-6 transition-colors duration-200 hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper md:gap-8"
              >
                <span className="u-label w-24 shrink-0 text-ink md:w-32">
                  {r.kicker}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="text-h4 text-ink">{r.verb}</span>
                  <span className="text-body text-muted">{r.copy}</span>
                </span>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
