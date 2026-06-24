import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A bold word-chip / tag — Cohere-style rounded pill. */
export function Chip({
  children,
  tone = "line",
  className,
}: {
  children: ReactNode;
  tone?: "line" | "coral" | "forest" | "solid" | "iris" | "signal";
  className?: string;
}) {
  const tones: Record<string, string> = {
    line: "border border-line-strong bg-surface text-ink-soft",
    coral: "border border-coral/30 bg-coral/10 text-coral-deep",
    iris: "border border-coral/30 bg-coral/10 text-coral-deep",
    forest: "border border-forest/25 bg-forest/10 text-forest",
    signal: "border border-forest/25 bg-forest/10 text-forest",
    solid: "bg-ink text-paper",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
