/** Distinct LOUD background arts — one per section, none repeated. */
const D = "var(--font-display)";

/** Pipeline: drafting-room — big grid patch, quarter rings, dim ticks, ghost 01→04. */
export function BgPipeline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <pattern id="bpG" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0 H0 V34" fill="none" stroke="var(--color-ink)" strokeWidth="1.4" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="420" height="500" fill="url(#bpG)" opacity="0.35" />
      <g opacity="0.4">
        <circle cx="1200" cy="0" r="300" fill="var(--color-peri)" />
        <circle cx="1200" cy="0" r="210" fill="var(--color-cream)" />
        <circle cx="1200" cy="0" r="130" fill="var(--color-violet)" />
        <circle cx="1200" cy="0" r="60" fill="var(--color-cream)" />
      </g>
      <text x="70" y="480" fontFamily={D} fontWeight="800" fontSize="150" fill="var(--color-cream)" opacity="0.55">01→04</text>
      <g stroke="var(--color-ink)" strokeWidth="3" opacity="0.35">
        <line x1="520" y1="60" x2="740" y2="60" /><line x1="520" y1="48" x2="520" y2="72" /><line x1="740" y1="48" x2="740" y2="72" />
      </g>
      <g opacity="0.5">{[0,1,2,3,4,5].map(i=>(<rect key={i} x={880+i*44} y={430+(i%2)*22} width="24" height="24" fill={i%2?"var(--color-magenta)":"var(--color-gold)"} />))}</g>
    </svg>
  );
}

/** Apps: diagonal split, giant ghost S / F, dashed ring + brush bar. */
export function BgApps({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <polygon points="0,0 640,0 480,500 0,500" fill="var(--color-violet)" opacity="0.22" />
      <polygon points="640,0 1200,0 1200,500 480,500" fill="var(--color-olive)" opacity="0.22" />
      <text x="180" y="420" fontFamily={D} fontWeight="800" fontSize="430" fill="var(--color-violet)" opacity="0.35">S</text>
      <text x="880" y="430" fontFamily={D} fontWeight="800" fontSize="430" fill="var(--color-olive)" opacity="0.35">F</text>
      <circle cx="600" cy="120" r="82" fill="none" stroke="var(--color-coral)" strokeWidth="20" strokeDasharray="40 22" opacity="0.5" />
      <rect x="380" y="430" width="440" height="26" rx="13" fill="var(--color-magenta)" opacity="0.4" />
    </svg>
  );
}

/** Finale: radial burst wedges from the corner + confetti + ring. */
export function BgFinale({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <g opacity="0.35">{[0,15,30,45,60,75,90].map(a=>(<path key={a} d="M0 500 L260 500 L0 240 Z" fill={a%30?"var(--color-gold)":"var(--color-violet)"} transform={`rotate(${-a} 0 500)`} />))}</g>
      <g opacity="0.45">{[[900,80,-15],[1060,200,18],[760,60,10],[1120,380,-12],[640,430,14]].map(([x,y,r],i)=>(<rect key={i} x={x} y={y} width="120" height="24" rx="12" fill={i%2?"var(--color-lime)":"var(--color-cream)"} transform={`rotate(${r} ${x} ${y})`} />))}</g>
      <g opacity="0.4"><circle cx="1150" cy="90" r="70" fill="none" stroke="var(--color-cream)" strokeWidth="18" /><circle cx="1150" cy="90" r="26" fill="var(--color-ink)" /></g>
    </svg>
  );
}

/** Benchmark thin strip: caution hatch band + medal dots + pixel sprint. */
export function BgBench({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <pattern id="bbH" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="13" height="26" fill="var(--color-ink)" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="1200" height="20" fill="url(#bbH)" opacity="0.25" />
      <rect x="0" y="240" width="1200" height="20" fill="url(#bbH)" opacity="0.25" />
      <g opacity="0.5">{[0,1,2].map(i=>(<circle key={i} cx={1090+i*38} cy={60} r={14-i*3} fill={["var(--color-cream)","var(--color-coral)","var(--color-ink)"][i]} />))}</g>
      <g opacity="0.45">{[0,1,2,3,4,5,6].map(i=>(<rect key={i} x={30+i*30} y={200-(i%3)*14} width="18" height="18" fill={i%2?"var(--color-lime)":"var(--color-cream)"} />))}</g>
      <text x="600" y="235" textAnchor="middle" fontFamily={D} fontWeight="800" fontSize="200" fill="var(--color-cream)" opacity="0.18">№1</text>
    </svg>
  );
}
