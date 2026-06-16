"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ============================================================
   GenerativeGrid — the precision drafting-plane substrate that
   supersedes the flat DotGrid. A CAD-viewport backdrop: a faint
   minor dot grid, periodic heavier major-gridlines, an origin
   crosshair with axis ticks, and rare "measured" mono annotations.
   Pure CSS layered backgrounds — zero JS, zero canvas. Free to
   render, trivially reduced-motion safe (it never loops).

   Visual registers (per the art direction): SUBSTRATE — quiet,
   structural, omnipresent. Reads as a CAD viewport's backdrop, not
   generic dot noise. Color is ALWAYS pulled from CSS tokens; the
   dark-field variant just swaps the line token to a paper-toned
   low-alpha white, so a dark gravity section flips one prop.

   @example
   //  Default light substrate behind a section:
   <section className="relative">
   <GenerativeGrid />
   …content…
   </section>

   //  Dark gravity field, looser grid, with axis crosshair + labels:
   <GenerativeGrid dark majorPitch={144} crosshair annotations />

   //  Bespoke "measured" callouts at fixed plane coordinates:
   <GenerativeGrid annotations={[
   { x: "12%", y: "22%", text: "Ø 60.0" },
   { x: "78%", y: "64%", text: "+X" },
   ]} />
   ============================================================ */

/** A single "measured" micro-label pinned to a plane coordinate (real DOM, not background). */
export type GridAnnotation = {
  /** Horizontal position — any CSS length/percentage from the left edge. */
  x: string;
  /** Vertical position — any CSS length/percentage from the top edge. */
  y: string;
  /** Mono text, e.g. an `Ø`, an axis label, or a stray dimension. */
  text: string;
};

export type GenerativeGridProps = {
  /** Extra classes; merged onto the absolutely-positioned root. Use for z-index / inset overrides. */
  className?: string;
  /** Pitch (px) of the heavier major gridlines. Default 120. */
  majorPitch?: number;
  /** Pitch (px) of the fine minor dot grid. Default 24. */
  minorSize?: number;
  /**
   * Radial vignette reach: the % at which the substrate fully fades to
   * transparent at the edges, so it never touches text. Default 72.
   */
  fade?: number;
  /** Draw an origin crosshair with axis ticks (positioned at `origin`). Default false. */
  crosshair?: boolean;
  /**
   * Crosshair / axis origin as `[x, y]` CSS positions. Default `["50%", "42%"]`,
   * matching the DotGrid vignette focus so the axes sit at the optical centre.
   */
  origin?: [string, string];
  /**
   * "Measured" mono annotations. `true` drops a small default set of CAD-flavoured
   * callouts; pass an array to place your own; omit/false for none. Default false.
   */
  annotations?: boolean | GridAnnotation[];
  /** Dark-field variant: swaps lines/dots to paper-toned low-alpha white for ink gravity sections. Default false. */
  dark?: boolean;
};

/** Default "measured" callouts — a stray Ø, a wall note, axis labels. Quiet CAD flavour. */
const DEFAULT_ANNOTATIONS: GridAnnotation[] = [
  { x: "13%", y: "24%", text: "Ø 60.0" },
  { x: "82%", y: "30%", text: "+X" },
  { x: "21%", y: "78%", text: "wall 2.0" },
  { x: "70%", y: "70%", text: "0,0" },
];

