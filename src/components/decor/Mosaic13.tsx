/** Board-13 literal template: a full-bleed butted patchwork of RICH fields —
 *  checker strips, hatched panels, quarter-ring targets, pixel runs, bars,
 *  specimen glyphs. No plain geometry. Used as faded section backgrounds. */
export function Mosaic13({ mix = 0, className }: { mix?: number; className?: string }) {
  const P = [
    ["var(--color-sage)", "var(--color-coral)", "var(--color-peri)", "var(--color-lime)", "var(--color-brown)", "var(--color-gold)", "var(--color-lav)", "var(--color-magenta)"],
    ["var(--color-violet)", "var(--color-gold)", "var(--color-sage)", "var(--color-sky)", "var(--color-coral)", "var(--color-lime)", "var(--color-brown)", "var(--color-peri)"],
    ["var(--color-brown)", "var(--color-lime)", "var(--color-magenta)", "var(--color-gold)", "var(--color-peri)", "var(--color-sage)", "var(--color-coral)", "var(--color-sky)"],
  ][mix % 3];
  const [c0, c1, c2, c3, c4, c5, c6, c7] = P;
  const id = `m13-${mix}`;
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <pattern id={`${id}h`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill={c0} />
          <rect width="4" height="14" fill={c6} />
        </pattern>
        <pattern id={`${id}c`} width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="25" height="25" fill={c4} />
          <rect x="25" y="25" width="25" height="25" fill={c4} />
          <rect x="25" width="25" height="25" fill={c3} />
          <rect y="25" width="25" height="25" fill={c3} />
        </pattern>
      </defs>
      {/* butted fields */}
      <rect x="0" y="0" width="300" height="300" fill={c0} />
      <rect x="0" y="300" width="300" height="200" fill={`url(#${id}h)`} />
      <rect x="300" y="0" width="260" height="200" fill={c1} />
      <rect x="300" y="200" width="260" height="300" fill={c2} />
      <rect x="560" y="0" width="120" height="500" fill={`url(#${id}c)`} />
      <rect x="680" y="0" width="320" height="260" fill={c5} />
      <rect x="680" y="260" width="320" height="240" fill={c6} />
      <rect x="1000" y="0" width="200" height="500" fill={c7} />
      {/* quarter-ring target */}
      <g>
        <circle cx="300" cy="200" r="170" fill={c3} />
        <circle cx="300" cy="200" r="120" fill={c1} />
        <circle cx="300" cy="200" r="72" fill={c4} />
        <circle cx="300" cy="200" r="30" fill={c0} />
      </g>
      {/* specimen glyphs */}
      <text x="820" y="200" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="190" fill={c2}>A</text>
      <text x="1100" y="380" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="120" fill={c0}>01</text>
      {/* bar block */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="700" y={300 + i * 30} width={i % 2 ? 200 : 260} height="16" fill={c1} />
      ))}
      {/* pixel run */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={40 + i * 52} y={430 - (i % 2) * 26} width="26" height="26" fill={i % 2 ? c5 : c7} />
      ))}
    </svg>
  );
}
