"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
} from "motion/react";
import { usePrefersReducedMotion, useFinePointer, clamp } from "@/lib/artkit";
import { EASE_SERVO } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ConstraintSolverBench — the FORGE signature interaction: drag an
 * under-constrained sketch profile to DOF 0.
 *
 * This evolves the static ParametricSketch into something you OPERATE. A
 * rectangular plate profile has one free corner handle (top-right vertex B).
 * Dragging it flexes the profile inside its remaining degrees of freedom. As
 * the handle crosses constraint thresholds, detents LOCK with a snap and the
 * live DOF readout ticks 3 → 2 → 1 → 0:
 *
 *   • VERTICAL  — the right edge B–C snaps plumb (B.x → nominal width).
 *   • HORIZONTAL — the top edge A–B snaps level (B.y → nominal top).
 *   • DIMENSION  — the overall width seats at its driven value (100.0).
 *
 * Each locked detent removes one DOF and freezes that coordinate. With all
 * three locked the sketch reads "DOF 0 · fully constrained ✓" and the profile
 * stiffens from grey "free" linework to solid ink. Pushing the handle past the
 * fully-constrained nominal (beyond tolerance once everything is locked)
 * flashes a brief "OVER-CONSTRAINED" and then self-heals back to the exact
 * DOF-0 resting configuration — the solver rejecting a redundant constraint.
 *
 * The geometry model is explicit, simple, and deterministic (no physics, no
 * randomness in the resting state). All live geometry rides motion values, so
 * there is no setState during render and no ref read/write in render; React
 * state changes (the DOF integer + status word) happen only inside pointer
 * event handlers and a motion-value subscription, never synchronously in an
 * effect body.
 *
 * Reduced motion / touch / no-hover render the fully-constrained solved sketch
 * at DOF 0 statically — a finished, correct drawing; dragging is disabled.
 *
 * Pure SVG + pointer events working in SVG user-space coordinates (no raycast).
 * Monochrome only: strokes/fills are currentColor, so the parent picks the
 * field with a text-* class.
 */

/* ---- viewBox + nominal (solved) geometry, drawing units ---- */
const VW = 360;
const VH = 280;

// Grounded corners (the datum edge A–D is fixed). B is the single free handle.
const A = { x: 96, y: 78 }; // top-left  (grounded)
const D = { x: 96, y: 206 }; // bottom-left (grounded)
const C_X = 264; // nominal right edge x (B and C share it when plumb)
const C_Y = 206; // bottom-right rides the base datum line (y fixed at D.y)

// Nominal resting position of the free handle B (the DOF-0 solution).
const B_NOM = { x: C_X, y: A.y };

// Handle travel envelope while under-constrained (SVG user space).
const X_MIN = 168;
const X_MAX = 300;
const Y_MIN = 44;
const Y_MAX = 150;

// Snap thresholds (user-space units) at which each detent locks.
const TOL_X = 11; // plumb: right edge seats on C_X
const TOL_Y = 11; // level: top edge seats on the datum top
const OVER_PUSH = 26; // push past nominal (with all locked) → over-constrained

const START_DOF = 3;

type Detent = "vertical" | "horizontal" | "dimension";
const DETENT_ORDER: Detent[] = ["vertical", "horizontal", "dimension"];

/* ============================================================
   The solver — a pure, deterministic function mapping a raw pointer position
   (clamped to the envelope) + the currently-locked detents to a resolved
   handle position, the resulting DOF, and which detents are satisfied. No
   state, no randomness. Locking is monotonic (once a detent locks it stays
   locked for the gesture) so DOF only ever falls — matching a real solver
   adding constraints.
   ============================================================ */
type SolveResult = {
  bx: number;
  by: number;
  dof: number;
  locked: Record<Detent, boolean>;
  over: boolean; // pushed past the fully-constrained nominal → redundant
};

