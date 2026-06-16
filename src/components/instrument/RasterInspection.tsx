"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useInView,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
  type MotionValue,
} from "motion/react";
import {
  BAYER8,
  clamp,
  lerp,
  cssVar,
  usePrefersReducedMotion,
} from "@/lib/artkit";
import { EASE_SERVO } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * RasterInspection — the /precision signature: a measuring light-line that
 * rasters across the focal part and DIGITIZES its surface into a 1-bit ordered
 * (Bayer 8×8) dither value-map, line by line, as if a CMM optical head were
 * scanning it. As the scan front sweeps left→right it reveals the dithered
 * field behind it; ahead of it the plate is still un-sampled. A thin bright
 * etched-glass scan line rides the front, and a mono `σ / digitizing NN%`
 * caption tracks it. Scrub it back and the digitized map erases; scrub forward
 * and it rebuilds, settling into a crisp digitized portrait of the part.
 *
 * It REUSES the dither core of StressFieldHalftone — the same L-bracket
 * von-Mises field + BAYER8 ordered-dither halftone — but swaps the one-shot
 * timed wipe for an EXTERNALLY scrubbable 0..1 progress channel, so the reveal
 * is physically geared to scroll (or a hover/drag scrub).
 *
 * Progress (a single MotionValue) is painted to the canvas imperatively inside
 * a motion-value subscription + a ResizeObserver/IntersectionObserver effect —
 * never via setState in render or in an effect body (so it's lint-clean and
 * cheap). The canvas is dpr-capped (≤2) and paused off-screen.
 *
 * Monochrome only: the field reads `--color-paper` on the dark inspection table
 * (`dark`, the /precision default) or `--color-ink` on a light plate. Value,
 * texture and the single bright scan line carry the whole image — zero chroma.
 *
 * Reduced motion / coarse (touch) pointers → progress is pinned to 1: the
 * COMPLETE digitized value-map renders instantly, a crisp resting portrait,
 * with no scan line and no sweep. Decorative: the root is aria-hidden.
 *
 * @prop scrub      Progress driver:
 *                  · "play"  (default) — a one-shot servo scan-in the moment
 *                    the apparatus enters view; reverses + replays on re-enter.
 *                    Best for a first-viewport hero, where it always SHOWS the
 *                    digitizing sweep rather than starting mid-scroll.
 *                  · "scroll" — geared to scroll-into-view via useScroll, so
 *                    scrubbing the wheel rewinds/rebuilds the digitized map.
 *                  · "pointer" — the viewer hover/drag-scrubs the scan front.
 * @prop dark       Dark inspection table — dots paint in --color-paper. Default true.
 * @prop pitch      Halftone grid pitch in CSS px (default 7). Smaller = denser.
 * @prop className   Sizing / placement classes (spread onto the root).
 */
export interface RasterInspectionProps {
  scrub?: "play" | "scroll" | "pointer";
  dark?: boolean;
  pitch?: number;
  className?: string;
}

/* ----------------------------------------------------------------------------
   Geometry + field — the same L-bracket stress concentrator as
   StressFieldHalftone, authored once in a 0..100 space and shared by the canvas
   (field + clip) and the SVG overlay (edge, witness lines). Kept local so the
   scan reveal and the silhouette stay in exact lockstep. y is screen-down.
   --------------------------------------------------------------------------- */
const VB = 100;
const BACK_L = 16; // left (fixed) edge
const BACK_R = 40; // back-leg right edge
const ARM_T = 60; // arm top edge
const ARM_R = 86; // arm free end (right)
const ARM_B = 78; // arm bottom edge
const TOP = 18; // back-leg top
const BOT = 78; // back-leg bottom (== arm bottom)
const FILLET = 11; // inner re-entrant fillet radius
const FCX = BACK_R + FILLET; // fillet arc centre x
const FCY = ARM_T + FILLET; // fillet arc centre y

const EDGE_PATH =
  `M ${BACK_L} ${TOP} ` +
  `L ${BACK_R} ${TOP} ` +
  `L ${BACK_R} ${ARM_T} ` +
  `A ${FILLET} ${FILLET} 0 0 0 ${FCX} ${ARM_T + FILLET} ` +
  `L ${ARM_R} ${ARM_T + FILLET} ` +
  `L ${ARM_R} ${ARM_B} ` +
  `L ${BACK_L} ${BOT} Z`;

