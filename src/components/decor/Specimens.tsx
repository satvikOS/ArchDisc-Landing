import { cn } from "@/lib/utils";

/** Giant two-tone "Aa" letterform specimen — the signature gallery graphic. */
export function AaSpecimen({
  c1 = "var(--color-sage)",
  c2 = "var(--color-brown)",
  className,
}: {
  c1?: string;
  c2?: string;
  className?: string;
}) {
  return (
    <span className={cn("specimen select-none tracking-[-0.04em]", className)} aria-hidden>
      <span style={{ color: c1 }}>A</span>
      <span style={{ color: c2 }}>a</span>
    </span>
  );
}

/** Bold number specimen (e.g. binary "0110") — a graphic anchor. */
export function NumberSpecimen({
  n = "0110",
  className,
  style,
}: {
  n?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("specimen select-none tabular-nums tracking-[-0.03em]", className)}
      style={style}
      aria-hidden
    >
      {n}
    </span>
  );
}
