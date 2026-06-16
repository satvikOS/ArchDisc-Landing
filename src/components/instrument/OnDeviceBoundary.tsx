"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ============================================================
   OnDeviceBoundary — the privacy moat made visible.

   Wraps a focal apparatus (the LocalFleet lattice card, or the
   /archie Hero console) in a SEALED dashed perimeter labeled
   "LOCAL · ON-DEVICE" that data never crosses, with a mono
   readout holding "bytes leaving machine" pegged at 0 (tabular,
   slashed-zero) while an INTERNAL byte ticker streams — busy work
   happens INSIDE the boundary; nothing crosses it.

   The dashed frame is an etched-glass reticle: a hairline dashed
   border + a 1px inner highlight + L-shaped corner registration
   ticks so it reads incised into glass, not painted. On reveal a
   single "seal sweep" line travels the perimeter once then holds —
   the boundary closing. Reduced motion → static sealed frame,
   counter 0, internal ticker frozen at a resting in-band value.

   Monochrome; tone-aware (light = ink-on-paper, dark = paper-on-
   ink for the /archie ink world). Decorative chrome is aria-
   hidden; the bytes-leaving readout is real, SR-legible text.
   ============================================================ */

type Tone = "light" | "dark";

const TONE = {
  light: {
    border: "border-line-strong",
    highlight: "border-white/70",
    corner: "border-ink-mid/70",
    bannerBg: "bg-paper",
    labelText: "text-muted",
    labelDot: "bg-ink/45",
    pegText: "text-ink",
    pegFaint: "text-faint",
    tickFaint: "text-faint",
    sweep: "rgba(17,21,28,0.55)",
  },
  dark: {
    border: "border-white/14",
    highlight: "border-white/10",
    corner: "border-white/40",
    bannerBg: "bg-[#11151c]",
    labelText: "text-white/55",
    labelDot: "bg-white/55",
    pegText: "text-white/85",
    pegFaint: "text-white/40",
    tickFaint: "text-white/40",
    sweep: "rgba(250,250,250,0.6)",
  },
} as const;

/** An internal byte-throughput figure that scrolls INSIDE the boundary — a
 *  local-bus reading so the field reads "busy" while bytes-LEAVING stays 0.
 *  One motion value + animate(), written to the DOM via a ref (no setState in
 *  render, no setState in effect). Frozen at a resting in-band value under
 *  reduced motion. */
function InternalActivity({ tone, reduce }: { tone: Tone; reduce: boolean }) {
  const c = TONE[tone];
  const phase = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  // phase → a smooth-but-jittering kB/s figure (two detuned sines).
  const figure = (v: number) => {
    const a = Math.sin(v * 2.3) * 0.5 + 0.5;
    const b = Math.sin(v * 5.7 + 1.1) * 0.5 + 0.5;
    return (128 + Math.round((a * 0.7 + b * 0.3) * 871)).toLocaleString("en-US");
  };
  const reading = useTransform(phase, figure);

  useMotionValueEvent(reading, "change", (v) => {
    const el = ref.current;
    if (el) el.textContent = v;
  });

  useEffect(() => {
    if (reduce) return;
    const controls = animate(phase, 1000, {
      duration: 714, // ~1.4 phase-units/sec; continuous, never settles
      ease: "linear",
    });
    return () => controls.stop();
  }, [phase, reduce]);

  return (
    <span
      className={cn("u-spec inline-flex items-baseline gap-1.5", c.tickFaint)}
      aria-hidden
    >
      <span>on-bus</span>
      <span ref={ref} className="tabular-nums">
        {figure(0)}
      </span>
      <span>kB/s</span>
    </span>
  );
}