const LOAD_X = ARM_R - 6;
const ROOT_X = BACK_L;

/** Von-Mises-style scalar field over the silhouette, normalised 0..1. Mirrors
 *  StressFieldHalftone: bending gradient + fillet 1/r² concentrator + root edge,
 *  read here as the surface VALUE the optical head digitizes. */
function vonMises(x: number, y: number): number {
  const bend = clamp((LOAD_X - x) / (LOAD_X - ROOT_X), 0, 1);
  const dfx = x - FCX;
  const dfy = y - FCY;
  const r2f = dfx * dfx + dfy * dfy;
  const fillet = clamp(34 / (r2f + 6), 0, 1);
  const dRoot = Math.abs(x - ROOT_X);
  const root = clamp(1 - dRoot / 14, 0, 1) * 0.55;
  const v = 0.18 + bend * 0.62 + fillet * 0.9 + root * 0.5;
  return clamp(Math.pow(clamp(v, 0, 1), 0.85), 0, 1);
}

/** Build the clip Path2D from the same edge geometry, scaled to canvas px. */
function clipPath(scale: number): Path2D {
  const s = (n: number) => n * scale;
  const p = new Path2D();
  p.moveTo(s(BACK_L), s(TOP));
  p.lineTo(s(BACK_R), s(TOP));
  p.lineTo(s(BACK_R), s(ARM_T));
  const k = 0.5523 * FILLET;
  p.bezierCurveTo(
    s(BACK_R),
    s(ARM_T + k),
    s(FCX - FILLET + k),
    s(ARM_T + FILLET),
    s(FCX),
    s(ARM_T + FILLET),
  );
  p.lineTo(s(ARM_R), s(ARM_T + FILLET));
  p.lineTo(s(ARM_R), s(ARM_B));
  p.lineTo(s(BACK_L), s(BOT));
  p.closePath();
  return p;
}

