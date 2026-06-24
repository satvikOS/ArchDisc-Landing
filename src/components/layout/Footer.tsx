import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { footer, ACCESS_URL, CLEARANCE_CTA } from "@/lib/site";

export function Footer() {
  const year = 2026;

  return (
    <footer className="relative border-t border-line bg-surface">
      <div className="h-1 w-full bg-coral" aria-hidden />
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 font-display text-h4 text-ink">{footer.tagline}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
              {footer.pre}
            </p>
            <div className="mt-6">
              <Button href={ACCESS_URL} size="sm" variant="accent">
                {CLEARANCE_CTA}
              </Button>
            </div>
            <div className="mt-6">
              <span className="u-label text-faint">Opens in</span>
              <div className="mt-2">
                <SignalCountdown inline className="text-ink" />
              </div>
            </div>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="u-label">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center text-body-sm text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-body-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} ArchDisc <span className="mx-1 text-line-strong">·</span>{" "}
            {footer.attribution}
          </p>
          <span className="inline-flex items-center gap-1.5 font-mono">
            {footer.bottomLine}
          </span>
        </div>
      </Container>
    </footer>
  );
}
