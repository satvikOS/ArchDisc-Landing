import { cn } from "@/lib/utils";

/** The ArchDisc mark — an arch standing inside a disc, with a blueprint-accent
 *  keystone. Monoline, inherits currentColor for the ring + arch. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-[26px] w-[26px]", className)}
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M10.5 22.5 V15.5 A5.5 5.5 0 0 1 21.5 15.5 V22.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="10" r="1.7" fill="var(--color-clay)" />
    </svg>
  );
}

/** Mark + wordmark lockup. The "Disc" half carries the blueprint accent. */
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
      <span className="font-display text-[15.5px] font-semibold tracking-[-0.02em]">
        Arch<span className="text-clay">Disc</span>
      </span>
    </span>
  );
}
