import { cn } from "@/lib/utils";

/** The ArchDisc pictorial mark — a bold A with a disc through its apex (A + Disc). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <circle cx="50" cy="23" r="18" fill="var(--color-coral)" stroke="var(--color-ink)" strokeWidth="4.5" />
      <g stroke="var(--color-ink)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M22 86 L50 26 L78 86" />
        <line x1="34" y1="61" x2="66" y2="61" />
      </g>
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-[17px] font-extrabold tracking-[-0.02em]">
        Arch<span className="text-coral">Disc</span>
      </span>
    </span>
  );
}
