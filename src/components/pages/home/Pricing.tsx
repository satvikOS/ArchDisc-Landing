import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const TIERS = [
  {
    name: "Free",
    price: "$0, always",
    who: "Individuals · students · dreamers",
    body: "Both apps and the full model on your machine. Build anything. The source stays ours.",
    feature: true,
  },
  {
    name: "Pro",
    price: "Monthly",
    who: "Serious creators",
    body: "Cloud compute and storage. Render bigger, build beyond your laptop, your work synced everywhere.",
    feature: false,
  },
  {
    name: "Enterprise",
    price: "Let's talk",
    who: "Studios & teams",
    body: "Shared projects, private deployment, security, support, and custom models trained for your work.",
    feature: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <span className="u-label text-clay">Pricing</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-balance text-h1 text-ink">Free to dream. Pay to grow.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[48ch] text-pretty text-lead text-muted">
              The same idea as GitHub and Vercel. Free to use for anyone creating on their
              own — you pay only as your work outgrows one machine.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <Reveal key={t.name}>
              <div
                className={
                  "flex h-full flex-col rounded-2xl border p-7 " +
                  (t.feature
                    ? "border-transparent bg-ink text-paper"
                    : "border-line-strong bg-surface text-ink")
                }
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-h3 font-[700]">{t.name}</span>
                  <span className={"font-mono text-[12px] uppercase tracking-[0.12em] " + (t.feature ? "text-clay-soft" : "text-clay")}>
                    {t.price}
                  </span>
                </div>
                <p className={"mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] " + (t.feature ? "text-paper/55" : "text-faint")}>
                  {t.who}
                </p>
                <p className={"mt-5 text-pretty text-body-sm " + (t.feature ? "text-paper/80" : "text-muted")}>
                  {t.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
