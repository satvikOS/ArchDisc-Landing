import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A small mono "instrument" chip — designation tags, status pills, codenames. */
export function Chip({
  children,
  tone = "line",
  className,
}: {
  children: ReactNode;
  tone?: "line" | "signal" | "iris" | "solid";
  className?: string;
}) {
  const tones: Record<string, string> = {
    line: "border border-line text-muted",
    signal: "border border-signal/35 text-signal",
    iris: "border border-iris-magenta/35 text-iris-magenta",
    solid: "bg-ink text-paper",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
