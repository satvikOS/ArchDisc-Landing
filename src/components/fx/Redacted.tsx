"use client";

import { useState } from "react";
import { useDecrypt } from "@/lib/decrypt";
import { cn } from "@/lib/utils";

/**
 * An interactive classified value: reads as a row of redaction bars until you
 * hover, focus, or tap it — then it decrypts to reveal the real value. Used for
 * the "specs you can decode" parts of the coming-soon dossiers.
 */
export function Redacted({
  value,
  className,
  revealLabel = "decrypt",
}: {
  value: string;
  className?: string;
  revealLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const out = useDecrypt(value, { active: open, duration: 650 });

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? value : `${value} — ${revealLabel}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className={cn(
        "group/redact relative inline-flex items-center gap-2 rounded-sm align-middle font-mono text-[13px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris-magenta/40",
        className,
      )}
    >
      {open ? (
        <span className="u-cipher text-ink" aria-hidden>
          {out}
        </span>
      ) : (
        <>
          <span
            aria-hidden
            className="inline-flex items-center gap-[3px]"
            style={{ filter: "blur(0.2px)" }}
          >
            {Array.from({ length: Math.min(value.length, 14) }).map((_, i) => (
              <span
                key={i}
                className="inline-block h-[0.95em] rounded-[1px] bg-ink/65 transition-colors group-hover/redact:bg-iris-magenta/70"
                style={{ width: `${0.45 + ((i * 7) % 5) * 0.12}em` }}
              />
            ))}
          </span>
          <span className="u-label text-[9px] text-faint opacity-70" aria-hidden>
            {revealLabel}
          </span>
        </>
      )}
    </button>
  );
}
