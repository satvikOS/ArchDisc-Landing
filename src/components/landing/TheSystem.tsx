import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Bolt, Sparkle, Concentric, Checker, Hexagon } from "@/components/decor/Stickers";

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
    <section id="system" className="relative scroll-mt-24 overflow-hidden border-y-[2.5px] border-ink bg-sky py-24 md:py-32">
      <Bolt className="absolute right-8 top-10 hidden h-16 w-16 rotate-6 text-olive md:block" aria-hidden />
      <Parallax y={40} className="pointer-events-none absolute -left-12 top-24 hidden md:block">
        <Concentric className="h-36 w-36 text-coral" />
      </Parallax>
      <Checker n={4} a="var(--color-ink)" className="pointer-events-none absolute left-1/3 bottom-8 hidden h-16 w-16 rotate-6 md:block" aria-hidden />
      <Hexagon className="pointer-events-none absolute right-1/4 bottom-14 hidden h-14 w-14 bob text-lav lg:block" aria-hidden />
      <div className="mx-auto w-full max-w-[1180px] px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow bg-cream">
              <Sparkle className="h-3 w-3 text-coral" /> Under the sentence
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-h1 text-ink">
              Not a magic button. A{" "}
              <span className="inline-block rotate-1 rounded-xl border-[3px] border-ink bg-cream px-2 nb-shadow-sm">
                verified
              </span>{" "}
              pipeline.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[42ch] text-lead text-ink-soft">
              One part — intent to kernel-checked solid.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <ol className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => (
              <li key={s.n} className="flex">
                <div
                  className="flex w-full flex-col rounded-xl border-[2.5px] border-ink bg-cream p-5"
                  style={{ boxShadow: `8px 8px 0 0 var(--color-${s.color})` }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[12px] font-bold text-ink"
                      style={{ backgroundColor: `var(--color-${s.color})` }}
                    >
                      {s.n}
                    </span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink-mute">
                      {s.k}
                    </span>
                  </div>
                  <div className="mt-4 aspect-[220/150] w-full rounded-lg border-2 border-ink bg-cream-2 p-3">
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
