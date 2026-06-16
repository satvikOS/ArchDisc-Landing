import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const ANCHORS: { href: string; label: string }[] = [
  { href: "#kernel", label: "the kernel ↓" },
  { href: "#math", label: "the math ↓" },
  { href: "#export", label: "the export ↓" },
];

export function Thesis() {
  return (
    <Section id="thesis" className="py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-[64ch] border-y border-line py-12 text-center md:py-14">
          <Reveal>
            <p className="text-pretty text-lead text-ink-soft">
              Most text-to-CAD asks you to trust a screenshot. This page does
              the opposite — every claim below is a checkable fact, and the
              kernel, the math, and the model weights are all open for you to
              read.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {ANCHORS.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="u-label rounded-[2px] text-muted transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  {a.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
