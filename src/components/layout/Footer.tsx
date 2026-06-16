import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { footer, APP_URL, nav } from "@/lib/content";

export function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              {footer.brand}
            </p>
            <Button href={APP_URL} size="sm" className="mt-6">
              {nav.cta}
            </Button>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} ArchDisc{" "}
            <span className="mx-1 text-line-strong">·</span> {footer.attribution}
          </p>
          <p className="font-mono">{footer.bottomLine}</p>
        </div>
      </Container>
    </footer>
  );
}
