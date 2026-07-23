import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { footer } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t-[2.5px] border-ink bg-brown text-cream">
      <div className="mx-auto w-full max-w-[1300px] px-4 py-14 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="[&_.text-ink]:text-cream [&_.text-coral]:text-coral">
              <Logo />
            </span>
            <p className="mt-5 max-w-md font-display text-h2 font-extrabold leading-[0.95] text-cream">
              {footer.tagline}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-cream">
              <span className="h-1.5 w-1.5 rounded-full bg-lime bob" aria-hidden />
              {footer.pre}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start gap-4 md:items-end">
              <nav className="flex items-center gap-5">
                {footer.legal.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="a-focus font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-cream/80 underline-offset-4 hover:text-lime hover:underline"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-peach">
                {footer.bottomLine}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t-2 border-cream/30 pt-6 font-mono text-[12px] text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ArchDisc</p>
          <span className="uppercase tracking-[0.12em]">Describe it. Archie builds it.</span>
        </div>
      </div>
    </footer>
  );
}
