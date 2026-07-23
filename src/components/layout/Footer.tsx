import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { footer } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-paper-2">
      <div className="h-px w-full bg-clay/30" aria-hidden />
      <div className="mx-auto w-full max-w-[1300px] px-5 py-14 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo />
            <p className="mt-5 font-display text-h3 text-ink">{footer.tagline}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              {footer.pre}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <nav className="flex items-center gap-6">
              {footer.legal.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="a-focus font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <span className="u-spec font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {footer.bottomLine}
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-body-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ArchDisc</p>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
            Describe it. Archie builds it.
          </span>
        </div>
      </div>
    </footer>
  );
}
