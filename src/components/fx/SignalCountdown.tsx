"use client";

import { useCountdown, pad2 } from "@/lib/launch";
import { cn } from "@/lib/utils";

/** Live countdown to public release. Flips to "SIGNAL LIVE" once the target
 *  passes. `inline` renders a compact DD:HH:MM:SS; default renders unit cells. */
export function SignalCountdown({
  inline = false,
  className,
}: {
  inline?: boolean;
  className?: string;
}) {
  const c = useCountdown();

  if (c.live) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.14em]",
          className,
        )}
      >
        <span className="signal-dot inline-block h-2 w-2 rounded-full bg-signal" aria-hidden />
        <span className="iris-text font-semibold">Signal live</span>
      </span>
    );
  }

  const cells: [number, string][] = [
    [c.days, "days"],
    [c.hours, "hrs"],
    [c.minutes, "min"],
    [c.seconds, "sec"],
  ];

  if (inline) {
    return (
      <span
        className={cn("font-mono text-[13px] tabular-nums tracking-[0.08em]", className)}
        aria-label={`${c.days} days ${c.hours} hours ${c.minutes} minutes to public signal`}
      >
        {c.pending
          ? "--:--:--:--"
          : `${pad2(c.days)}:${pad2(c.hours)}:${pad2(c.minutes)}:${pad2(c.seconds)}`}
      </span>
    );
  }

  return (
    <div className={cn("flex items-stretch gap-2 sm:gap-3", className)}>
      {cells.map(([n, label], i) => (
        <div
          key={label}
          className="flex min-w-[56px] flex-col items-center rounded-lg border border-line bg-surface/70 px-2.5 py-3 backdrop-blur-sm sm:min-w-[78px] sm:px-3"
        >
          <span className="u-stat tabular-nums text-ink" style={{ fontSize: "clamp(1.4rem,0.9rem+1.8vw,2.4rem)" }}>
            {c.pending ? "--" : pad2(i === 0 ? n : n)}
          </span>
          <span className="u-label mt-1.5 text-[9px] text-faint">{label}</span>
        </div>
      ))}
    </div>
  );
}
