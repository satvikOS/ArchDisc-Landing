import { Reveal } from "@/components/motion/Reveal";

type Mode = "describe" | "plan" | "build" | "verify";
type Stage = { n: string; k: string; mode: Mode; d: string; spec: string; accent?: boolean };

const STAGES: Stage[] = [
  { n: "01", k: "Describe", mode: "describe", d: "One plain-language line. No parameters, no CAD.", spec: "input · natural language" },
  { n: "02", k: "Plan", mode: "plan", d: "Archie resolves intent into an explicit geometry inventory.", spec: "features · datums · tol" },
  { n: "03", k: "Build", mode: "build", d: "The plan compiles to deterministic ops on a native kernel.", spec: "native B-rep · 900+ ops" },
  { n: "04", k: "Verify", mode: "verify", d: "A coherence gate proves it watertight and manufacturable.", spec: "watertight · DFM ✓", accent: true },
];

/** One blueprint part shown at four states of the pipeline — the same object
 *  evolving intent → wireframe → solid → verified. */
function PartSVG({ mode }: { mode: Mode }) {
  const solid = mode === "build" || mode === "verify";
  const accent = mode === "verify";
  const line = accent ? "var(--color-clay)" : solid ? "var(--color-line-strong)" : "var(--color-clay-soft)";
  const surface = solid ? "var(--color-surface-2)" : "none";
  const holes = solid ? "var(--color-paper)" : "none";
  const holePts = [
    [52, 58],
    [168, 58],
    [52, 96],
    [168, 96],
  ];

  if (mode === "describe") {
    return (
      <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label="Intent — a described bounding volume">
        <rect x="16" y="30" width="188" height="90" rx="10" fill="none" stroke="var(--color-clay-soft)" strokeWidth="1.4" strokeDasharray="5 6" opacity="0.9" />
        <line x1="110" y1="60" x2="110" y2="90" stroke="var(--color-clay)" strokeWidth="1.4" />
        <line x1="95" y1="75" x2="125" y2="75" stroke="var(--color-clay)" strokeWidth="1.4" />
        {[[16, 30], [204, 30], [16, 120], [204, 120]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="var(--color-clay-soft)" />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-label={`Part — ${mode} state`}>
      <rect x="26" y="40" width="168" height="74" rx="12" fill={surface} stroke={line} strokeWidth="1.6" />
      {/* central boss + bore */}
      <circle cx="110" cy="77" r="27" fill={surface} stroke={line} strokeWidth="1.6" />
      <circle cx="110" cy="77" r="15" fill={holes} stroke={line} strokeWidth="1.6" />
      {/* bolt holes */}
      {holePts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5.5" fill={holes} stroke={line} strokeWidth="1.6" />
      ))}
      {mode === "plan" &&
        [[26, 122, 194, 122]].map((d, i) => (
          <g key={i} stroke="var(--color-muted)" strokeWidth="1">
            <line x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} strokeDasharray="2 4" />
            <line x1={d[0]} y1={d[1] - 4} x2={d[0]} y2={d[1] + 4} />
            <line x1={d[2]} y1={d[1] - 4} x2={d[2]} y2={d[1] + 4} />
          </g>
        ))}
      {accent && (
        <g>
          <circle cx="196" cy="34" r="11" fill="var(--color-paper)" stroke="var(--color-clay)" strokeWidth="1.6" />
          <path d="M191 34 l3.4 3.6 l6.4 -7.2" fill="none" stroke="var(--color-clay)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

export function TheSystem() {
  return (
    <section id="system" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div className="blueprint-grid absolute inset-0 -z-10 opacity-30" aria-hidden />
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-10">
        {/* centered header — a different rhythm from the left-aligned gallery */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow justify-center">Under the sentence</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-h1 text-ink text-balance">
              Not a magic button. A{" "}
              <span className="accent-serif text-[1.04em]">verified</span> pipeline.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[54ch] text-lead text-ink-soft text-pretty">
              Archie plans probabilistically, then executes deterministically — the same
              part carried from intent to a kernel-checked solid.
            </p>
          </Reveal>
        </div>

        {/* the assembly line — one part, four states, connected */}
        <Reveal delay={0.16}>
          <ol className="relative mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* rail behind the states (desktop) */}
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-[112px] hidden h-px bg-gradient-to-r from-line-strong via-clay/50 to-clay lg:block"
              aria-hidden
            />
            {STAGES.map((s) => (
              <li key={s.n} className="relative flex flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[12px] tracking-[0.2em] text-muted">{s.n}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${s.accent ? "bg-clay signal-dot" : "bg-line-strong"}`}
                    aria-hidden
                  />
                </div>
                <div
                  className={`relative mt-4 aspect-[220/150] w-full rounded-xl border bg-paper-2/60 ${
                    s.accent ? "border-clay/40" : "border-line"
                  }`}
                >
                  <div className="absolute inset-0 p-4">
                    <PartSVG mode={s.mode} />
                  </div>
                </div>
                <h3 className={`mt-5 font-display text-h3 ${s.accent ? "glow-accent" : "text-ink"}`}>{s.k}</h3>
                <p className="mt-2 text-body-sm text-ink-mid">{s.d}</p>
                <p className="u-spec mt-4 text-[12px] text-muted">{s.spec}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
