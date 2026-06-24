import type { ReactNode } from "react";
import { GradientField } from "@/components/visual/GradientField";
import { cn } from "@/lib/utils";

/**
 * A darkened gallery room. Sets data-theme="vault" so every token-driven
 * utility (text-ink, bg-paper, border-line …) inverts to the dark palette,
 * and lays an iridescent light installation behind the content.
 */
export function Vault({
  children,
  className,
  field = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  field?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-theme="vault"
      className={cn(
        "relative isolate scroll-mt-24 overflow-hidden bg-paper text-ink-soft",
        className,
      )}
    >
      {field && <GradientField tone="vault" intensity={0.65} />}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}