export function GenerativeGrid({
  className,
  majorPitch = 120,
  minorSize = 24,
  fade = 72,
  crosshair = false,
  origin = ["50%", "42%"],
  annotations = false,
  dark = false,
}: GenerativeGridProps) {
  const reduce = useReducedMotion();

  // One-time reveal: major gridlines wipe in via a mask-size transition on mount.
  // Reduced-motion → the resting (fully revealed) frame paints instantly with no
  // transition. No ambient motion, ever. Lazy-init from `reduce` so we never
  // call setState synchronously inside the effect.
  const [swept, setSwept] = useState(false);
  useEffect(() => {
    if (reduce) return; // resting frame is derived below, no state needed
    const raf = requestAnimationFrame(() => setSwept(true));
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  // `reduce` can resolve to `true` only after mount; derive the resting (fully
  // revealed) frame from it at render time so the major-line sweep is never
  // stuck at 0% — without a setState-in-effect.
  const revealed = !!reduce || swept;

  // Token-driven colors. Dark field swaps to paper-toned low-alpha white so the
  // whole variant is a single prop flip — no hardcoded chroma anywhere.
  const dot = dark ? "rgba(255,255,255,0.10)" : "var(--color-line-strong)";
  const major = dark ? "rgba(255,255,255,0.07)" : "var(--color-line-strong)";
  const axis = dark ? "rgba(255,255,255,0.22)" : "var(--color-line-strong)";
  const baseOpacity = dark ? 0.9 : 0.55;

  // Radial vignette so the substrate dies at the edges and never competes with text.
  const mask = `radial-gradient(ellipse 84% 74% at ${origin[0]} ${origin[1]}, black 6%, transparent ${fade}%)`;

  const [ox, oy] = origin;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {/* Layer 1 — fine minor dot grid. Layer 2/3 — major hairline gridlines (V + H).
          Stacked as one element so they share the vignette mask. The major lines
          wipe in once via mask-size; minor dots are present from the first paint. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `radial-gradient(${dot} 1px, transparent 1px)`,
            `linear-gradient(to right, ${major} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${major} 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: [
            `${minorSize}px ${minorSize}px`,
            `${majorPitch}px ${majorPitch}px`,
            `${majorPitch}px ${majorPitch}px`,
          ].join(", "),
          backgroundPosition: "0 0, 0 0, 0 0",
          opacity: baseOpacity,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />

      {/* Reveal sweep — a second copy of the heavier major lines that wipes in from the
          origin once on mount. Kept on its own layer so the reveal mask doesn't disturb
          the always-present minor dots. */}
      <div
        className={cn(
          "absolute inset-0",
          !reduce &&
            "transition-[mask-size,-webkit-mask-size] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
        style={{
          backgroundImage: [
            `linear-gradient(to right, ${major} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${major} 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: [
            `${majorPitch}px ${majorPitch}px`,
            `${majorPitch}px ${majorPitch}px`,
          ].join(", "),
          opacity: baseOpacity,
          maskImage: mask,
          WebkitMaskImage: mask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: `${ox} ${oy}`,
          WebkitMaskPosition: `${ox} ${oy}`,
          maskSize: revealed ? "200% 200%" : "0% 0%",
          WebkitMaskSize: revealed ? "200% 200%" : "0% 0%",
        }}
      />

      {/* Origin crosshair + axis ticks — the CAD-viewport "world origin" mark. */}
      {crosshair && (
        <div
          className="absolute"
          style={{ left: ox, top: oy, transform: "translate(-50%, -50%)" }}
        >
          {/* horizontal axis */}
          <span
            className="absolute top-1/2 left-1/2 h-px -translate-x-1/2 -translate-y-1/2"
            style={{ width: 56, backgroundColor: axis }}
          />
          {/* vertical axis */}
          <span
            className="absolute top-1/2 left-1/2 w-px -translate-x-1/2 -translate-y-1/2"
            style={{ height: 56, backgroundColor: axis }}
          />
          {/* center node */}
          <span
            className="absolute top-1/2 left-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: axis }}
          />
          {/* tick marks along the axes */}
          {[-24, -12, 12, 24].map((d) => (
            <span
              key={`hx${d}`}
              className="absolute top-1/2 left-1/2 h-[5px] w-px -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: axis, transform: `translate(${d}px, -50%)` }}
            />
          ))}
          {[-24, -12, 12, 24].map((d) => (
            <span
              key={`vy${d}`}
              className="absolute top-1/2 left-1/2 h-px w-[5px] -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: axis, transform: `translate(-50%, ${d}px)` }}
            />
          ))}
        </div>
      )}

      {/* "Measured" mono micro-labels — real DOM, not background. Very low opacity so
          they read as a faint draughtsman's margin note, never as content. */}
      {annotations &&
        (annotations === true ? DEFAULT_ANNOTATIONS : annotations).map((a, i) => (
          <span
            key={`${a.text}-${i}`}
            className={cn(
              "absolute font-mono whitespace-nowrap",
              dark ? "text-white" : "text-faint",
            )}
            style={{
              left: a.x,
              top: a.y,
              fontSize: "10px",
              letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums slashed-zero",
              opacity: dark ? 0.28 : 0.5,
              transform: "translate(-50%, -50%)",
            }}
          >
            {a.text}
          </span>
        ))}
    </div>
  );
}
