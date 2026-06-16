import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { trust } from "@/lib/content";

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-12">
        <Reveal>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            {trust.label}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-0">
          {trust.items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.05}>
              <div className="h-full px-0 lg:border-l lg:border-line lg:px-6 lg:first:border-l-0 lg:first:pl-0">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink">
                  {it.label}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {it.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center font-mono text-[12px] text-muted">
            {trust.closing}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
