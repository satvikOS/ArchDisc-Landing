import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Shared section header: mono eyebrow → display h2 → optional lead.
 * The eyebrow always precedes the heading (the instrument↔display rhythm).
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <span
          className={cn(
            "u-label inline-flex items-center gap-2",
            dark && "text-white/55",
          )}
        >
          <span
            className={cn("h-1 w-1 rounded-full", dark ? "bg-white/40" : "bg-ink/40")}
            aria-hidden
          />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          className={cn(
            "mt-4 text-balance text-h2",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-pretty text-lead",
              dark ? "text-white/65" : "text-muted",
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
