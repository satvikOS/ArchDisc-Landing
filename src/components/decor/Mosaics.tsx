/** Per-section background compositions — each UNIQUE, art-first but SUBTLE:
 *  richness lives at the edges, a quiet zone sits under the content, and every
 *  element carries its own low opacity so headlines stay dominant. */

const D = "var(--font-display)";

/** Flow/Declaration (peach): corner checker ribbon, arc stack left, glyph right. */
export function MosaicFlow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <pattern id="mfC" width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill="var(--color-brown)" />
          <rect x="22" y="22" width="22" height="22" fill="var(--color-brown)" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="1200" height="26" fill="url(#mfC)" opacity="0.18" />
      <g opacity="0.2">
        <path d="M0 500 A300 300 0 0 1 300 200 L300 500 Z" fill="var(--color-peri)" />
        <path d="M0 500 A200 200 0 0 1 200 300 L200 500 Z" fill="var(--color-gold)" />
        <path d="M0 500 A110 110 0 0 1 110 390 L110 500 Z" fill="var(--color-magenta)" />
      </g>
      <text x="1120" y="440" textAnchor="middle" fontFamily={D} fontWeight="800" fontSize="330" fill="var(--color-olive)" opacity="0.14">a</text>
      <g opacity="0.16">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={1040} y={40 + i * 34} width={i % 2 ? 120 : 84} height="14" fill="var(--color-coral)" />
        ))}
      </g>
    </svg>
  );
}

/** Pipeline (sky): blueprint corner ticks, big faint quarter-target right, pixel stair left. */
export function MosaicPipeline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <g opacity="0.22">
        <circle cx="1200" cy="500" r="360" fill="var(--color-peri)" />
        <circle cx="1200" cy="500" r="250" fill="var(--color-cream)" />
        <circle cx="1200" cy="500" r="150" fill="var(--color-violet)" />
      </g>
      <g opacity="0.2">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={i * 40} y={120 - i * 24} width="40" height="24" fill="var(--color-magenta)" />
        ))}
      </g>
      <text x="90" y="470" fontFamily={D} fontWeight="800" fontSize="180" fill="var(--color-cream)" opacity="0.3">04</text>
      <g stroke="var(--color-ink)" strokeWidth="3" opacity="0.14">
        <path d="M40 40 h50 M40 40 v50" fill="none" />
        <path d="M1160 40 h-50 M1160 40 v50" fill="none" />
      </g>
    </svg>
  );
}

/** Apps (peach): split gradient fields hinting the two apps, vessel arc left, cog-ish ring right. */
export function MosaicApps({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect x="0" y="0" width="600" height="500" fill="var(--color-violet)" opacity="0.10" />
      <rect x="600" y="0" width="600" height="500" fill="var(--color-olive)" opacity="0.10" />
      <g opacity="0.2">
        <path d="M60 500 C40 380 90 320 150 300 C210 320 260 380 240 500 Z" fill="var(--color-violet)" />
      </g>
      <g opacity="0.2" fill="none" stroke="var(--color-brown)" strokeWidth="26">
        <circle cx="1080" cy="120" r="80" strokeDasharray="42 20" />
      </g>
      <text x="600" y="490" textAnchor="middle" fontFamily={D} fontWeight="800" fontSize="150" fill="var(--color-brown)" opacity="0.10">×2</text>
    </svg>
  );
}

/** Finale (coral): confetti of bars + faint giant asterisk, celebratory not noisy. */
export function MosaicFinale({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <g opacity="0.22">
        {[[80, 70, -18], [220, 400, 12], [1050, 90, 20], [980, 420, -14], [560, 40, 8], [640, 460, -8]].map(([x, y, r], i) => (
          <rect key={i} x={x} y={y} width="110" height="22" rx="11" fill={i % 2 ? "var(--color-gold)" : "var(--color-violet)"} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </g>
      <g opacity="0.16" stroke="var(--color-cream)" strokeWidth="30" strokeLinecap="round">
        {[0, 45, 90, 135].map((a) => (
          <line key={a} x1="120" y1="330" x2="120" y2="470" transform={`rotate(${a} 120 400)`} />
        ))}
      </g>
      <g opacity="0.18">
        <circle cx="1140" cy="260" r="90" fill="var(--color-lime)" />
        <circle cx="1140" cy="260" r="52" fill="var(--color-coral)" />
        <circle cx="1140" cy="260" r="22" fill="var(--color-ink)" />
      </g>
    </svg>
  );
}
