import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Plate } from "@/components/visual/Plate";
import { Reveal } from "@/components/motion/Reveal";

type Card = {
  key: string;
  href: string;
  designation: string;
  codename: string;
  role: string;
  blurb: string;
  img: string;
  pos: string;
};

const CARDS: Card[] = [
  {
    key: "forge",
    href: "/forge",
    designation: "SYS-01",
    codename: "Forge",
    role: "Mechanical CAD",
    blurb: "A real CAD kernel. Solid parts, simulation and drawings you can manufacture.",
    img: "/img/forge-gears.jpg",
    pos: "center",
  },
  {
    key: "studio",
    href: "/studio",
    designation: "SYS-02",
    codename: "Studio",
    role: "3D creation",
    blurb: "Model, light and render — the breadth of a full 3D suite, driven in plain words.",
    img: "/img/studio-ceramic.jpg",
    pos: "center",
  },
  {
    key: "archie",
    href: "/archie",
    designation: "SYS-00",
    codename: "Archie",
    role: "The model",
    blurb: "The spine. You speak, it plans and builds — in both apps, on your own machine.",
    img: "/img/abstract-1.jpg",
    pos: "center",
  },
];

function SystemCard({ c }: { c: Card }) {
  return (
    <Link
      href={c.href}
      className="group relative block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
    >
      <Plate
        src={c.img}
        alt={`${c.role} — ${c.codename}`}
        sizes="(max-width: 1024px) 100vw, 33vw"
        position={c.pos}
        className="aspect-[4/5] w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(19,17,9,0.45) 0%, rgba(19,17,9,0.05) 38%, rgba(19,17,9,0.88) 100%)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">
            {c.designation} · {c.role}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/80">
            <span className="signal-dot h-1 w-1 rounded-full bg-clay" aria-hidden />
            soon
          </span>
        </div>
        <div>
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-display text-[clamp(2.4rem,1.4rem+4vw,3.6rem)] font-[800] uppercase leading-[0.85] tracking-[-0.04em] text-white">
              {c.codename}
            </h3>
            <span className="mb-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <p className="mt-3 max-w-[36ch] text-pretty text-body-sm text-white/80">{c.blurb}</p>
        </div>
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
            <h2 className="max-w-[14ch] text-balance text-h1 text-ink">Two apps. One model.</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-[44ch] text-pretty text-lead text-muted">
              Archie is the spine; Studio and Forge are the surfaces it acts on. You change
              what you want, not the tool. None of it is public yet — step into any room.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.07}>
              <SystemCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
