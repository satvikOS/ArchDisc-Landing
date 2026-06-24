import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

type Card = {
  key: string;
  href: string;
  designation: string;
  codename: string;
  role: string;
  blurb: string;
  chips: string[];
  span: boolean;
  cls: string; // bg + text colors
  chipCls: string;
  dotCls: string;
};

const CARDS: Card[] = [
  {
    key: "archie",
    href: "/archie",
    designation: "SYS-00",
    codename: "Archie",
    role: "The model",
    blurb:
      "The local model fleet at the center of everything — it turns plain language into precise tool-calls and drives the other two.",
    chips: ["language → geometry", "tool-calls", "runs locally", "drives both"],
    span: true,
    cls: "bg-lilac text-ink",
    chipCls: "border-ink/15 text-ink/75",
    dotCls: "bg-ink",
  },
  {
    key: "forge",
    href: "/forge",
    designation: "SYS-01",
    codename: "Forge",
    role: "The kernel",
    blurb: "Mechanical CAD on a real, from-source geometry kernel. Solids made to be made.",
    chips: ["sketcher", "assemblies", "FEA", "CAM", "STEP / IGES"],
    span: false,
    cls: "bg-forest text-paper",
    chipCls: "border-white/25 text-paper/80",
    dotCls: "bg-coral",
  },
  {
    key: "studio",
    href: "/studio",
    designation: "SYS-02",
    codename: "Studio",
    role: "The surface",
    blurb: "The creation environment — scenes, materials, light and motion, arranged in words.",
    chips: ["scenes", "materials", "light", "motion"],
    span: false,
    cls: "bg-coral text-white",
    chipCls: "border-white/35 text-white/85",
    dotCls: "bg-white",
  },
];

function SystemCard({ c }: { c: Card }) {
  return (
    <Link
      href={c.href}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-7 transition-transform duration-300 hover:-translate-y-1 md:p-9 ${c.cls} ${c.span ? "lg:col-span-2" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">
          {c.designation} · {c.role}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-current/25 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] opacity-80">
          <span className={`signal-dot h-1 w-1 rounded-full ${c.dotCls}`} aria-hidden />
          on view soon
        </span>
      </div>

      <div className={c.span ? "mt-10 grid items-end gap-6 lg:grid-cols-[1fr_1fr]" : "mt-10"}>
        <div>
          <h3 className="font-display text-[clamp(2.6rem,1.4rem+5vw,5.5rem)] font-[800] uppercase leading-[0.85] tracking-[-0.04em]">
            {c.codename}
          </h3>
          <p className={`mt-4 max-w-[44ch] text-pretty text-body ${c.span ? "" : "opacity-90"}`}>
            {c.blurb}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {c.chips.map((chip) => (
            <span
              key={chip}
              className={`rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-[0.02em] ${c.chipCls}`}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-current/15 pt-5">
        <span className="font-mono text-[12px] uppercase tracking-[0.12em]">Enter the room</span>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-current/25 transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}

export function SystemsBento() {
  return (
    <section id="systems" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1680px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-8 md:flex-row md:items-end">
          <Reveal>
            <h2 className="max-w-[12ch] text-balance text-h1 text-ink">
              Three systems. One won&rsquo;t wait.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-[42ch] text-pretty text-lead text-muted">
              Read the wall labels now — the works stay under wraps until opening. Step up to
              any room.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {CARDS.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.06} className={c.span ? "lg:col-span-2" : ""}>
              <SystemCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
