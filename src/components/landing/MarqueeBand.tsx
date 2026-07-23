const WORDS = [
  "bearing flange",
  "watertight",
  "ribbed gearbox housing",
  "verified",
  "three-port valve body",
  "manufacturable",
  "pump volute backplate",
  "STEP · DXF",
];
const HOT = new Set(["watertight", "verified", "manufacturable"]);

/**
 * Full-bleed kinetic marquee — oversized outlined display type, one word filled
 * in accent per pass. Pure CSS scroll; static under reduced motion.
 */
export function MarqueeBand() {
  const track = [...WORDS, ...WORDS];
  return (
    <section
      aria-hidden
      className="relative isolate overflow-hidden border-y border-line py-8 md:py-12"
    >
      <div className="flex w-max marquee-track">
        {track.map((w, i) => (
          <span
            key={i}
            className={`whitespace-nowrap px-6 font-display text-[8.5vw] font-semibold leading-none tracking-[-0.03em] md:px-8 md:text-[5.2vw] ${
              HOT.has(w) ? "text-clay" : "text-outline"
            }`}
          >
            {w}
            <span className="px-6 align-middle text-[0.42em] text-clay/50 md:px-8">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
