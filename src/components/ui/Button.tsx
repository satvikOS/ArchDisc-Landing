import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris-magenta/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(12,19,34,0.5)]",
  // The one bold move — iridescent fill with a soft glow on hover.
  accent:
    "iris-fill text-white [background-size:160%_160%] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(216,60,200,0.55)]",
  secondary:
    "border border-line-strong bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_10px_30px_-16px_rgba(12,19,34,0.4)]",
  ghost: "text-ink-soft hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
