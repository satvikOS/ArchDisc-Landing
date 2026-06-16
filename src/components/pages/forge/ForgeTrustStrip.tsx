import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const CLAIMS: { label: string; body: string }[] = [
  {
    label: "Native kernel",
    body: "OpenCASCADE 7.9.3, compiled from source as forge-kernel.node. Real B-rep solids — no WASM in the geometry path.",
  },
  {
    label: "Real constraints",
    body: "A planegcs sketch solver with full degrees-of-freedom tracking — fully constrained means fully constrained.",
  },
  {
    label: "Real scale",
    body: "Organized assemblies past 100,000 components — packed into structure, not confetti.",
  },
  {
    label: "Open stack",
    body: "Open code and open model weights. Read it, self-host it, own it. No lock-in.",
  },
];

const CLOSING = "Native math · real solids · open source · runs on your machine.";

export function ForgeTrustStrip() {
  return (
    <section className="relative border-y border-line bg-surface">
      <Container className="py-12 md:py-14">
        <div className="grid gap-px overflow-hidden bg-line sm:grid-cols-2 md:grid-cols-4">
          {CLAIMS.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <div className="flex h-full flex-col bg-surface px-0 sm:px-6 md:px-7">
                <p className="u-label text-ink">{c.label}</p>
                <p className="mt-3 text-body-sm leading-relaxed text-muted">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="u-spec mt-10 text-center text-faint">{CLOSING}</p>
        </Reveal>
      </Container>
    </section>
  );
}
