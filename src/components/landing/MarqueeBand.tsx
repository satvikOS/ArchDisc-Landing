const WORDS = [
  "parametric CAD",
  "on-device AI",
  "FEA + simulation",
  "watertight solids",
  "assemblies",
  "photoreal render",
  "sketch → solid",
  "STEP · DXF export",
];
const HOT = new Set(["on-device AI", "watertight solids", "photoreal render"]);

export function MarqueeBand() {
  const track = [...WORDS, ...WORDS];
  return (
    <section
      aria-hidden
      className="relative isolate overflow-hidden border-y-[2.5px] border-ink bg-ink py-5 md:py-7"
    >
      <div className="flex w-max marquee-track items-center">
        {track.map((w, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`whitespace-nowrap px-6 font-display text-[7vw] font-extrabold leading-none tracking-[-0.01em] md:px-8 md:text-[3.6vw] ${
                HOT.has(w) ? "text-lime" : "text-cream"
              }`}
            >
              {w}
            </span>
            <span className="shrink-0 font-display text-[5vw] font-extrabold leading-none text-coral md:text-[2.4vw]" aria-hidden>
              ✳
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
