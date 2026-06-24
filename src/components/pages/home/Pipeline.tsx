import { Plate } from "@/components/visual/Plate";
import { Reveal } from "@/components/motion/Reveal";

const STAGES = [
  { n: "01", name: "Raw model", img: "/img/cad-raw.jpg", cap: "Real geometry, the moment it exists — not a mesh, a solid." },
  { n: "02", name: "Sketch", img: "/img/cad-sketch.jpg", cap: "Dimensioned and constrained. Intentional, not approximate." },
  { n: "03", name: "Render", img: "/img/render-a.jpg", cap: "How it looks when it’s finished, lit, and yours." },
  { n: "04", name: "Blueprint", img: "/img/cad-blueprint.jpg", cap: "The drawing a machine shop can actually build from." },
];

export function Pipeline() {
  return (
    <section id="pipeline" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1680px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
          <Reveal>
            <h2 className="max-w-[16ch] text-balance text-h1 text-ink">
              Every stage of making something real.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-[44ch] text-pretty text-lead text-muted">
              Most tools give you one piece — a picture, a mesh, a drawing. ArchDisc carries
              the whole chain, from the first solid to the sheet a machinist can hold.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <figure className="group relative overflow-hidden rounded-xl border border-line">
                <Plate
                  src={s.img}
                  alt={`${s.name} — a stage of mechanical CAD design`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="aspect-[4/5] w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(10,9,5,0.55) 0%, rgba(10,9,5,0.0) 40%, rgba(10,9,5,0.9) 100%)" }}
                />
                <figcaption className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] tracking-[0.14em] text-clay-soft">{s.n}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                      stage {s.n}/04
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-h3 font-[800] uppercase tracking-[-0.02em] text-white">
                      {s.name}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-body-sm text-white/75">{s.cap}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
