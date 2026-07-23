import { Reveal } from "@/components/motion/Reveal";

const MODALITIES = ["text", "images", "video"];

export function Declaration() {
  return (
    <section id="matter" className="relative overflow-hidden py-28 md:py-40">
      {/* continuity flowline handing the eye down from the hero */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-20 -translate-x-1/2" aria-hidden>
        <div className="flowline h-full" style={{ animation: "flow-draw 1.1s var(--ease-out-soft) forwards" }} />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="eyebrow justify-center">The shift</p>
        </Reveal>

        {/* modality progression: media → matter */}
        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[13px] uppercase tracking-[0.18em] text-muted">
            {MODALITIES.map((m) => (
              <span key={m} className="inline-flex items-center gap-3">
                {m}
                <span className="text-muted">→</span>
              </span>
            ))}
            <span className="spark-text font-semibold">matter</span>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <h2 className="mt-10 font-display text-display text-ink text-balance">
            Generative AI learned to make media.
            <br className="hidden sm:block" /> Now it can make{" "}
            <span className="accent-serif glow-accent text-[1.06em]">real things</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-9 max-w-[58ch] text-lead text-ink-soft text-pretty">
            For decades, making physical things stayed locked behind CAD seat-licenses,
            dense jargon, and a decade of training — so most ideas died as sketches.
            ArchDisc breaks that lock. Describe it in plain language; get a part that is
            genuinely buildable.
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <p className="mx-auto mt-10 max-w-[46ch] text-body-sm text-ink-mid">
            This isn&rsquo;t a render or a lucky one-shot. It&rsquo;s the beginning of
            <span className="text-ink-soft"> vibe designing</span> — for things you can hold.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
