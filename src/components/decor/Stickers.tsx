/**
 * Sticker motifs — the maximalist collage vocabulary from the reference boards.
 * Each fills with `currentColor` (set text-<palette> on the parent) and outlines
 * in ink. Purely decorative → always aria-hidden.
 */
import type { SVGProps } from "react";

const INK = "var(--color-ink)";
type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: "0 0 100 100",
  "aria-hidden": true as const,
  ...p,
});

export function Asterisk(p: P) {
  return (
    <svg {...base(p)}>
      <g stroke="currentColor" strokeWidth="15" strokeLinecap="round">
        <line x1="50" y1="8" x2="50" y2="92" />
        <line x1="8" y1="50" x2="92" y2="50" />
        <line x1="20" y1="20" x2="80" y2="80" />
        <line x1="80" y1="20" x2="20" y2="80" />
      </g>
    </svg>
  );
}

export function DieDots(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="6" y="6" width="88" height="88" rx="16" fill="currentColor" stroke={INK} strokeWidth="5" />
      {[
        [32, 32],
        [68, 32],
        [32, 68],
        [68, 68],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill={INK} />
      ))}
    </svg>
  );
}

export function Flower(p: P) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg {...base(p)}>
      {petals.map((a) => (
        <ellipse
          key={a}
          cx="50"
          cy="26"
          rx="15"
          ry="24"
          fill="currentColor"
          stroke={INK}
          strokeWidth="4"
          transform={`rotate(${a} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill={INK} />
    </svg>
  );
}

export function Sparkle(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M50 4 C58 34 66 42 96 50 C66 58 58 66 50 96 C42 66 34 58 4 50 C34 42 42 34 50 4 Z"
        fill="currentColor"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowSquiggle(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M8 70 C8 40 40 40 50 55 C60 70 92 68 92 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path d="M78 40 L92 30 L96 48" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Zigzag(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M6 30 L30 70 L54 30 L78 70 L94 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Clover(p: P) {
  return (
    <svg {...base(p)}>
      <g fill="currentColor" stroke={INK} strokeWidth="4">
        <circle cx="34" cy="34" r="24" />
        <circle cx="66" cy="34" r="24" />
        <circle cx="34" cy="66" r="24" />
        <circle cx="66" cy="66" r="24" />
      </g>
    </svg>
  );
}

export function Bolt(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M58 6 L26 54 L46 54 L40 94 L74 42 L52 42 Z"
        fill="currentColor"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Target(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
  );
}

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, a: number) =>
  `${(cx + r * Math.cos(rad(a))).toFixed(2)} ${(cy + r * Math.sin(rad(a))).toFixed(2)}`;

/** Segmented pinwheel — alternating filled wedges (currentColor) on ink. */
export function Pinwheel(p: P) {
  const segs = 10;
  const wedges = [];
  for (let i = 0; i < segs; i += 2) {
    const a0 = (i / segs) * 360;
    const a1 = ((i + 1.15) / segs) * 360;
    wedges.push(`M50 50 L${pt(50, 50, 46, a0)} A46 46 0 0 1 ${pt(50, 50, 46, a1)} Z`);
  }
  return (
    <svg {...base(p)}>
      <circle cx="50" cy="50" r="47" fill={INK} />
      {wedges.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
      <circle cx="50" cy="50" r="10" fill={INK} />
    </svg>
  );
}

/** Concentric target rings — currentColor + ink, from the reference boards. */
export function Concentric(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="50" cy="50" r="47" fill="currentColor" stroke={INK} strokeWidth="4" />
      <circle cx="50" cy="50" r="34" fill={INK} />
      <circle cx="50" cy="50" r="22" fill="currentColor" />
      <circle cx="50" cy="50" r="10" fill={INK} />
    </svg>
  );
}

/** Hexagon with a center dot. */
export function Hexagon(p: P) {
  const d = [0, 60, 120, 180, 240, 300].map((a) => pt(50, 50, 46, a - 90)).join(" L ");
  return (
    <svg {...base(p)}>
      <path d={`M ${d} Z`} fill="currentColor" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="10" fill={INK} />
    </svg>
  );
}

/** Checkerboard tile grid — two palette colors via props. */
export function Checker({ n = 4, a = "var(--color-ink)", b = "transparent", ...p }: P & { n?: number; a?: string; b?: string }) {
  const s = 100 / n;
  const cells = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      cells.push(<rect key={`${x}-${y}`} x={x * s} y={y * s} width={s} height={s} fill={(x + y) % 2 ? a : b} />);
  return <svg {...base(p)}>{cells}</svg>;
}

export const STICKERS = {
  Asterisk, DieDots, Flower, Sparkle, ArrowSquiggle, Zigzag, Clover, Bolt, Target,
  Pinwheel, Concentric, Hexagon, Checker,
};
