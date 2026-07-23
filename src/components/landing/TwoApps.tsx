import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Target, Concentric, Pinwheel, Checker } from "@/components/decor/Stickers";

const STATS = [
  { v: "Local", l: "model · on-device" },
  { v: "#2", l: "on CADGenBench" },
  { v: "0", l: "cloud calls" },
  { v: "Free", l: "to create" },
];

export function TwoApps() {
  return (
    <section id="universe" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <Parallax y={45} className="pointer-events-none absolute -right-10 top-10 hidden md:block">
        <Concentric className="h-40 w-40 text-coral" />
      </Parallax>
      <Pinwheel className="pointer-events-none absolute -left-8 bottom-24 hidden h-28 w-28 spin-slow text-olive md:block" aria-hidden />
      <Checker n={4} className="pointer-events-none absolute left-1/4 top-4 hidden h-14 w-14 -rotate-6 lg:block" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1300px] px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center border-[2.5px] border-ink bg-lime px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">One universe</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-h1 text-ink">
              Two apps. One{" "}
              <span className="inline-block -rotate-1 rounded-xl border-[3px] border-ink bg-coral px-2 text-cream nb-shadow-sm">
                model.
              </span>{" "}
              Your machine.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[38ch] text-lead text-ink-soft">
              Art and engineering. One local <span className="font-bold text-ink">Archie</span>.
            </p>
          </Reveal>
        </div>

        {/* diptych */}
        <Reveal delay={0.16}>
          <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-2xl border-[2.5px] border-ink nb-shadow-lg md:grid-cols-2">
            {/* Studio */}
            <div className="relative overflow-hidden border-b-[2.5px] border-ink bg-violet p-8 text-cream md:border-b-0 md:border-r-[2.5px] md:p-10">
              <Concentric className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 text-cream/12" aria-hidden />
              <span className="inline-block rounded-md border-2 border-cream px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                SYS-02 · 3D creation
              </span>
              <h3 className="relative mt-8 font-display text-[clamp(2.4rem,1.5rem+3vw,3.8rem)] font-extrabold leading-none">
                Studio
              </h3>
              <p className="relative mt-3 font-display text-h3 font-bold text-cream">Studio imagines.</p>
              <p className="relative mt-5 max-w-[32ch] text-body text-cream">
                A whole 3D world, in plain words.
              </p>
              <p className="relative mt-7 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-cream">
                modeling · sculpt · shading · render · simulation
              </p>
            </div>

            {/* Forge — warm olive panel, dark text (complements the cool Studio) */}
            <div className="relative overflow-hidden bg-olive p-8 text-ink md:p-10">
              <Target className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-ink/15" aria-hidden />
              <span className="inline-block rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                SYS-01 · Mechanical CAD
              </span>
              <h3 className="relative mt-8 font-display text-[clamp(2.4rem,1.5rem+3vw,3.8rem)] font-extrabold leading-none">
                Forge
              </h3>
              <p className="relative mt-3 font-display text-h3 font-bold text-ink">Forge engineers.</p>
              <p className="relative mt-5 max-w-[32ch] text-body text-ink-soft">
                A real kernel. Parts built to be made.
              </p>
              <p className="relative mt-7 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                sketcher · assemblies · FEA · CAM · STEP / DXF
              </p>
            </div>
          </div>
        </Reveal>

        {/* Archie proof band */}
        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl border-[2.5px] border-ink bg-brown p-8 nb-shadow md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-md">
                <span className="inline-flex items-center border-2 border-ink bg-cream px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                  SYS-00 · Archie
                </span>
                <p className="mt-4 font-display text-h3 font-extrabold text-cream">
                  The one model that builds both — private by default.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.l} className="rounded-lg border-2 border-ink bg-cream px-3 py-3 text-center">
                    <dt className="u-stat text-[1.7rem] leading-none text-ink md:text-[2rem]">{s.v}</dt>
                    <dd className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-mute">
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