function solve(
  rawX: number,
  rawY: number,
  prior: Record<Detent, boolean>,
): SolveResult {
  const locked: Record<Detent, boolean> = { ...prior };

  // Clamp the raw handle into the flex envelope.
  let bx = clamp(rawX, X_MIN, X_MAX);
  let by = clamp(rawY, Y_MIN, Y_MAX);

  // Three independent detents on distinct quantities so they lock in sequence:
  //
  //   HORIZONTAL — top edge level: B.y seats on the datum top (controlled by Y).
  //   VERTICAL   — right edge plumb: B.x seats on C_X      (controlled by X).
  //   DIMENSION  — overall width 100.0: the final driven size, which resolves
  //                the LAST degree of freedom once the corner is both level and
  //                plumb (i.e. the size is then exactly determined).
  //
  // Once a detent locks it stays locked for the gesture and snaps its coordinate.

  // HORIZONTAL.
  if (locked.horizontal || Math.abs(by - A.y) <= TOL_Y) {
    locked.horizontal = true;
    by = A.y;
  }
  // VERTICAL.
  if (locked.vertical || Math.abs(bx - C_X) <= TOL_X) {
    locked.vertical = true;
    bx = C_X;
  }
  // DIMENSION — auto-resolves the moment the corner is fully seated level+plumb;
  // it is the last constraint, the driven width.
  if (locked.horizontal && locked.vertical) {
    locked.dimension = true;
    bx = C_X;
    by = A.y;
  }

  const count =
    (locked.vertical ? 1 : 0) +
    (locked.horizontal ? 1 : 0) +
    (locked.dimension ? 1 : 0);
  const dof = START_DOF - count;

  // Over-constrained: fully locked, yet the pointer is still shoving well past
  // the seated nominal corner — a redundant constraint the solver must reject.
  const over =
    dof === 0 &&
    (Math.abs(rawX - C_X) > OVER_PUSH || Math.abs(rawY - A.y) > OVER_PUSH);

  return { bx, by, dof, locked, over };
}

/* ============================================================
   Small leaf renderers that subscribe to motion values via useTransform — so
   live geometry never touches React state and never reads ref.current in render.
   ============================================================ */

/** The four-vertex profile outline, recomputed from the live handle motion values. */
function ProfilePath({
  bx,
  by,
  solved,
  className,
  strokeWidth,
}: {
  bx: MotionValue<number>;
  by: MotionValue<number>;
  solved: MotionValue<number>;
  className?: string;
  strokeWidth: number;
}) {
  // A → B(handle) → C(rides base) → D → close. C.x follows the handle x so the
  // right edge stays a single edge; C.y is pinned to the base datum.
  const d = useTransform([bx, by], ([x, y]: number[]) => {
    return [
      `M ${A.x} ${A.y}`,
      `L ${x} ${y}`,
      `L ${x} ${C_Y}`,
      `L ${D.x} ${D.y}`,
      "Z",
    ].join(" ");
  });
  // Stroke opacity lifts from grey "free" to full ink "solved".
  const opacity = useTransform(solved, [0, 1], [0.46, 1]);
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      style={{ opacity }}
    />
  );
}

/** Faint plate fill that develops as the sketch solves (free → seated). */
function ProfileFill({
  bx,
  by,
  solved,
}: {
  bx: MotionValue<number>;
  by: MotionValue<number>;
  solved: MotionValue<number>;
}) {
  const d = useTransform([bx, by], ([x, y]: number[]) =>
    [
      `M ${A.x} ${A.y}`,
      `L ${x} ${y}`,
      `L ${x} ${C_Y}`,
      `L ${D.x} ${D.y}`,
      "Z",
    ].join(" "),
  );
  const opacity = useTransform(solved, [0, 1], [0.015, 0.05]);
  return <motion.path d={d} fill="currentColor" stroke="none" style={{ opacity }} />;
}

/** The draggable corner handle marker. */
function Handle({
  bx,
  by,
  active,
  solved,
}: {
  bx: MotionValue<number>;
  by: MotionValue<number>;
  active: MotionValue<number>;
  solved: MotionValue<number>;
}) {
  // Ring grows a touch while gripped; collapses to a solid seated vertex once solved.
  const r = useTransform([active, solved], ([a, s]: number[]) => 6 + a * 1.6 - s * 1.4);
  const ringOpacity = useTransform(solved, [0, 1], [0.9, 0]);
  const dotR = useTransform(solved, [0, 1], [2, 2.6]);
  return (
    <g>
      <motion.circle cx={bx} cy={by} r={r} fill="none" stroke="currentColor" strokeWidth={1.4} style={{ opacity: ringOpacity }} />
      <motion.circle cx={bx} cy={by} r={dotR} fill="currentColor" stroke="none" />
    </g>
  );
}

