"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { nav, APP_URL } from "@/lib/content";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: close on Escape, move focus to the first link on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="#top"
          aria-label="ArchDisc — home"
          className={cn("shrink-0 rounded-[2px]", focusRing)}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-[2px] text-[14px] text-muted transition-colors hover:text-ink",
                focusRing,
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Button href={APP_URL} size="sm">
            {nav.cta}
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-[2px] text-ink md:hidden",
            focusRing,
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="mobile-nav"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="border-t border-line bg-paper md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-[2px] px-2 py-2.5 text-[15px] text-ink-soft transition-colors hover:bg-ink/[0.03]",
                  focusRing,
                )}
              >
                {l.label}
              </Link>
            ))}
            <Button href={APP_URL} className="mt-3 w-full">
              {nav.cta}
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
