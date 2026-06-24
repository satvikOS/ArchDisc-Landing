import { Plate } from "@/components/visual/Plate";
import { Reveal } from "@/components/motion/Reveal";

/** A strong closing statement to the community. No form, no timer — just soon. */
export function Closing() {
  return (
    <section className="relative isolate flex min-h-[68vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Plate src="/img/cad-render2.jpg" alt="" sizes="100vw" className="h-full w-full" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, rgba(10,9,5,0.86) 0%, rgba(10,9,5,0.7) 50%, rgba(10,9,5,0.94) 100%)" }}
      />
      <div className="mx-auto w-full max-w-[1680px] px-5 py-24 md:px-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
            Coming soon
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-7 max-w-[16ch] text-balance font-display text-display font-[800] leading-[0.9] tracking-[-0.04em] text-ink">
            The tools were the barrier. <span className="text-clay-soft">Not you.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-7 max-w-[56ch] text-pretty text-lead text-ink-soft">
            For decades, making real things meant years of training and software built for
            specialists. That ends. ArchDisc is coming — free to use, on your own machine,
            turning what you say into something real you can hold, ship, and manufacture.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