/** A detent indicator on an edge: a tick that lights when its constraint locks. */
function DetentGlyph({
  kind,
  bx,
  by,
  lit,
}: {
  kind: Detent;
  bx: MotionValue<number>;
  by: MotionValue<number>;
  lit: MotionValue<number>;
}) {
  // Anchor the glyph to the live edge / corner it governs.
  const gx = useTransform([bx, by], ([x]: number[]) => {
    if (kind === "horizontal") return (A.x + x) / 2;
    if (kind === "vertical") return x + 11;
    return x + 13; // dimension: confirmed at the seated corner, up-right
  });
  const gy = useTransform([bx, by], ([, y]: number[]) => {
    if (kind === "horizontal") return Math.min(A.y, y) - 11;
    if (kind === "vertical") return (y + C_Y) / 2;
    return y - 13; // dimension
  });
  const opacity = useTransform(lit, [0, 1], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.5, 1]);

  return (
    <motion.g style={{ opacity }}>
      <motion.g style={{ x: gx, y: gy, scale }}>
        {kind === "horizontal" && (
          <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
            <line x1={-5} y1={0} x2={5} y2={0} />
            <line x1={-5} y1={-3} x2={-5} y2={3} />
            <line x1={5} y1={-3} x2={5} y2={3} />
          </g>
        )}
        {kind === "vertical" && (
          <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
            <line x1={0} y1={-5} x2={0} y2={5} />
            <line x1={-3} y1={-5} x2={3} y2={-5} />
            <line x1={-3} y1={5} x2={3} y2={5} />
          </g>
        )}
        {kind === "dimension" && (
          <g stroke="currentColor" strokeWidth={1.3} fill="none">
            <circle cx={0} cy={0} r={4.2} />
            <path d="M -2 0 l 1.4 1.6 l 2.8 -3.4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </motion.g>
    </motion.g>
  );
}

/* ============================================================
   The DOF / status panel — a DRO-style readout strip. The DOF integer + the
   status word are React state, set ONLY inside event handlers (never in render,
   never synchronously in an effect). The bar fill rides a motion value.
   ============================================================ */
type Status = "under" | "solved" | "over";

function DofPanel({
  dof,
  status,
  fill,
}: {
  dof: number;
  status: Status;
  fill: MotionValue<number>;
}) {
  const x = 18;
  const y = VH - 34;
  const w = VW - 36;
  const h = 24;
  const barX = x + 152;
  const barW = w - (barX - x) - 14;
  const barY = y + h / 2;

  const word =
    status === "over"
      ? "OVER-CONSTRAINED"
      : status === "solved"
        ? "0 · FULLY CONSTRAINED"
        : `${dof} DOF · UNDER-CONSTRAINED`;

  return (
    <g>
      {/* DRO glass plate */}
      <rect
        x={x - 8}
        y={y - 6}
        width={w + 16}
        height={h + 4}
        rx={3}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.38}
      />
      <text
        x={x - 1}
        y={barY}
        dominantBaseline="central"
        className="fill-current font-mono"
        style={{ fontSize: 10, letterSpacing: "0.08em", opacity: 0.6 }}
      >
        DOF
      </text>
      {/* the live integer */}
      <text
        x={x + 44}
        y={barY}
        textAnchor="end"
        dominantBaseline="central"
        className="fill-current font-mono"
        style={{
          fontSize: 14,
          fontWeight: 500,
          fontVariantNumeric: "tabular-nums slashed-zero",
        }}
      >
        {dof}
      </text>
      {/* status word */}
      <text
        x={x + 56}
        y={barY}
        dominantBaseline="central"
        className="fill-current font-mono"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.07em",
          opacity: status === "over" ? 1 : 0.62,
        }}
      >
        {word}
      </text>
      {/* solve-progress track + fill */}
      <line x1={barX} y1={barY} x2={barX + barW} y2={barY} stroke="currentColor" strokeWidth={2.5} opacity={0.16} />
      <motion.line
        x1={barX}
        y1={barY}
        x2={barX + barW}
        y2={barY}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ pathLength: fill }}
      />
    </g>
  );
}

/* ============================================================
   The interactive bench.
   ============================================================ */
