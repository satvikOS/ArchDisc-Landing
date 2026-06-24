import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { GradientField } from "@/components/visual/GradientField";
import { BigWord } from "@/components/fx/BigWord";
import { Redacted } from "@/components/fx/Redacted";
import { Admission } from "@/components/common/Admission";

const TITLE = "Dispatch — field notes from behind the cloth";
const DESCRIPTION =
  "Short, honest dispatches from the people building ArchDisc — what moved, what broke, what got closer to being worth showing. No benchmarks, just field notes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/dispatch" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/dispatch" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

type Entry = { date: string; tag: string; title: string; body: string; redacted?: string };

const ENTRIES: Entry[] = [
  { date: "2026.06.20", tag: "SYS-01 · Forge", title: "The kernel stopped lying.", body: "A fillet that used to return a nearly-valid solid now returns a valid one — or refuses outright. We'll take an honest refusal over a quiet lie every single time." },
  { date: "2026.06.14", tag: "SYS-00 · Archie", title: "A new verb.", body: "Archie learned to round edges the way a person means it, not the way a parser does. Small word, large difference in what comes out the other side." },
  { date: "2026.06.07", tag: "SYS-02 · Studio", title: "The room got a floor.", body: "Studio's surface can hold a scene together now without the lights falling through it. Still mid-installation — but standing on its own." },
  { date: "2026.05.30", tag: "SYS-01 · Forge", title: "Renamed, refit.", body: "What used to be one thing became Forge: a native geometry kernel, no shortcuts, built from source. The name change was the easy part." },
  { date: "2026.05.16", tag: "ALL", title: "On honesty.", body: "We pulled a feature from the preview because it looked finished and wasn't. The cloth went back over it. It'll return when it's real.", redacted: "internal note · 4 lines" },
  { date: "2026.05.02", tag: "SYS-00 · Archie", title: "Closer to the hand.", body: "Archie now keeps its own work in check — validity, intent, and the editable tree it leaves behind. Fewer surprises, slowly." },
];

export default function DispatchPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
        <GradientField intensity={0.8} />
        <BigWord variant="ghost" className="absolute -top-2 left-1/2 -translate-x-1/2 text-[clamp(4rem,18vw,16rem)]">
          Dispatch
        </BigWord>
        <Container className="relative max-w-3xl">
          <Reveal>
            <Chip tone="iris">Transmissions · from behind the cloth</Chip>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-[18ch] text-balance text-display font-display font-semibold leading-[0.96] text-ink">
              Field notes, not{" "}
              <span className="iris-text iris-text-anim">benchmarks</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[58ch] text-pretty text-lead text-muted">
              What moved, what broke, what got closer to being worth standing in front of.
              Honest and short. Some of it stays redacted until opening.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-line py-20 md:py-28">
        <Container className="relative max-w-3xl">
          <div className="border-l border-line pl-6 sm:pl-8">
            {ENTRIES.map((e, i) => (
              <Reveal key={e.date} delay={Math.min(i * 0.04, 0.2)}>
                <article className="relative pb-12 last:pb-0">
                  <span
                    className="iris-fill absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-paper sm:-left-[2.15rem]"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <time className="font-mono text-[12px] tracking-[0.1em] text-ink">{e.date}</time>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{e.tag}</span>
                  </div>
                  <h2 className="mt-2 font-display text-h3 text-ink">{e.title}</h2>
                  <p className="mt-2 max-w-[60ch] text-pretty text-body text-muted">{e.body}</p>
                  {e.redacted && (
                    <p className="mt-3">
                      <Redacted value={e.redacted} revealLabel="decrypt note" />
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Admission
        eyebrow="Stay in the loop"
        headline="Get the dispatch that matters."
        sub="We don't send a newsletter. We send one signal — the day the doors open. Hold clearance and you'll get it."
      />
    </>
  );
}
