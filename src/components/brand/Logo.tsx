import { cn } from "@/lib/utils";

/** The ArchDisc mark — a Greek temple arch set within a disc. Monoline, inherits currentColor. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={cn("h-[26px] w-[26px]", className)}
    >
      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth={5} />
      <g
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M36 45 A12 12 0 0 0 60 45" />
        <path d="M36 45 V66" />
        <path d="M60 45 V66" />
        <path d="M30 66 H66" />
      </g>
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <LogoMark className={markClassName} />
      <span className="text-[15px] font-semibold tracking-tight">ArchDisc</span>
    </span>
  );
}
