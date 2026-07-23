import { cn } from "@/lib/utils";

/** The ArchDisc pictorial mark — a bold A with a disc through its apex (A + Disc). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <circle cx="50" cy="40" r="40" fill="var(--color-coral)" stroke="var(--color-ink)" strokeWidth="4" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 5 L90 95 L66 95 L58.5 76 L41.5 76 L34 95 L10 95 Z M50 43 L41 67 L59 67 Z"
        fill="var(--color-ink)"
      />
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 overflow-visible text-ink", className)}>
      <LogoMark className={cn("h-10 w-10 shrink-0", markClassName)} />
      <span className="wordmark whitespace-nowrap pr-2 text-[21px] leading-none">ArchDisc</span>
    </span>
  );
}