export function RasterInspection({
  scrub = "play",
  dark = true,
  pitch = 7,
  className,
}: RasterInspectionProps) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // The single scrubbable progress channel, 0 (un-sampled plate) → 1 (fully
  // digitized portrait). Painted imperatively; never drives React state.
  const progress = useMotionValue(reduce ? 1 : 0);

  // --- Source: one-shot scan-in on enter ("play", the hero default) --------
  // useInView always runs; the effect only drives `progress` in "play" mode.
  const inView = useInView(rootRef, { margin: "-15% 0px -15% 0px" });
  useEffect(() => {
    if (reduce || scrub !== "play") return;
    // Scan in when seated in view; rewind off-screen so re-entry replays the
    // digitizing sweep (reversible, never a stale half-state at rest).
    const controls = inView
      ? animate(progress, 1, { duration: 1.15, ease: EASE_SERVO })
      : animate(progress, 0, { duration: 0.3, ease: EASE_SERVO });
    return () => controls.stop();
  }, [inView, reduce, scrub, progress]);

  // --- Source: scroll-into-view (geared scrub) -----------------------------
  // useScroll always runs (hooks can't be conditional); only "scroll" mode
  // subscribes its output to `progress`.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    // Start digitizing as the apparatus enters the lower viewport; finish a
    // little before it leaves the top, so the resting portrait holds on screen.
    offset: ["start 0.85", "center 0.45"],
  });
  const scrollDriven = useTransform(scrollYProgress, [0, 1], [0, 1], {
    clamp: true,
  });
  useMotionValueEvent(scrollDriven, "change", (v) => {
    if (reduce || scrub !== "scroll") return;
    progress.set(clamp(v, 0, 1));
  });

  // --- Source: pointer hover / drag scrub ----------------------------------
  // Coarse-pointer / no-hover devices never get the scrub handlers attached;
  // they fall through to the reduced-style resting frame below.
  useEffect(() => {
    if (reduce || scrub !== "pointer") return;
    const el = rootRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      progress.set(1); // touch / no-hover → resting digitized portrait
      return;
    }

    let dragging = false;
    const setFromClientX = (clientX: number, smooth: boolean) => {
      const rect = el.getBoundingClientRect();
      const t = clamp((clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      if (smooth) {
        animate(progress, t, { duration: 0.32, ease: EASE_SERVO });
      } else {
        progress.set(t);
      }
    };
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX, !dragging);
    const onDown = (e: PointerEvent) => {
      dragging = true;
      setFromClientX(e.clientX, false);
    };
    const onUp = () => {
      dragging = false;
    };
    const onLeave = () => {
      dragging = false;
      // Resolve to the complete digitized portrait when the cursor leaves, so
      // it never rests in a half-scanned (lesser) state.
      animate(progress, 1, { duration: 0.5, ease: EASE_SERVO });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, scrub, progress]);

  // --- Canvas: dpr-capped, off-screen-paused, painted on every progress change.
  // Mirrors useCanvas2D's lifecycle, but the field is revealed by the EXTERNAL
  // `progress` value rather than an internal timed ramp.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement ?? canvas;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let visible = true;

    const size = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };

    const paint = (p: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const scale = Math.min(w, h) / VB;
      const offX = (w - VB * scale) / 2;
      const offY = (h - VB * scale) / 2;
      const ink =
        cssVar(dark ? "--color-paper" : "--color-ink", canvas) ||
        (dark ? "#fafafa" : "#11151c");

      ctx.save();
      ctx.translate(offX, offY);
      ctx.clip(clipPath(scale));

      // The scan front, in the part's local px space. Everything left of it has
      // been digitized this frame; everything right of it is still un-sampled.
      const partW = VB * scale;
      const sweepX = partW * clamp(p, 0, 1);
      const softEdge = 6 * scale; // feather just behind the front → reads as motion

      ctx.fillStyle = ink;
      const step = Math.max(3, pitch);
      for (let py = 0; py <= partW; py += step) {
        for (let px = 0; px <= partW; px += step) {
          if (px > sweepX) break; // ahead of the scan front this frame
          let v = vonMises(px / scale, py / scale);
          if (v <= 0.02) continue;

          // Soft fade-in right at the front so freshly-sampled rows read as
          // freshly digitized rather than just appearing.
          const frontDist = sweepX - px;
          if (frontDist < softEdge) v *= clamp(frontDist / softEdge, 0, 1);
          if (v <= 0.02) continue;

          // Ordered (Bayer 8×8) dither — the only tonal primitive. Sub-threshold
          // cells stay blank so low-value regions thin into a 1-bit halftone.
          const bx = Math.round(px / step);
          const by = Math.round(py / step);
          const thresh = BAYER8[(by & 7) * 8 + (bx & 7)];
          if (v < thresh * 0.62) continue;

          const maxR = step * 0.52;
          const r = lerp(0.4, maxR, v);
          ctx.globalAlpha = lerp(0.45, 1, v);
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // The bright measuring scan line riding the front — an etched-glass
      // reticle (a soft value-lift wash + a crisp 1px bright core + a faint
      // inner highlight). Hidden at the extremes (nothing to scan) and under
      // reduced motion (resting portrait, no instrument in flight).
      if (!reduce && p > 0.002 && p < 0.999) {
        const lineX = sweepX;
        // a backlight wash bleeding a few px ahead of the front
        const wash = ctx.createLinearGradient(lineX - 4 * scale, 0, lineX + 7 * scale, 0);
        wash.addColorStop(0, withAlpha(ink, 0));
        wash.addColorStop(0.55, withAlpha(ink, dark ? 0.1 : 0.07));
        wash.addColorStop(1, withAlpha(ink, 0));
        ctx.fillStyle = wash;
        ctx.fillRect(lineX - 4 * scale, 0, 11 * scale, partW);

        ctx.globalAlpha = 1;
        ctx.fillStyle = ink;
        ctx.fillRect(lineX - 0.5, 0, 1, partW); // crisp bright core
        ctx.globalAlpha = 0.35;
        ctx.fillRect(lineX + 1, 0, 0.6, partW); // faint inner highlight
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    size();
    paint(progress.get());

    // Repaint on every progress change while visible.
    const unsub = progress.on("change", (v) => {
      if (visible) paint(v);
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible) paint(progress.get());
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      size();
      paint(progress.get());
    });
    ro.observe(parent);

    return () => {
      unsub();
      io.disconnect();
      ro.disconnect();
    };
  }, [dark, pitch, reduce, progress]);

  // Caption: a live `digitizing NN%` readout that tracks the scan, settling to
  // `digitized · in tol` at rest. Driven purely by motion-value transforms.
  const pct = useTransform(progress, (v) =>
    String(Math.round(clamp(v, 0, 1) * 100)).padStart(2, "0"),
  );
  const settled = useTransform(progress, (v): number => (v >= 0.999 ? 1 : 0));
  const scanning = useTransform(settled, (s): number => 1 - s);
  // Position the scan-line caption so it tracks the front horizontally.
  const captionLeft = useTransform(progress, (v) => `${clamp(v, 0.04, 0.96) * 100}%`);

  const stroke = dark ? "text-paper" : "text-ink";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "relative select-none",
        stroke,
        scrub === "pointer" && !reduce && "cursor-ew-resize",
        className,
      )}
    >
      {/* The digitized value-map (canvas) — dpr-capped, off-screen-paused. */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Crisp vector overlay: part silhouette edge + fixed-support hatch +
          a thin σ caption. The edge is the lightest persistent graphic; it is
          always present (the drawing the instrument is measuring against). */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        {/* part silhouette edge — the crispest line, the datum drawing */}
        <path
          d={EDGE_PATH}
          stroke="currentColor"
          strokeWidth={1.1}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* fixed-support hatch on the left edge (ground line + 45° ticks) */}
        <g
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={0.32}
          vectorEffect="non-scaling-stroke"
        >
          <line x1={BACK_L - 3} y1={TOP - 1} x2={BACK_L - 3} y2={BOT + 1} vectorEffect="non-scaling-stroke" />
          {Array.from({ length: 8 }, (_, i) => {
            const yy = TOP + ((BOT - TOP) / 7) * i;
            return (
              <line
                key={i}
                x1={BACK_L - 3}
                y1={yy}
                x2={BACK_L - 7}
                y2={yy + 4}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      </svg>

      {/* σ / digitizing caption — the mono instrument readout. Travels with the
          scan front while scanning, then crossfades to the seated `digitized`
          tag at rest. Built from motion-value transforms (no setState). */}
      <Caption
        captionLeft={captionLeft}
        pct={pct}
        scanning={scanning}
        settled={settled}
        dark={dark}
        reduce={reduce}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Caption — the σ readout. Split out so its motion-value subscriptions
   live in their own component and never touch React state. */
/* ------------------------------------------------------------------ */
function Caption({
  captionLeft,
  pct,
  scanning,
  settled,
  dark,
  reduce,
}: {
  captionLeft: MotionValue<string>;
  pct: MotionValue<string>;
  scanning: MotionValue<number>;
  settled: MotionValue<number>;
  dark: boolean;
  reduce: boolean;
}) {
  return (
    <>
      {/* live, travelling `σ · digitizing NN%` tag, hidden at rest */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute top-3 -translate-x-1/2"
          style={{ left: captionLeft, opacity: scanning }}
        >
          <span
            className={cn(
              "u-spec inline-flex items-center gap-1.5 whitespace-nowrap rounded-[2px] border px-1.5 py-0.5 text-[10px]",
              dark
                ? "border-paper/20 bg-ink/55 text-paper/75"
                : "border-line-strong bg-paper/70 text-ink/75",
            )}
          >
            <span aria-hidden>σ</span>
            <span className="tabular-nums">
              digitizing&nbsp;
              <motion.span>{pct}</motion.span>%
            </span>
          </span>
        </motion.div>
      )}

      {/* seated `digitized · in tol` tag, fades up as the scan completes */}
      <motion.div
        className="pointer-events-none absolute bottom-3 left-3"
        style={{ opacity: reduce ? 1 : settled }}
      >
        <span
          className={cn(
            "u-spec inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]",
            dark
              ? "border-paper/20 bg-ink/45 text-paper/70"
              : "border-line-strong bg-paper/70 text-ink/70",
          )}
        >
          <span aria-hidden>σ</span>
          <span
            className={cn(
              "inline-block h-1 w-1 rounded-full",
              dark ? "bg-paper/70" : "bg-ink/70",
            )}
          />
          digitized · in&nbsp;tol
        </span>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Color helper — apply alpha to a token color (hex or rgb output).    */
/* Monochrome only: alpha, never hue.                                  */
/* ------------------------------------------------------------------ */
function withAlpha(color: string, a: number): string {
  const c = color.trim();
  const hex = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3)
      h = h
        .split("")
        .map((ch) => ch + ch)
        .join("");
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  const rgb = c.match(/rgba?\(([^)]+)\)/i);
  if (rgb) {
    const parts = rgb[1].split(/[,/\s]+/).filter(Boolean).slice(0, 3);
    if (parts.length === 3) return `rgba(${parts.join(", ")}, ${a})`;
  }
  return c;
}
