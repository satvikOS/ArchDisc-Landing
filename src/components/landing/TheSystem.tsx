import { Mosaic13 } from "@/components/decor/Mosaic13";
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
  const solid = mode === "build" || mode === "verify";
  const verify = mode === "verify";
  const fill = solid ? "var(--color-olive)" : "none";
  const holes = solid ? "var(--color-cream)" : "none";
  const stroke = verify ? "var(--color-coral)" : INK;
  const holePts = [
    [52, 58],
    [168, 58],
    [52, 96],
    [168, 96],
  ];

  if (mode === "describe") {
    return (
      <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label="Intent — a described bounding volume">
        <rect x="16" y="30" width="188" height="90" rx="10" fill="none" stroke={INK} strokeWidth="2.5" strokeDasharray="6 7" />
        <line x1="110" y1="58" x2="110" y2="92" stroke="var(--color-coral)" strokeWidth="3" />
        <line x1="93" y1="75" x2="127" y2="75" stroke="var(--color-coral)" strokeWidth="3" />
        {[[16, 30], [204, 30], [16, 120], [204, 120]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill={INK} />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label={`Part — ${mode} state`}>
      <rect x="26" y="40" width="168" height="74" rx="12" fill={fill} stroke={stroke} strokeWidth="2.6" />
      <circle cx="110" cy="77" r="27" fill={fill} stroke={stroke} strokeWidth="2.6" />
      <circle cx="110" cy="77" r="15" fill={holes} stroke={stroke} strokeWidth="2.6" />
      {holePts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5.5" fill={holes} stroke={stroke} strokeWidth="2.6" />
      ))}
      {verify && (
        <g>
          <circle cx="196" cy="32" r="13" fill="var(--color-lime)" stroke={INK} strokeWidth="2.5" />
          <path d="M190 32 l4 4 l7 -8" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

export function TheSystem() {
  return (
    <section id="system" className="relative scroll-mt-24 overflow-hidden border-y-[2.5px] border-ink bg-sky py-12 md:py-16">
      <CenterMark className="pointer-events-none absolute -right-8 top-16 hidden h-32 w-32 text-ink/40 md:block" aria-hidden />
      <Mosaic13 mix={1} className="pointer-events-none absolute inset-0 h-full w-full opacity-25" aria-hidden />
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
