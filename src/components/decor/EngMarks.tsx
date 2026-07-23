/**
 * Engineering / drafting marks — real drawing language (dimension lines, datum
 * flags, hatching). Ink strokes, transparent ground, aria-hidden.
 */
import type { SVGProps } from "react";

const INK = "currentColor";

/** Horizontal dimension line with end ticks and a Ø label. */
export function DimLine({ label = "Ø90", ...p }: SVGProps<SVGSVGElement> & { label?: string }) {
  return (
    <svg viewBox="0 0 160 36" fill="none" aria-hidden {...p}>
      <g stroke={INK} strokeWidth="1.8">
        <line x1="6" y1="24" x2="154" y2="24" />
        <line x1="6" y1="14" x2="6" y2="32" />
        <line x1="154" y1="14" x2="154" y2="32" />
        <path d="M14 21 L6 24 L14 27" fill="none" />
        <path d="M146 21 L154 24 L146 27" fill="none" />
      </g>
      <text x="80" y="14" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill={INK}>
        {label}
      </text>
    </svg>
  );
}

/** Datum flag — a leader with a boxed letter. */
export function DatumFlag({ letter = "A", ...p }: SVGProps<SVGSVGElement> & { letter?: string }) {
  return (
    <svg viewBox="0 0 90 60" fill="none" aria-hidden {...p}>
      <g stroke={INK} strokeWidth="1.8">
        <line x1="6" y1="52" x2="42" y2="24" />
        <path d="M2 48 L6 52 L10 46" fill={INK} />
        <rect x="42" y="10" width="28" height="26" />
      </g>
      <text x="56" y="29" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="16" fontWeight="700" fill={INK}>
        {letter}
      </text>
    </svg>
  );
}

/** Section-cut hatched triangle. */
export function HatchTri(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden {...p}>
      <path d="M4 96 L96 96 L96 8 Z" stroke={INK} strokeWidth="2.2" />
      <g stroke={INK} strokeWidth="1.4">
        <line x1="24" y1="96" x2="96" y2="27" />
        <line x1="44" y1="96" x2="96" y2="46" />
        <line x1="64" y1="96" x2="96" y2="65" />
        <line x1="84" y1="96" x2="96" y2="84" />
      </g>
    </svg>
  );
}

/** Centerline cross — the machinist's mark. */
export function CenterMark(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden {...p}>
      <g stroke={INK} strokeWidth="1.8">
        <circle cx="40" cy="40" r="26" strokeDasharray="10 5 2 5" />
        <line x1="40" y1="4" x2="40" y2="76" strokeDasharray="12 5 3 5" />
        <line x1="4" y1="40" x2="76" y2="40" strokeDasharray="12 5 3 5" />
      </g>
    </svg>
  );
}
