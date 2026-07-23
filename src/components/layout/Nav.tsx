"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

const focus = "a-focus";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "border-b border-line bg-paper/70 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1660px] items-center justify-between gap-4 px-5 md:px-10">
        <Link href="/" aria-label="ArchDisc — home" className={cn("shrink-0 rounded-sm", focus)}>
          <Logo />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 sm:gap-6">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-sm font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink sm:text-[11.5px] sm:tracking-[0.14em]",
                  focus,
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span className="hidden items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft sm:inline-flex">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
            Coming soon
          </span>
        </div>
      </div>
    </header>
  );
}
