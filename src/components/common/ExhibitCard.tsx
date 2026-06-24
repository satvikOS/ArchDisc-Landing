"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Solid3D, type Solid3DVariant } from "@/components/artifacts/Solid3D";
import { GradientField } from "@/components/visual/GradientField";
import { Decrypt } from "@/components/fx/Decrypt";

type Exhibit = {
  key: string;
  href: string;
  codename: string;
  designation: string;
  role: string;
  blurb: string;
};

/** Per-product "medium" line for the wall label + which solid stands in for the
 *  veiled work. Grounded in what each system actually is. */
const PLATE: Record<string, { variant: Solid3DVariant; medium: string }> = {
  forge: { variant: "bracket", medium: "Native geometry kernel · OCCT · planegcs" },
  studio: { variant: "knot", medium: "Real-time creation surface · scenes · materials" },
  archie: { variant: "vessel", medium: "Local model fleet · language → geometry" },
};

/**
 * A veiled exhibit: a framed "work" you can't quite see yet, with a museum
 * wall-label beneath it. The whole card is the link into the system's room.
 */
export function ExhibitCard({ exhibit, index }: { exhibit: Exhibit; index: number }) {
  const plate = PLATE[exhibit.key] ?? PLATE.forge;
  const roomNo = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={exhibit.href}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris-magenta/40 focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
    >
      {/* The framed plate — a dark vitrine holding the veiled work */}
      <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line-strong bg-vault shadow-[0_26px_70px_-34px_rgba(12,19,34,0.55)] transition-shadow duration-500 group-hover:shadow-[0_34px_90px_-34px_rgba(216,60,200,0.45)]">
        <GradientField tone="vault" intensity={1} reactive={false} />
        <div className="absolute inset-0">
          <Solid3D variant={plate.variant} dark className="absolute inset-0" />
        </div>

        {/* the cloth — a frosted veil that lifts slightly on hover */}
        <div
          aria-hidden
          className="absolute inset-0 backdrop-blur-[6px] transition-all duration-500 group-hover:backdrop-blur-[2px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,14,26,0.10) 0%, rgba(10,14,26,0.30) 55%, rgba(10,14,26,0.78) 100%)",
          }}
        />

        {/* corner instrument marks */}
        <span className="absolute left-4 top-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/70">
          {exhibit.designation}
        </span>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          <span className="signal-dot h-1 w-1 rounded-full bg-signal" aria-hidden />
          on view soon
        </span>

        {/* title plate over the veil */}
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <span className="font-display text-[clamp(1.7rem,1rem+2.2vw,2.6rem)] font-semibold leading-none text-white">
            {exhibit.codename}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors group-hover:border-transparent group-hover:bg-iris-magenta group-hover:text-white">
            <ArrowUpRight size={16} />
          </span>
        </figcaption>
      </figure>

      {/* The wall label */}
      <div className="mt-4 border-t border-line pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
            Room {roomNo} · {exhibit.role}
          </span>
          <span className="font-mono text-[11px] text-faint">2026</span>
        </div>
        <p className="mt-2 text-body-sm text-muted">{exhibit.blurb}</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
          Medium:{" "}
          <Decrypt
            text={plate.medium}
            className="text-[11px] normal-case tracking-[0.12em] text-ink/70"
            duration={1100}
          />
        </p>
      </div>
    </Link>
  );
}
