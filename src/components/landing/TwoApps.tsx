import { Reveal } from "@/components/motion/Reveal";

type App = {
  grade: string;
  code: string;
  sys: string;
  role: string;
  verb: string;
  line: string;
  caps: string[];
  glyph: string;
};

const APPS: App[] = [
  {
    grade: "grade-studio",
    code: "Studio",
    sys: "SYS-02",
    role: "3D creation",
    verb: "Studio imagines.",
    line: "Model, sculpt, light, and render an entire world — reached in plain words. A full 3D suite with no menus to memorize.",
    caps: ["modeling", "sculpt", "shading", "render", "simulation"],
    glyph: "◐",
  },
  {
    grade: "grade-forge",
    code: "Forge",
    sys: "SYS-01",
    role: "Mechanical CAD",
    verb: "Forge engineers.",
    line: "A real, native geometry kernel: solid parts, assemblies, and drawings built to be manufactured — not just to look right.",
    caps: ["sketcher", "assemblies", "FEA", "CAM", "STEP / DXF"],
    glyph: "◧",
  },
];

const STATS: { v: string; l: string }[] = [
  { v: "30B", l: "on-device model" },
  { v: "0", l: "data leaves your Mac" },
  { v: "≈ frontier", l: "CAD generation" },
  { v: "Free", l: "to create, forever" },
];

function AppHalf({ a }: { a: App }) {
  return (
    <div className={`${a.grade} app-wash relative flex flex-col overflow-hidden p-8 md:p-12`}>
      {/* oversized watermark glyph, graded */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[9rem] leading-none text-clay/10 md:text-[13rem]"
      >
        {a.glyph}
      </span>

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">{a.sys}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{a.role}</span>
      </div>

      <h3 className="relative mt-10 font-display text-[clamp(2.6rem,1.6rem+3vw,4rem)] font-semibold leading-none text-ink">
        {a.code}
      </h3>
      <p className="relative mt-3 font-display text-h3 text-clay">{a.verb}</p>
      <p className="relative mt-6 max-w-[40ch] text-body text-ink-soft text-pretty">{a.line}</p>

      <p className="relative mt-8 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-mid">
        {a.caps.map((c, i) => (
          <span key={c}>
            {i > 0 && <span className="px-2 text-clay/50">·</span>}
            {c}
          </span>
        ))}
      </p>
    </div>
  );
}

export function TwoApps() {
  return (
    <section id="universe" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow justify-center">One universe</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-h1 text-ink text-balance">
              Two apps. One model. Your machine.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[52ch] text-lead text-ink-soft text-pretty">
              Two faces of the same intent — art and engineering — powered by{" "}
              <span className="text-ink">Archie</span>, running entirely on your own
              Apple-Silicon machine.
            </p>
          </Reveal>
        </div>

        {/* full-bleed split diptych — no shared card vocabulary */}
        <Reveal delay={0.16}>
          <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-3xl border border-line-strong md:grid-cols-2">
            <div className="border-b border-line-strong md:border-b-0 md:border-r">
              <AppHalf a={APPS[0]} />
            </div>
            <div>
              <AppHalf a={APPS[1]} />
            </div>
          </div>
        </Reveal>

        {/* Archie proof band */}
        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper-2">
            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-md">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                  SYS-00 · Archie
                </span>
                <p className="mt-3 font-display text-h3 text-ink">
                  The one model that builds both — private by default.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.l}>
                    <dt className="u-stat text-[2rem] leading-none text-ink md:text-[2.4rem]">{s.v}</dt>
                    <dd className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {s.l}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
