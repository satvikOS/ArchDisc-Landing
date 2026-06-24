import type { Metadata } from "next";
import { ShieldCheck, Hand, Lock, BellRing } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { GradientField } from "@/components/visual/GradientField";
import { BigWord } from "@/components/fx/BigWord";
import { SignalCountdown } from "@/components/fx/SignalCountdown";
import { ClearanceForm } from "@/components/forms/ClearanceForm";

const TITLE = "Request clearance — be first into ArchDisc";
const DESCRIPTION =
  "ArchDisc opens as a private viewing. Leave an email and hold clearance — when the signal goes live, the door is yours before the public. Free to use, local, private.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/access" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/access" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const PERKS = [
  { icon: ShieldCheck, title: "First through the door", body: "Clearance opens before the public. You walk in while it's still quiet." },
  { icon: Hand, title: "A hand in the work", body: "What you build and ask for shapes what ships. Early means heard." },
  { icon: Lock, title: "Yours and private", body: "Free to use, running locally. Nothing you make leaves your machine." },
  { icon: BellRing, title: "One signal, no noise", body: "A single email the day the doors open. No drip, no spam, ever." },
];

const STEPS = [
  { t: "Leave your email", b: "That's the whole form. Tell us what you build if you like." },
  { t: "We hold the list", b: "No campaign, no chasing. The list just waits with you." },
  { t: "The signal goes live", b: "The countdown reaches zero and the doors unlock." },
  { t: "You walk in first", b: "Clearance holders enter before ArchDisc goes public." },
];

const FAQ = [
  { q: "Is it really free?", a: "Yes — free to use. We build and maintain the technology; you get to use it on your own machine." },
  { q: "Does my work leave my machine?", a: "No. ArchDisc runs locally. Your geometry, prompts, and files stay with you — nothing is uploaded." },
  { q: "When does it open?", a: "When the work is ready. Track the countdown — clearance holders are let in before the public." },
  { q: "What am I getting clearance to?", a: "Three systems: Forge (mechanical CAD), Studio (the creation surface), and Archie (the model that drives them)." },
  { q: "What do you do with my email?", a: "Hold it, and send one signal when the doors open. That's the entire arrangement." },
];

export default function AccessPage() {
  return (
    <>
      {/* Hero + form */}
      <section className="relative isolate overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28">
        <GradientField intensity={0.95} />
        <BigWord variant="ghost" rotate={-6} className="absolute -bottom-8 -right-4 text-[clamp(4rem,16vw,15rem)]">
          Admit&nbsp;one
        </BigWord>
        <Container className="relative grid items-start gap-12 lg:grid-cols-[46fr_54fr] lg:gap-16">
          <div>
            <Reveal>
              <Chip tone="iris">
                <span className="signal-dot h-1.5 w-1.5 rounded-full bg-iris-magenta" aria-hidden />
                Admission · by clearance only
              </Chip>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-balance text-display font-display font-semibold text-ink">
                Request <span className="iris-text iris-text-anim">clearance</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[50ch] text-pretty text-lead text-muted">
                ArchDisc opens as a private viewing — the people holding clearance walk in
                first. Leave an email; when the signal goes live, the door is yours.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-8">
                <span className="u-label text-faint">Doors open in</span>
                <div className="mt-2"><SignalCountdown /></div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={24}>
            <div className="rounded-2xl border border-line-strong bg-surface/80 p-7 backdrop-blur-md md:p-9">
              <h2 className="font-display text-h3 text-ink">Get on the list</h2>
              <p className="mt-2 text-body-sm text-muted">
                The form takes ten seconds. Everything else, we handle.
              </p>
              <div className="mt-6">
                <ClearanceForm full />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* What clearance gets you */}
      <section className="relative overflow-hidden border-t border-line bg-paper-2/40 py-24 md:py-28">
        <Container className="relative">
          <Reveal>
            <span className="u-label text-faint">What clearance gets you</span>
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {PERKS.map((p, i) => (
              <Reveal key={p.title} delay={Math.min(i * 0.06, 0.24)}>
                <div className="flex gap-4 border-t border-line pt-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-iris-magenta">
                    <p.icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-h4 text-ink">{p.title}</h3>
                    <p className="mt-1.5 max-w-[40ch] text-body-sm text-muted">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works — a real sequence, so it's numbered */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <Container className="relative">
          <Reveal>
            <h2 className="max-w-[18ch] text-balance text-h2 text-ink">
              How clearance works. Four steps, no theatre.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="bg-surface p-6">
                <span className="font-mono text-[12px] tracking-[0.14em] text-iris-magenta">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-h4 text-ink">{s.t}</h3>
                <p className="mt-2 text-body-sm text-muted">{s.b}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden border-t border-line bg-paper-2/40 py-24 md:py-28">
        <Container className="relative">
          <Reveal>
            <span className="u-label text-faint">Before you ask</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-balance text-h2 text-ink">Honest answers.</h2>
          </Reveal>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-h4 text-ink marker:hidden">
                  {f.q}
                  <span className="font-mono text-iris-magenta transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-pretty text-body text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
