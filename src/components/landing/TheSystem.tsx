
import { BgPipeline } from "@/components/decor/Mosaics2";
import { Reveal } from "@/components/motion/Reveal";
import { CenterMark } from "@/components/decor/EngMarks";

type Mode = "describe" | "plan" | "build" | "verify";
type Stage = { n: string; k: string; mode: Mode; d: string; spec: string; color: string };

const STAGES: Stage[] = [
  { n: "01", k: "Describe", mode: "describe", d: "One plain line.", spec: "natural language", color: "gold" },
  { n: "02", k: "Plan", mode: "plan", d: "Intent → inventory.", spec: "features · datums", color: "olive" },
  { n: "03", k: "Build", mode: "build", d: "Compiled to a native kernel.", spec: "B-rep · 900+ ops", color: "coral" },
  { n: "04", k: "Verify", mode: "verify", d: "Proven watertight.", spec: "watertight · DFM ✓", color: "lime" },
];

const INK = "var(--color-ink)";

function PartSVG({ mode }: { mode: Mode }) {
  const INKC = "var(--color-ink)";
  if (mode === "describe")
    return (
      <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label="A plain-language sentence">
        <text x="18" y="60" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="52" fill={INKC}>“</text>
        <rect x="44" y="52" width="120" height="10" rx="5" fill={INKC} />
        <rect x="44" y="76" width="88" height="10" rx="5" fill={INKC} opacity="0.55" />
        <rect x="138" y="72" width="4" height="20" fill="var(--color-coral)" />
        <text x="176" y="104" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="52" fill={INKC}>”</text>
      </svg>
    );
  if (mode === "plan")
    return (
      <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label="Intent resolved into a feature inventory">
        <circle cx="110" cy="28" r="10" fill="var(--color-peri)" stroke={INKC} strokeWidth="2.5" />
        <path d="M110 38 V58 M110 58 H50 M110 58 H170 M50 58 V78 M110 58 V78 M170 58 V78" stroke={INKC} strokeWidth="2.5" fill="none" />
        {[[50, "base"], [110, "bore"], [170, "holes"]].map(([x, t]) => (
          <g key={t as string}>
            <rect x={(x as number) - 28} y="78" width="56" height="30" fill="var(--color-cream)" stroke={INKC} strokeWidth="2.5" />
            <text x={x as number} y="98" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill={INKC}>{t as string}</text>
          </g>
        ))}
        <text x="110" y="136" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill={INKC} opacity="0.6">features · datums · tolerances</text>
      </svg>
    );
  if (mode === "build")
    return (
      <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label="Profile extruded into a solid by the kernel">
        <rect x="22" y="52" width="52" height="40" fill="none" stroke={INKC} strokeWidth="2.5" />
        <circle cx="48" cy="72" r="10" fill="none" stroke={INKC} strokeWidth="2.5" />
        <path d="M84 72 H118 M112 64 L122 72 L112 80" stroke="var(--color-coral)" strokeWidth="3" fill="none" />
        <g stroke={INKC} strokeWidth="2.5" fill="var(--color-olive)">
          <path d="M132 60 L188 48 L204 62 L204 94 L148 106 L132 92 Z" />
          <path d="M132 60 L148 74 L148 106 M148 74 L204 62" fill="none" />
        </g>
        <circle cx="176" cy="80" r="9" fill="var(--color-cream)" stroke={INKC} strokeWidth="2.5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label="Checks passed — watertight and in tolerance">
      <path d="M40 44 L170 44 M40 36 L40 52 M170 36 L170 52" stroke={INKC} strokeWidth="2" />
      <text x="105" y="34" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill={INKC}>Ø90 ±0.01</text>
      <g fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill={INKC}>
        <text x="46" y="78">watertight</text>
        <text x="46" y="102">interference</text>
        <text x="46" y="126">DFM</text>
      </g>
      {[70, 94, 118].map((y) => (
        <g key={y}>
          <circle cx="178" cy={y} r="10" fill="var(--color-lime)" stroke={INKC} strokeWidth="2.5" />
          <path d={`M173 ${y} l3.5 3.5 l6 -7`} stroke={INKC} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

export function TheSystem() {
  return (
    <section id="system" className="relative scroll-mt-24 overflow-hidden border-y-[2.5px] border-ink bg-sky py-12 md:py-16">
      <CenterMark className="pointer-events-none absolute -right-8 top-16 hidden h-32 w-32 text-ink/40 md:block" aria-hidden />
      <BgPipeline className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center border-[2.5px] border-ink bg-cream px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
              Under the sentence
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,1rem+4.6vw,4.8rem)] font-extrabold leading-[0.92] text-ink">
              Not a <span className="accent-serif inline-block -rotate-2 font-normal">magic</span> button. A{" "}
              <span className="inline-block rotate-1 border-[3px] border-ink bg-cream px-2">verified</span>{" "}
              <span className="bubble text-cream">pipeline</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[42ch] text-lead text-ink-soft">
              One part — intent to kernel-checked solid.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <ol className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => (
              <li key={s.n} className="flex">
                <div className="flex w-full flex-col border-[2.5px] border-ink bg-cream p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className="border-2 border-ink px-2 py-0.5 font-mono text-[12px] font-bold text-ink"
                      style={{ backgroundColor: `var(--color-${s.color})` }}
                    >
                      {s.n}
                    </span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink-mute">
                      {s.k}
                    </span>
                  </div>
                  <div className="mt-4 aspect-[220/150] w-full border-2 border-ink bg-cream-2 p-3">
                    <PartSVG mode={s.mode} />
                  </div>
                  <p className="mt-4 text-body-sm text-ink-soft">{s.d}</p>
                  <p className="u-spec mt-3 text-[12px] text-ink-mute">{s.spec}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
