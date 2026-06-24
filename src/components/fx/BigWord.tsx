import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "fill" | "outline" | "ink" | "ghost";

/**
 * A funnily-enlarged word — exhibition-poster graphic type. Decorative by
 * default (aria-hidden, non-selectable): drop it at a section edge, rotate it,
 * let it bleed. Placement/rotation come from `className` at the call site.
 */
export function BigWord({
  children,
  variant = "outline",
  rotate,
  className,
  decorative = true,
}: {
  children: ReactNode;
  variant?: Variant;
  rotate?: number;
  className?: string;
  decorative?: boolean;
}) {
  const variants: Record<Variant, string> = {
    fill: "iris-text",
    ink: "text-ink",
    ghost: "text-ink/[0.05]",
    outline: "text-transparent",
  };

  const outlineStyle =
    variant === "outline"
      ? ({
          WebkitTextStroke: "1.5px color-mix(in srgb, var(--color-ink) 32%, transparent)",
        } as React.CSSProperties)
      : undefined;

  return (
    <span
      aria-hidden={decorative || undefined}
      className={cn(
        "pointer-events-none select-none font-display font-extrabold uppercase leading-[0.82] tracking-[-0.03em]",
        "text-[clamp(3.5rem,12vw,11rem)]",
        variants[variant],
        className,
      )}
      style={{
        ...outlineStyle,
        ...(rotate ? { transform: `rotate(${rotate}deg)` } : null),
      }}
    >
      {children}
    </span>
  );
}
