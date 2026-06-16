import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { GitHubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { footer, APP_URL, GITHUB_URL, CTA } from "@/lib/site";

export function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-body-sm leading-relaxed text-muted">
              {footer.brand}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-[2px] border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-ink/50" aria-hidden />
              {footer.pre}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button href={APP_URL} size="sm">
                {CTA}
              </Button>
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
                      {...("external" in l && l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex items-center gap-1.5 text-body-sm text-muted transition-colors hover:text-ink"
                    >
                      {col.title === "Open source" && l.label === "GitHub" && (
                        <GitHubIcon size={13} />
                      )}
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
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono transition-colors hover:text-ink"
          >
            <GitHubIcon size={13} />
            {footer.bottomLine}
          </a>
        </div>
      </Container>
    </footer>
  );
}