export function ConstraintSolverBench({
  className,
  /** Force the static solved frame regardless of capability (e.g. inside a
   *  reduced-motion screenshot harness). */
  staticSolved = false,
}: {
  className?: string;
  staticSolved?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const uid = useId().replace(/:/g, "");
  const gridId = `csb-grid-${uid}`;

  // Interactive only on a fine-pointer device with motion allowed.
  const interactive = fine && !reduce && !staticSolved;

  /* ---- live geometry: motion values (never setState in render) ---- */
  // SSR-safe defaults = the solved resting frame (capability is unknown until
  // hydration); the capability effect reseats to the under-constrained start
  // once `interactive` is confirmed true.
  const bx = useMotionValue(B_NOM.x);
  const by = useMotionValue(B_NOM.y);
  const active = useMotionValue(0); // 0→1 while gripped
  const solved = useMotionValue(1); // grey free → ink solved
  const litV = useMotionValue(1);
  const litH = useMotionValue(1);
  const litD = useMotionValue(1);
  const litFor = useCallback(
    (k: Detent) => (k === "vertical" ? litV : k === "horizontal" ? litH : litD),
    [litV, litH, litD],
  );
  // Solve-progress bar fill (fraction of DOF removed).
  const fill = useMotionValue(1);

  /* ---- the few pieces that legitimately are React state (set in handlers) ---- */
  const [dof, setDof] = useState(0);
  const [status, setStatus] = useState<Status>("solved");

  /* ---- locked detents persist across pointer moves of one gesture & the session.
          A ref is the authoritative model; we never read it during render. ---- */
  const lockedRef = useRef<Record<Detent, boolean>>({
    vertical: false,
    horizontal: false,
    dimension: false,
  });
  const overTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);

  /* ---- map a client point into SVG user space (no ref read during render) ---- */
  const toUser = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * VW,
      y: ((clientY - rect.top) / rect.height) * VH,
    };
  }, []);

  /* ---- apply a solve result to all motion values + state ---- */
  const apply = useCallback(
    (res: SolveResult, snap: boolean) => {
      lockedRef.current = res.locked;
      const opts = { duration: snap ? 0.16 : 0, ease: EASE_SERVO } as const;
      if (snap) {
        animate(bx, res.bx, opts);
        animate(by, res.by, opts);
      } else {
        bx.set(res.bx);
        by.set(res.by);
      }
      litV.set(res.locked.vertical ? 1 : 0);
      litH.set(res.locked.horizontal ? 1 : 0);
      litD.set(res.locked.dimension ? 1 : 0);
      const removed = START_DOF - res.dof;
      fill.set(removed / START_DOF);
      // The geometry stays VALID (inked) at DOF 0 even while the DRO flashes
      // "over-constrained" — the solver holds the solution and rejects the
      // redundant input, it does not un-solve.
      solved.set(res.dof === 0 ? 1 : 0);

      setDof(res.dof);
      setStatus(res.over ? "over" : res.dof === 0 ? "solved" : "under");
    },
    [bx, by, litV, litH, litD, fill, solved],
  );

  /* ---- self-heal an over-constrained shove back to the exact DOF-0 rest ---- */
  const heal = useCallback(() => {
    if (overTimer.current) clearTimeout(overTimer.current);
    overTimer.current = setTimeout(() => {
      animate(bx, B_NOM.x, { duration: 0.4, ease: EASE_SERVO });
      animate(by, B_NOM.y, { duration: 0.4, ease: EASE_SERVO });
      solved.set(1);
      fill.set(1);
      setStatus("solved");
      setDof(0);
    }, 220);
  }, [bx, by, solved, fill]);

  /* ---- pointer drag ---- */
  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      if (!interactive) return;
      e.preventDefault();
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      draggingRef.current = true;
      active.set(1);
    },
    [interactive, active],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      if (!interactive || !draggingRef.current) return;
      const p = toUser(e.clientX, e.clientY);
      if (!p) return;
      const res = solve(p.x, p.y, lockedRef.current);
      apply(res, false);
      if (res.over) heal();
      else if (overTimer.current) {
        clearTimeout(overTimer.current);
        overTimer.current = null;
      }
    },
    [interactive, toUser, apply, heal],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      if (!interactive) return;
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
      draggingRef.current = false;
      active.set(0);
      // Release snaps to the nearest valid configuration (locked detents seat).
      const res = solve(bx.get(), by.get(), lockedRef.current);
      apply(res, true);
    },
    [interactive, active, bx, by, apply],
  );

  /* ---- keyboard: arrow keys nudge the handle; Enter snaps to nearest valid;
          space auto-solves to DOF 0. Real, accessible operation. ---- */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGGElement>) => {
      if (!interactive) return;
      const STEP = e.shiftKey ? 14 : 5;
      let nx = bx.get();
      let ny = by.get();
      let handled = true;
      switch (e.key) {
        case "ArrowLeft":
          nx -= STEP;
          break;
        case "ArrowRight":
          nx += STEP;
          break;
        case "ArrowUp":
          ny -= STEP;
          break;
        case "ArrowDown":
          ny += STEP;
          break;
        case "Enter":
        case " ": {
          // Drive the solver to the seated nominal (auto-constrain).
          e.preventDefault();
          lockedRef.current = { vertical: true, horizontal: true, dimension: true };
          animate(bx, B_NOM.x, { duration: 0.45, ease: EASE_SERVO });
          animate(by, B_NOM.y, { duration: 0.45, ease: EASE_SERVO });
          litV.set(1);
          litH.set(1);
          litD.set(1);
          fill.set(1);
          solved.set(1);
          setDof(0);
          setStatus("solved");
          return;
        }
        default:
          handled = false;
      }
      if (!handled) return;
      e.preventDefault();
      const res = solve(nx, ny, lockedRef.current);
      apply(res, true);
    },
    [interactive, bx, by, litV, litH, litD, fill, solved, apply],
  );

  // Capability is only known after hydration: `fine` reads false during SSR and
  // the first client render, then may flip to true. When `interactive` settles
  // we (re)seat the bench: motion values reset to the under-constrained start,
  // or to the solved resting frame. State (dof/status) is set inside a rAF
  // callback — async, NOT synchronously in the effect body — so the
  // set-state-in-effect lint is satisfied. The ref reads/writes here are inside
  // the effect (not during render), which the refs lint allows.
  useEffect(() => {
    let raf = 0;
    if (interactive) {
      lockedRef.current = { vertical: false, horizontal: false, dimension: false };
      bx.set(196);
      by.set(120);
      active.set(0);
      solved.set(0);
      litV.set(0);
      litH.set(0);
      litD.set(0);
      fill.set(0);
      raf = requestAnimationFrame(() => {
        setDof(START_DOF);
        setStatus("under");
      });
    } else {
      lockedRef.current = { vertical: true, horizontal: true, dimension: true };
      bx.set(B_NOM.x);
      by.set(B_NOM.y);
      active.set(0);
      solved.set(1);
      litV.set(1);
      litH.set(1);
      litD.set(1);
      fill.set(1);
      raf = requestAnimationFrame(() => {
        setDof(0);
        setStatus("solved");
      });
    }
    return () => {
      cancelAnimationFrame(raf);
      if (overTimer.current) clearTimeout(overTimer.current);
    };
  }, [interactive, bx, by, active, solved, litV, litH, litD, fill]);

  return (
    <div className={cn("relative", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        className="h-full w-full text-ink"
        role="group"
        aria-label={
          interactive
            ? "Constraint solver bench. Focus the corner handle, then use arrow keys to move it and Enter to fully constrain the sketch to zero degrees of freedom."
            : "A fully constrained parametric sketch profile at zero degrees of freedom."
        }
      >
        <defs>
          <pattern id={gridId} width={16} height={16} patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth={0.6} opacity={0.12} />
          </pattern>
        </defs>

        {/* sketch grid field */}
        <rect x={0} y={0} width={VW} height={VH} fill={`url(#${gridId})`} stroke="none" />

        {/* construction skeleton — the datum lines the solver fits to */}
        <g stroke="currentColor" strokeWidth={1} strokeDasharray="2 5" strokeLinecap="round" opacity={0.3}>
          {/* base datum (grounded) */}
          <line x1={A.x} y1={C_Y} x2={X_MAX + 10} y2={C_Y} />
          {/* left datum (grounded) */}
          <line x1={A.x} y1={A.y - 14} x2={A.x} y2={C_Y} />
          {/* nominal top guide */}
          <line x1={A.x} y1={A.y} x2={X_MAX + 10} y2={A.y} />
          {/* nominal right guide */}
          <line x1={C_X} y1={Y_MIN - 6} x2={C_X} y2={C_Y} />
        </g>

        {/* grounded base — anchor hatch on the fixed edge */}
        <g stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" opacity={0.55}>
          <line x1={A.x} y1={C_Y} x2={C_X} y2={C_Y} />
          {Array.from({ length: 9 }, (_, i) => {
            const sx = A.x + 6 + i * ((C_X - A.x - 12) / 8);
            return <line key={i} x1={sx} y1={C_Y} x2={sx - 5} y2={C_Y + 6} strokeWidth={0.9} />;
          })}
        </g>

        {/* the developing plate fill + outline */}
        <ProfileFill bx={bx} by={by} solved={solved} />
        <ProfilePath bx={bx} by={by} solved={solved} strokeWidth={1.9} />

        {/* grounded corner markers (the fixed datum vertices) */}
        {[A, D].map((v, i) => (
          <g key={i} opacity={0.7}>
            <circle cx={v.x} cy={v.y} r={2.1} fill="currentColor" stroke="none" />
            <line x1={v.x - 6} y1={v.y + 6} x2={v.x + 6} y2={v.y + 6} stroke="currentColor" strokeWidth={1} opacity={0.5} />
          </g>
        ))}

        {/* detent glyphs that light as their constraints lock */}
        {DETENT_ORDER.map((k) => (
          <DetentGlyph key={k} kind={k} bx={bx} by={by} lit={litFor(k)} />
        ))}

        {/* overall width dimension under the plate (the driven dimension) */}
        <WidthDim bx={bx} solved={solved} />

        {/* the draggable / focusable handle */}
        <g
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          tabIndex={interactive ? 0 : -1}
          role={interactive ? "slider" : undefined}
          aria-label={interactive ? "Sketch corner handle — degrees of freedom" : undefined}
          aria-valuemin={interactive ? 0 : undefined}
          aria-valuemax={interactive ? START_DOF : undefined}
          aria-valuenow={interactive ? dof : undefined}
          aria-valuetext={
            interactive
              ? status === "over"
                ? "over-constrained, healing"
                : `${dof} degrees of freedom remaining`
              : undefined
          }
          style={{
            cursor: interactive ? "grab" : "default",
            touchAction: "none",
            outline: "none",
          }}
          className="csb-handle"
        >
          {/* generous invisible hit target around the live handle */}
          <HandleHit bx={bx} by={by} />
          <Handle bx={bx} by={by} active={active} solved={solved} />
        </g>

        {/* DOF / status DRO panel */}
        <DofPanel dof={dof} status={status} fill={fill} />
      </svg>

      {/* a11y status mirror + visible focus ring for the SVG handle */}
      <span className="sr-only" role="status" aria-live="polite">
        {status === "over"
          ? "Over-constrained — solver rejected redundant constraint, healing to zero degrees of freedom."
          : status === "solved"
            ? "Fully constrained. Zero degrees of freedom."
            : `${dof} degrees of freedom remaining.`}
      </span>

      <style>{`
        .csb-handle:focus-visible {
          outline: 2px solid color-mix(in srgb, currentColor 30%, transparent);
          outline-offset: 3px;
          border-radius: 2px;
        }
        .csb-handle:active { cursor: grabbing; }
      `}</style>
    </div>
  );
}

/** Invisible, generous hit target tracking the live handle. */
function HandleHit({ bx, by }: { bx: MotionValue<number>; by: MotionValue<number> }) {
  return <motion.circle cx={bx} cy={by} r={18} fill="transparent" stroke="none" />;
}

/** Overall width dimension below the plate; numeral seats at 100.0 when solved. */
function WidthDim({ bx, solved }: { bx: MotionValue<number>; solved: MotionValue<number> }) {
  const y = C_Y + 30;
  // Live width readout in nominal mm (the span A.x → C_X maps to 100.0).
  const widthText = useTransform([bx, solved], ([x, s]: number[]) => {
    if (s >= 0.999) return "100.0";
    const mm = ((x - A.x) / (C_X - A.x)) * 100;
    return mm.toFixed(1);
  });
  const opacity = useTransform(solved, [0, 1], [0.55, 0.85]);
  const midX = useTransform(bx, (x) => (A.x + x) / 2);

  return (
    <motion.g stroke="currentColor" strokeWidth={1} style={{ opacity }}>
      {/* witness lines — left fixed at the datum, right tracks the handle */}
      <line x1={A.x} y1={C_Y + 4} x2={A.x} y2={y + 6} opacity={0.5} />
      <motion.line x1={bx} y1={C_Y + 4} x2={bx} y2={y + 6} opacity={0.5} />
      {/* dimension line + arrowheads */}
      <motion.line x1={A.x} y1={y} x2={bx} y2={y} />
      <path d={`M${A.x} ${y} l6 -2.5 l0 5 Z`} fill="currentColor" stroke="none" />
      <motion.g style={{ x: bx }}>
        <path d={`M0 ${y} l-6 -2.5 l0 5 Z`} fill="currentColor" stroke="none" />
      </motion.g>
      {/* numeral (paper-knockout halo so it stays legible over the dim line) */}
      <motion.text
        x={midX}
        y={y - 5}
        textAnchor="middle"
        className="fill-current font-mono"
        stroke="var(--color-paper)"
        strokeWidth={3}
        paintOrder="stroke"
        style={{ fontSize: 11, fontVariantNumeric: "tabular-nums slashed-zero" }}
      >
        {widthText}
      </motion.text>
    </motion.g>
  );
}
