"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

function SoonChip() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
      <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
      Coming soon
    </span>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-line bg-paper/80 backdrop-blur-xl" : "border-line/50 bg-paper/60 backdrop-blur-md",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="ArchDisc — home" className={cn("shrink-0 rounded-sm", focusRing)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "relative rounded-sm font-mono text-[12px] uppercase tracking-[0.12em] transition-colors",
                focusRing,
                isActive(l.href) ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {l.label}
              {isActive(l.href) && (
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-clay" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <SoonChip />
        </div>

        <button
          type="button"
          className={cn("-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink md:hidden", focusRing)}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="mobile-nav"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {open && (
        <div id="mobile-nav" ref={panelRef} className="border-t border-line bg-paper md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-sm px-2 py-2.5 font-mono text-[13px] uppercase tracking-[0.12em] transition-colors",
                  focusRing,
                  isActive(l.href) ? "text-ink" : "text-ink-soft hover:bg-ink/[0.04]",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 px-2">
              <SoonChip />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
