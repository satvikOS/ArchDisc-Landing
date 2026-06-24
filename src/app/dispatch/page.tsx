import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const TITLE = "Dispatch — field notes from the build";
const DESCRIPTION =
  "Short, honest dispatches from the people building ArchDisc — what moved, what broke, what got closer to being worth showing. No benchmarks, just field notes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/dispatch" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/dispatch" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

type Entry = { date: string; tag: string; title: string; body: string };

const ENTRIES: Entry[] = [
  { date: "2026.06.20", tag: "SYS-01 · Forge", title: "The kernel stopped lying.", body: "A fillet that used to return a nearly-valid solid now returns a valid one — or refuses outright. We'll take an honest refusal over a quiet lie every single time." },
  { date: "2026.06.14", tag: "SYS-00 · Archie", title: "A new verb.", body: "Archie learned to round edges the way a person means it, not the way a parser does. Small word, large difference in what comes out the other side." },
  { date: "2026.06.07", tag: "SYS-02 · Studio", title: "The room got a floor.", body: "Studio's surface can hold a scene together now without the lights falling through it. Still mid-installation — but standing on its own." },
  { date: "2026.05.30", tag: "SYS-01 · Forge", title: "Renamed, refit.", body: "What used to be one thing became Forge: a native geometry kernel, no shortcuts, built from source. The name change was the easy part." },
  { date: "2026.05.16", tag: "ALL", title: "On honesty.", body: "We pulled a feature from the preview because it looked finished and wasn't. It goes back in when it's real, not before." },
  { date: "2026.05.02", tag: "SYS-00 · Archie", title: "Closer to the hand.", body: "Archie now keeps its own work in check — validity, intent, and the editable tree it leaves behind. Fewer surprises, slowly." },
];

export default function DispatchPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="atmos -z-10" aria-hidden />
        <Container className="relative max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft backdrop-blur-sm">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Dispatch · field notes from the build
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-7 max-w-[18ch] text-balance font-display text-display font-[700] leading-[0.98] tracking-[-0.03em] text-ink">
              Field notes, not{" "}
              <span className="accent-serif text-[1.04em]">benchmarks.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[58ch] text-pretty text-lead text-ink-soft">
              What moved, what broke, and what got closer to being worth standing in
              front of. Honest and short — a running log from inside the build, written
              the way an engineer talks, not the way a launch post sounds.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line py-20 md:py-28">
        <Container className="relative max-w-3xl">
          <Reveal>
            <span className="u-label text-clay">The log</span>
          </Reveal>
          <div className="mt-10 border-l border-line pl-6 sm:pl-8">
            {ENTRIES.map((e, i) => (
              <Reveal key={e.date} delay={Math.min(i * 0.04, 0.2)}>
                <article className="relative pb-12 last:pb-0">
                  <span
                    className="iris-fill absolute -left-[1.65rem] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-paper sm:-left-[2.15rem]"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <time className="font-mono text-[12px] tracking-[0.1em] text-clay-soft">{e.date}</time>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{e.tag}</span>
                  </div>
                  <h2 className="mt-2 font-display text-h3 text-ink">{e.title}</h2>
                  <p className="mt-2 max-w-[60ch] text-pretty text-body text-muted">{e.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="border-t border-line py-24 md:py-32">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Coming soon
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[22ch] text-balance font-display text-display font-[700] leading-[0.98] tracking-[-0.03em] text-ink">
              The next entry is being{" "}
              <span className="accent-serif">written.</span>
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[48ch] text-pretty text-lead text-muted">
              More field notes land as the work does. The full platform is on its way.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
