/**
 * One-off composed art tiles — each used exactly once. Vocabulary from the
 * reference boards: quarter-targets dissolving into pixels, bar-stripe blocks,
 * giant circle grids, pixel steps, and design-tool selection handles.
 */
import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** Quarter-target anchored top-right, dissolving into checker pixels bottom-left.
 *  Continuous geometry ↔ discrete guesses — the probabilistic→deterministic story. */
export function QuarterTargetPixel(p: P) {
  const px = 25; // pixel cell
  const cells: [number, number, string][] = [
    [0, 150, "var(--color-ink)"],
    [25, 150, "var(--color-cream)"],
    [0, 175, "var(--color-ink-mute)"],
    [25, 175, "var(--color-ink)"],
    [50, 150, "var(--color-peri)"],
    [50, 125, "var(--color-olive)"],
    [25, 125, "var(--color-peri)"],
    [0, 125, "var(--color-cream)"],
    [75, 125, "var(--color-lime)"],
    [75, 100, "var(--color-olive)"],
    [50, 100, "var(--color-lime)"],
    [25, 100, "var(--color-olive)"],
    [100, 100, "var(--color-sky)"],
    [100, 75, "var(--color-lime)"],
    [75, 75, "var(--color-sky)"],
  ];
  return (
    <svg viewBox="0 0 200 200" aria-hidden {...p}>
      <rect width="200" height="200" fill="var(--color-cream)" />
      <g>
        <circle cx="200" cy="0" r="200" fill="var(--color-olive)" />
        <circle cx="200" cy="0" r="150" fill="var(--color-lime)" />
        <circle cx="200" cy="0" r="100" fill="var(--color-sky)" />
        <circle cx="200" cy="0" r="50" fill="var(--color-ink-mute)" />
      </g>
      {/* pixel dissolve corner */}
      <rect x="0" y="100" width="100" height="100" fill="var(--color-cream)" />
      {cells.map(([x, y, f], i) => (
        <rect key={i} x={x} y={y} width={px} height={px} fill={f} />
      ))}
    </svg>
  );
}

/** Bar-stripe block — orange bars of uneven length on brown, selection dots. */
export function BarcodeBars(p: P) {
  const bars = [86, 70, 92, 58, 78, 88, 64, 82, 50, 90];
  return (
    <svg viewBox="0 0 200 200" aria-hidden {...p}>
      <rect width="200" height="200" fill="var(--color-sage)" />
      <rect x="18" y="18" width="164" height="164" fill="var(--color-brown)" />
      {bars.map((w, i) => (
        <rect key={i} x="30" y={30 + i * 14.5} width={(w / 100) * 140} height="9" fill="var(--color-coral)" />
      ))}
      {[
        [18, 18],
        [182, 18],
        [18, 182],
        [182, 182],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="var(--color-peri)" />
      ))}
    </svg>
  );
}

/** Giant circle grid — touching circles, negative-space diamonds. */
export function CircleGridTile(p: P) {
  const cs: ReactNode[] = [];
  for (let y = 0; y < 3; y++)
    for (let x = 0; x < 3; x++)
      cs.push(<circle key={`${x}-${y}`} cx={x * 66 + 34} cy={y * 66 + 34} r="33" fill="var(--color-lime)" />);
  return (
    <svg viewBox="0 0 200 200" aria-hidden {...p}>
      <rect width="200" height="200" fill="var(--color-lav)" />
      {cs}
    </svg>
  );
}

/** Pixel steps — olive stairs on periwinkle. */
export function PixelSteps(p: P) {
  const steps: ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    steps.push(
      <rect key={i} x={100 - i * 25} y={i * 25} width={25 + i * 25} height="25" fill="var(--color-olive)" />,
    );
  }
  return (
    <svg viewBox="0 0 200 200" aria-hidden {...p}>
      <rect width="200" height="200" fill="var(--color-peri)" />
      <g transform="translate(38 38)">{steps}</g>
    </svg>
  );
}

/** Design-tool selection frame — thin border + corner handles around content. */
export function SelectionFrame({
  children,
  color = "var(--color-peri)",
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  const handle = "absolute h-3 w-3 border-2 border-ink";
  return (
    <div className={className}>
      <div className="pointer-events-none absolute inset-3 border-2" style={{ borderColor: color }} aria-hidden>
        <span className={`${handle} -left-1.5 -top-1.5`} style={{ backgroundColor: color }} />
        <span className={`${handle} -right-1.5 -top-1.5`} style={{ backgroundColor: color }} />
        <span className={`${handle} -bottom-1.5 -left-1.5`} style={{ backgroundColor: color }} />
        <span className={`${handle} -bottom-1.5 -right-1.5`} style={{ backgroundColor: color }} />
      </div>
      {children}
    </div>
  );
}
