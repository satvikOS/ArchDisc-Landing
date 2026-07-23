"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-[2.5px] border-ink bg-cream">
      <div className="mx-auto flex h-[76px] w-full max-w-[1660px] items-center justify-between gap-4 overflow-visible px-4 md:px-8">
        <Link href="/" aria-label="ArchDisc — home" className="a-focus shrink-0 rounded-sm">
          <Logo />
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <nav className="flex items-center gap-2 sm:gap-2.5">
            {nav.links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "a-focus nb-2 nb-hover hidden px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.1em] text-ink sm:inline-block",
                  i === 0 ? "bg-lime" : "bg-sky",
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span className="nb-2 inline-flex items-center bg-coral px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.1em] text-ink">
            Coming soon
          </span>
        </div>
      </div>
    </header>
  );
}
