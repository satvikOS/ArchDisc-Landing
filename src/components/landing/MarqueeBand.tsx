import { Asterisk } from "@/components/decor/Stickers";

const WORDS = [
  "bearing flange",
  "watertight",
  "ribbed gearbox housing",
  "verified",
  "three-port valve body",
  "manufacturable",
  "pump volute backplate",
  "kernel-true",
];
const HOT = new Set(["watertight", "verified", "manufacturable", "kernel-true"]);

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
            <Asterisk className="h-6 w-6 shrink-0 spin-slow text-coral md:h-8 md:w-8" />
          </span>
        ))}
      </div>
    </section>
  );
}
