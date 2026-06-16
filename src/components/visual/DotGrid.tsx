import { cn } from "@/lib/utils";

/** Faint dot-grid plane that vignettes to near-white at the edges. */
export function DotGrid({
  className,
  size = 24,
  fade = 70,
}: {
  className?: string;
  size?: number;
  fade?: number;
}) {
  const mask = `radial-gradient(ellipse 82% 72% at 50% 38%, black 8%, transparent ${fade}%)`;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage:
          "radial-gradient(var(--color-line-strong) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        opacity: 0.55,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