export function OnDeviceBoundary({
  children,
  label = "LOCAL · ON-DEVICE",
  tone = "light",
  showActivity = true,
  className,
  contentClassName,
}: {
  children: ReactNode;
  /** Corner banner text. */
  label?: string;
  /** 'light' = ink-on-paper · 'dark' = paper-on-ink (the /archie ink world). */
  tone?: Tone;
  /** Show the internal byte-throughput ticker (off → just the bytes-leaving peg). */
  showActivity?: boolean;
  className?: string;
  /** Extra classes on the inner content wrapper (e.g. inset padding). */
  contentClassName?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const c = TONE[tone];

  return (
    <div className={cn("relative", className)}>
      {/* ---- Sealed dashed perimeter (etched-glass reticle). Decorative. ---- */}
      {/* the seal: hairline dashed border */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[3px] border border-dashed",
          c.border,
        )}
        aria-hidden
      />
      {/* 1px inner highlight, inset — reads incised into glass, not painted */}
      <div
        className={cn(
          "pointer-events-none absolute inset-[1.5px] rounded-[2px] border border-dashed",
          c.highlight,
        )}
        aria-hidden
      />
      {/* L-shaped corner registration ticks — the four datum corners */}
      <CornerTicks color={c.corner} />
      {/* the seal sweep: one hairline runner that traces the perimeter once */}
      {!reduce && <SealSweep color={c.sweep} />}

      {/* ---- Corner banner — the named boundary. Real text. ---- */}
      <div className="pointer-events-none absolute -top-px left-5 z-10 -translate-y-1/2">
        <span
          className={cn(
            "u-label inline-flex items-center gap-1.5 px-2 py-0.5",
            c.bannerBg,
            c.labelText,
          )}
        >
          <span className={cn("h-1 w-1 rounded-full", c.labelDot)} aria-hidden />
          {label}
        </span>
      </div>

      {/* ---- Bytes-leaving peg (+ optional internal activity) on the bottom seam ---- */}
      <div className="pointer-events-none absolute -bottom-px right-5 z-10 flex translate-y-1/2 items-center">
        <div className={cn("inline-flex items-center gap-3 px-2.5 py-0.5", c.bannerBg)}>
          {showActivity && <InternalActivity tone={tone} reduce={reduce} />}
          <span className={cn("u-spec inline-flex items-baseline gap-1.5", c.pegFaint)}>
            <span aria-hidden>·</span>
            <span>bytes&nbsp;leaving&nbsp;machine</span>
            <span className={cn("font-mono tabular-nums", c.pegText)}>0</span>
          </span>
        </div>
      </div>

      {/* ---- The sealed contents — the lattice card / console live in here. ---- */}
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}

/** Four L-shaped corner registration ticks via bordered corner boxes. */
function CornerTicks({ color }: { color: string }) {
  const arm = "h-2.5 w-2.5";
  return (
    <div className="pointer-events-none absolute inset-1.5" aria-hidden>
      <span className={cn("absolute left-0 top-0 border-l border-t", arm, color)} />
      <span className={cn("absolute right-0 top-0 border-r border-t", arm, color)} />
      <span className={cn("absolute bottom-0 left-0 border-b border-l", arm, color)} />
      <span className={cn("absolute bottom-0 right-0 border-b border-r", arm, color)} />
    </div>
  );
}

/** A single hairline runner that traces the sealed perimeter once on reveal
 *  then holds — the boundary "closing". Pure transform animation along the
 *  four edges (no layout thrash). Mounted only when motion is allowed. */
function SealSweep({ color }: { color: string }) {
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: 1.15, ease: EASE });
    return () => controls.stop();
  }, [t]);

  // Map a single 0→1 progress around the rectangle's 4 edges. The runner is a
  // short bright segment; we move + rotate one element along top→right→bottom→left.
  const left = useTransform(t, (v) => `${edgePos(v).x}%`);
  const top = useTransform(t, (v) => `${edgePos(v).y}%`);
  const rotate = useTransform(t, (v) => `${edgeRot(v)}deg`);
  const opacity = useTransform(t, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);

  return (
    <motion.span
      className="pointer-events-none absolute z-[5] block h-px w-10 -translate-x-1/2 -translate-y-1/2"
      style={{
        left,
        top,
        rotate,
        opacity,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
      aria-hidden
    />
  );
}

/** Position (in % of the cell) of a point travelling clockwise around the
 *  perimeter, t in [0,1): top edge → right → bottom → left. */
function edgePos(t: number): { x: number; y: number } {
  const s = (t % 1) * 4;
  if (s < 1) return { x: s * 100, y: 0 }; // top: L→R
  if (s < 2) return { x: 100, y: (s - 1) * 100 }; // right: T→B
  if (s < 3) return { x: (3 - s) * 100, y: 100 }; // bottom: R→L
  return { x: 0, y: (4 - s) * 100 }; // left: B→T
}
/** Runner orientation per edge so the segment lies along the edge. */
function edgeRot(t: number): number {
  const s = (t % 1) * 4;
  if (s < 1) return 0; // horizontal
  if (s < 2) return 90; // vertical
  if (s < 3) return 0;
  return 90;
}
