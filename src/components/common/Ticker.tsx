import { Marquee } from "@/components/fx/Marquee";
import { cn } from "@/lib/utils";

const DEFAULT = [
  "On view soon",
  "Forge",
  "Studio",
  "Archie",
  "A private viewing",
  "By clearance only",
  "Describe it · it gets built",
  "Nothing leaves your machine",
];

/** A running exhibition strip — the marquee of an unopened show. */
export function Ticker({
  items = DEFAULT,
  className,
}: {
  items?: string[];
  className?: string;
}) {
  return (
    <div className={cn("border-y border-line bg-surface py-3.5", className)}>
      <Marquee duration={38}>
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span className="font-display text-[15px] font-medium uppercase tracking-[0.04em] text-ink/80">
              {t}
            </span>
            <span className="iris-fill h-1.5 w-1.5 rounded-full" aria-hidden />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
