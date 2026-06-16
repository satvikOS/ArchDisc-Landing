"use client";

import { useId, useMemo } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion, iso, catmullRom, type Pt } from "@/lib/artkit";
import { EASE, stagger, riseIn } from "@/lib/motion";

/* ============================================================
   ToolCallLedger — Archie's loop made visible.

   A prompt resolves into a short reasoning/plan phase, then an ordered
   stream of validated tool-calls that stamp in one row at a time (verb ·
   named params · status glyph), over a 1px construction spine with a node
   at every row, ending in a coherence-gate panel: checkValidity() → valid
   + a mini 4-node "editable feature tree" glyph.

   `twoPane` promotes the artifact to a hero copilot session: LEFT is the
   console (typed prompt → greyed reasoning that resolves → validated
   tool-call stream → coherence gate + feature tree), RIGHT is a geometry
   PREVIEW pane where a compact solid RESOLVES as the calls complete —
   wireframe construction → dimensioned solid drawn with SVG pathLength,
   ending with a Ø callout + ✓ valid. The whole thing reads:
   intent → reasoning → validated calls → real geometry.

   Hybrid (DOM rows + inline SVG spine + SVG feature-tree + SVG preview).
   Monochrome only — colour comes exclusively from text-* tokens /
   currentColor, so the `dark` tone just flips classes / inherits the field.

   Motion doctrine: PLAY ONCE THEN HOLD. Prompt types once, reasoning lines
   resolve, rows stamp in sequence, spine grows scaleY 0→1 underneath, gate
   + tree fade last, preview solid draws in lock-step. Reduced motion (via
   usePrefersReducedMotion) → resting frame painted instantly: no typing,
   no draw-on, no whileInView gating — `animate` drives the final state.

   Props (all optional — `<ToolCallLedger />` renders standalone):
   @prop prompt        Prompt string typed on the header row.
   @prop calls         Ordered tool-calls: { verb, args, status:'ok'|'healed' }.
   @prop gateLabel     Coherence-gate caption (mono).
   @prop showTree      Render the editable feature-tree glyph in the gate panel.
   @prop showReasoning Render the greyed reasoning/plan lines (defaults to twoPane).
   @prop reasoning     Override the reasoning/plan lines.
   @prop twoPane       Promote to LEFT console + RIGHT geometry-preview hero.
   @prop variant       'hero' (full readout) | 'compact' (3-row inline).
   @prop tone          'light' (ink on paper) | 'dark' (paper on ink field).
   @prop trigger       'view' (stamp when scrolled in) | 'load' (on mount).
   @prop startDelay    Seconds before the choreography begins.
   @prop className      Sizing / layout overrides on the aria-hidden root.
   ============================================================ */

export type ToolStatus = "ok" | "healed";
export type ToolCall = { verb: string; args: string; status?: ToolStatus };

type Variant = "hero" | "compact";
type Tone = "light" | "dark";
type Trigger = "view" | "load";

const DEFAULT_PROMPT =
  "A wall-mount bracket, 100 mm wide, two M6 holes 60 mm apart, 4 mm wall, fillet the inside corners.";

const DEFAULT_CALLS: ToolCall[] = [
  { verb: "sketch.rect", args: "width=100, height=40", status: "ok" },
  { verb: "part.extrude", args: "distance=4", status: "ok" },
  { verb: "part.holes", args: 'd=6, pitch=60, std="M6"', status: "ok" },
  { verb: "part.filletEdges", args: "ids=[inner], r=3", status: "healed" },
  { verb: "part.shell", args: "thickness=4", status: "ok" },
  { verb: "heal.checkValidity", args: "", status: "ok" },
];

const COMPACT_CALLS: ToolCall[] = [
  { verb: "sketch.rect", args: "width=100, height=40", status: "ok" },
  { verb: "part.extrude", args: "distance=4", status: "ok" },
  { verb: "heal.checkValidity", args: "", status: "ok" },
];

const DEFAULT_REASONING = [
  "parse intent · base plate + 2 fastener bores + relieved corners",
  "select datum · sketch on XY, extrude +Z, M6 clearance from std table",
  "plan 5 ops · sketch → extrude → holes → fillet → shell, then validate",
];

/* ---- per-row stamp: rise into place, status glyph fades a touch later ---- */
const rowV: Variants = riseIn;

const charV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.001 } },
};

const fadeV: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: d },
  }),
};

/* reasoning line: greyed-in placeholder that "resolves" to settled ink ---- */
const reasonV: Variants = {
  hidden: { opacity: 0, x: -4 },
  show: (d: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE, delay: d },
  }),
};

const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.55, ease: EASE, delay: d },
      opacity: { duration: 0.2, delay: d },
    },
  }),
};

export function ToolCallLedger({
  prompt,
  calls,
  gateLabel = "coherence gate · checkValidity() → valid",
  showTree = true,
  showReasoning,
  reasoning,
  twoPane = false,
  variant = "hero",
  tone = "light",
  trigger = "view",
  startDelay = 0,
  className,
}: {
  prompt?: string;
  calls?: ToolCall[];
  gateLabel?: string;
  showTree?: boolean;
  showReasoning?: boolean;
  reasoning?: string[];
  twoPane?: boolean;
  variant?: Variant;
  tone?: Tone;
  trigger?: Trigger;
  startDelay?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const compact = variant === "compact";
  const dark = tone === "dark";
  // Two-pane is a hero device; compact never splits.
  const split = twoPane && !compact;
  // Reasoning shows by default whenever we're in the hero copilot layout.
  const withReasoning = (showReasoning ?? split) && !compact;

  const promptText = prompt ?? DEFAULT_PROMPT;
  const rows = useMemo(
    () => calls ?? (compact ? COMPACT_CALLS : DEFAULT_CALLS),
    [calls, compact],
  );
  const reasonLines = useMemo(
    () => (withReasoning ? (reasoning ?? DEFAULT_REASONING) : []),
    [withReasoning, reasoning],
  );

  // Choreography timing (seconds). Prompt types, reasoning resolves, rows
  // stamp, gate + preview land last — one shared timeline across both panes.
  const rowStep = 0.1;
  const reasonStep = 0.16;
  const typeDur = compact ? 0.32 : Math.min(0.6, promptText.length * 0.018);
  const reasonStart = startDelay + (compact ? 0.18 : 0.32) + typeDur;
  const reasonSpan = reasonLines.length * reasonStep + (withReasoning ? 0.18 : 0);
  const rowsStart = reasonStart + reasonSpan;
  const gateDelay = rowsStart + rows.length * rowStep + 0.18;
  // Preview solid resolves in step with the calls, settling just before the gate.
  const previewBase = rowsStart + 0.1;
  const previewValid = gateDelay + 0.1;

  // Resolve the "trigger" into the right motion props for a parent orchestrator.
  const orchestrate = (delayChildren: number, childDelay: number) => {
    const variants = stagger(childDelay, delayChildren);
    if (reduce) return { variants, initial: false, animate: "show" } as const;
    if (trigger === "load")
      return { variants, initial: "hidden", animate: "show" } as const;
    return {
      variants,
      initial: "hidden",
      whileInView: "show",
      viewport: { once: true, margin: "-60px" },
    } as const;
  };

  // Single-element reveal (gate panel / spine) sharing the same trigger.
  const revealProps = (delay: number) => {
    if (reduce) return { initial: false, animate: "show", custom: 0 } as const;
    if (trigger === "load")
      return { initial: "hidden", animate: "show", custom: delay } as const;
    return {
      initial: "hidden",
      whileInView: "show",
      viewport: { once: true, margin: "-60px" },
      custom: delay,
    } as const;
  };

  // Token-driven colour. Dark variant reads paper-coloured strokes/text.
  const c = dark
    ? {
        cardBorder: "border-white/12",
        cardBg: "bg-transparent",
        divider: "border-white/10",
        fieldBg: "bg-white/[0.03]",
        fieldBorder: "border-white/12",
        label: "text-white/45",
        promptInk: "text-white/85",
        caret: "bg-white/60",
        spine: "bg-white/15",
        node: "bg-white/55",
        nodeStrong: "bg-white",
        verb: "text-white",
        args: "text-white/55",
        statusOk: "text-white",
        statusHealed: "text-white/45",
        gateBorder: "border-white/15",
        gateInk: "text-white/85",
        treeStroke: "text-white/45",
        glyphInk: "text-white",
        reasonInk: "text-white/55",
        paneInk: "text-white",
        paneFaint: "text-white/45",
        paneField: "bg-white/[0.02]",
      }
    : {
        cardBorder: "border-line-strong",
        cardBg: "bg-surface",
        divider: "border-line",
        fieldBg: "bg-paper",
        fieldBorder: "border-line",
        label: "text-faint",
        promptInk: "text-ink-soft",
        caret: "bg-ink/60",
        spine: "bg-line-strong",
        node: "bg-faint",
        nodeStrong: "bg-ink",
        verb: "text-ink",
        args: "text-muted",
        statusOk: "text-ink",
        statusHealed: "text-faint",
        gateBorder: "border-line",
        gateInk: "text-ink",
        treeStroke: "text-faint",
        glyphInk: "text-ink",
        reasonInk: "text-muted",
        paneInk: "text-ink",
        paneFaint: "text-faint",
        paneField: "bg-paper",
      };

  const rowPadY = compact ? "py-1.5" : "py-2";
  const rowText = compact ? "text-[11px]" : "text-[12px]";

  // ── The console body (prompt → reasoning → calls → gate). Shared by both
  //    the single-pane card and the two-pane left panel so existing callers
  //    keep byte-identical output when `twoPane` is unset. ─────────────────
  const consoleBody = (
    <>
      {/* prompt field — typed once, then held */}
      <div className={cn("border-b p-4", c.divider)}>
        <div className="mb-2 flex items-center justify-between">
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.16em]",
              c.label,
            )}
          >
            prompt
          </span>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.16em]",
              c.label,
            )}
          >
            archie
          </span>
        </div>
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-[2px] border px-3 py-2.5 font-mono leading-snug",
            compact ? "text-[11.5px]" : "text-[12.5px]",
            c.fieldBorder,
            c.fieldBg,
            c.promptInk,
          )}
        >
          <span className={cn("shrink-0", c.label)}>›</span>
          {reduce ? (
            <span className="whitespace-pre-wrap break-words">{promptText}</span>
          ) : (
            <motion.span
              className="whitespace-pre-wrap break-words"
              {...orchestrate(startDelay + (compact ? 0.1 : 0.15), 0.018)}
            >
              {promptText.split("").map((ch, i) => (
                <motion.span key={i} variants={charV}>
                  {ch}
                </motion.span>
              ))}
            </motion.span>
          )}
          <span
            className={cn(
              "ml-0.5 inline-block h-3.5 w-px shrink-0 self-end",
              c.caret,
            )}
          />
        </div>
      </div>

      {/* reasoning / plan — greyed lines that resolve before the calls */}
      {withReasoning && reasonLines.length > 0 && (
        <div className={cn("border-b px-4 pt-3.5 pb-3", c.divider)}>
          <span
            className={cn(
              "mb-2.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em]",
              c.label,
            )}
          >
            <ThinkingGlyph reduce={reduce} className={c.label} />
            reasoning
          </span>
          <motion.ul
            className="flex flex-col gap-1.5"
            {...orchestrate(reasonStart, reasonStep)}
          >
            {reasonLines.map((line, i) => (
              <motion.li
                key={i}
                variants={reasonV}
                className={cn(
                  "flex items-start gap-2 font-mono text-[11px] leading-snug",
                  c.reasonInk,
                )}
              >
                <span className={cn("mt-px shrink-0", c.label)}>·</span>
                <span className="min-w-0">{line}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}

      {/* tool-call ledger — rows stamp over a drawing spine */}
      <div className="p-4">
        <span
          className={cn(
            "mb-3 block font-mono text-[10px] uppercase tracking-[0.16em]",
            c.label,
          )}
        >
          tool-calls
        </span>

        <motion.div className="relative" {...orchestrate(rowsStart, rowStep)}>
          {/* construction spine — 1px, grows scaleY 0→1 underneath the rows.
              When reduced motion resolves, `animate` drives the grown resting
              frame immediately, independent of scroll. */}
          <motion.span
            className={cn(
              "absolute left-[3px] top-1 z-0 w-px origin-top",
              c.spine,
            )}
            style={{ bottom: "0.5rem" }}
            initial={{ scaleY: 0 }}
            {...(reduce
              ? { animate: { scaleY: 1 } }
              : trigger === "load"
                ? { animate: { scaleY: 1 } }
                : {
                    whileInView: { scaleY: 1 },
                    viewport: { once: true, margin: "-60px" },
                  })}
            transition={{
              duration: reduce ? 0 : 0.6,
              ease: EASE,
              delay: reduce ? 0 : rowsStart,
            }}
          />

          <div className="relative z-10 flex flex-col">
            {rows.map((call, i) => {
              const healed = call.status === "healed";
              const last = i === rows.length - 1;
              return (
                <motion.div
                  key={`${call.verb}-${i}`}
                  variants={rowV}
                  className={cn(
                    "relative flex items-baseline gap-3 pl-5",
                    rowPadY,
                    !last && "border-b",
                    !last && c.divider,
                  )}
                >
                  {/* node on the spine, pinned to this row's first text baseline */}
                  <span
                    className={cn(
                      "absolute left-[3px] top-[0.95em] h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full",
                      healed ? c.node : c.nodeStrong,
                    )}
                  />
                  <span className={cn("shrink-0 font-mono text-[10px]", c.label)}>
                    →
                  </span>
                  <span
                    className={cn("min-w-0 flex-1 truncate font-mono", rowText)}
                  >
                    <span className={cn("font-medium", c.verb)}>{call.verb}</span>
                    <span className={c.label}>(</span>
                    <span className={c.args}>{call.args}</span>
                    <span className={c.label}>)</span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono",
                      compact ? "text-[10px]" : "text-[11px]",
                      healed ? c.statusHealed : c.statusOk,
                    )}
                  >
                    {healed ? "± healed" : "✓"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* coherence-gate panel — fades in last */}
        <motion.div
          className={cn(
            "mt-4 flex items-center gap-3 rounded-[2px] border px-3.5 py-3",
            c.gateBorder,
          )}
          variants={fadeV}
          {...revealProps(reduce ? 0 : gateDelay)}
        >
          {showTree && (
            <FeatureTreeGlyph
              className={cn("shrink-0", c.treeStroke)}
              nodeClass={c.glyphInk}
              reduce={reduce}
              draw={!reduce}
              delay={gateDelay + 0.12}
              trigger={trigger}
            />
          )}
          <div className="min-w-0">
            <p
              className={cn(
                "flex items-center gap-1.5 font-mono leading-tight",
                compact ? "text-[11px]" : "text-[12px]",
                c.gateInk,
              )}
            >
              <span className={c.statusOk}>✓</span>
              <span className="truncate">{gateLabel}</span>
            </p>
            {!compact && (
              <p
                className={cn(
                  "mt-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                  c.label,
                )}
              >
                editable feature tree · live
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );

  // ── Single-pane (default) — identical structure to the original. ────────
  if (!split) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "overflow-hidden rounded-[2px] border",
          c.cardBorder,
          c.cardBg,
          className,
        )}
      >
        {consoleBody}
      </div>
    );
  }

  // ── Two-pane hero — LEFT console · RIGHT geometry preview. ───────────────
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid overflow-hidden rounded-[2px] border md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]",
        c.cardBorder,
        c.cardBg,
        className,
      )}
    >
      {/* LEFT — the live console */}
      <div className={cn("min-w-0 border-b md:border-b-0 md:border-r", c.divider)}>
        {consoleBody}
      </div>

      {/* RIGHT — geometry preview pane: wireframe → dimensioned solid */}
      <div className={cn("relative flex min-w-0 flex-col", c.paneField)}>
        <div
          className={cn(
            "flex items-center justify-between border-b px-4 py-3",
            c.divider,
          )}
        >
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.16em]",
              c.paneFaint,
            )}
          >
            preview
          </span>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.16em]",
              c.paneFaint,
            )}
          >
            kernel
          </span>
        </div>
        <div className="relative min-h-[14rem] flex-1 p-4">
          <BracketPreview
            className={cn("h-full w-full", c.paneInk)}
            reduce={reduce}
            trigger={trigger}
            base={previewBase}
            validAt={previewValid}
            faintClass={c.paneFaint}
          />
        </div>
      </div>
    </div>
  );
}

/* ── live "thinking" glyph: three dots whose value cycles, then settles ── */
function ThinkingGlyph({
  reduce,
  className,
}: {
  reduce: boolean;
  className?: string;
}) {
  // A 9px three-dot indicator. When motion is allowed, the dots pulse once
  // (staggered) then hold full — never an ambient loop near text.
  return (
    <motion.svg
      viewBox="0 0 18 6"
      fill="none"
      aria-hidden="true"
      className={cn("h-[6px] w-[18px]", className)}
    >
      {[3, 9, 15].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={3}
          r={1.6}
          fill="currentColor"
          initial={reduce ? false : { opacity: 0.25 }}
          animate={{ opacity: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE, delay: 0.2 + i * 0.12 }
          }
        />
      ))}
    </motion.svg>
  );
}

/* ── mini editable-feature-tree glyph: root → 3 children, elbow links ── */
function FeatureTreeGlyph({
  className,
  nodeClass,
  reduce,
  draw,
  delay,
  trigger,
}: {
  className?: string;
  nodeClass: string;
  reduce: boolean;
  draw: boolean;
  delay: number;
  trigger: Trigger;
}) {
  // Geometry: root node at left-middle, a vertical trunk, three elbow
  // connectors out to three child nodes stacked on the right.
  const rootX = 5;
  const rootY = 18;
  const childX = 28;
  const childYs = [6, 18, 30];
  const branchX = 14; // where the trunk runs vertically

  const linkProps = (d: number) => {
    if (!draw) return { initial: false, animate: "show", custom: 0 } as const;
    if (trigger === "load")
      return { initial: "hidden", animate: "show", custom: d } as const;
    return {
      initial: "hidden",
      whileInView: "show",
      viewport: { once: true, margin: "-60px" },
      custom: d,
    } as const;
  };

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
    >
      {/* trunk from root, branching to each child via an elbow */}
      <motion.path
        d={`M ${rootX} ${rootY} H ${branchX} M ${branchX} ${childYs[0]} V ${childYs[2]}`}
        stroke="currentColor"
        strokeWidth={1}
        variants={!reduce ? drawV : undefined}
        {...linkProps(delay)}
      />
      {childYs.map((cy, i) => (
        <motion.path
          key={cy}
          d={`M ${branchX} ${cy} H ${childX}`}
          stroke="currentColor"
          strokeWidth={1}
          variants={!reduce ? drawV : undefined}
          {...linkProps(delay + 0.06 + i * 0.05)}
        />
      ))}
      {/* root node (filled) */}
      <circle
        cx={rootX}
        cy={rootY}
        r={2.1}
        className={cn("fill-current", nodeClass)}
      />
      {/* child nodes (hollow) */}
      {childYs.map((cy) => (
        <circle
          key={cy}
          cx={childX}
          cy={cy}
          r={1.9}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}

/* ============================================================
   BracketPreview — the RIGHT pane's resolving geometry.

   A compact wall-mount bracket (the default prompt's part) drawn in 2:1
   isometric as the calls land: dashed construction box → solid top face +
   two extruded side walls → two M6 bores with a healed inside fillet →
   a Ø dimension witness + a "✓ valid" coherence stamp. Pure SVG path-draw
   (pathLength), monochrome via currentColor; the parent supplies the field
   through a text-* class. Plays once then holds; reduced motion snaps to the
   resting frame (animate drives the final state, no draw-on, no whileInView).
   ============================================================ */
function BracketPreview({
  className,
  reduce,
  trigger,
  base,
  validAt,
  faintClass,
}: {
  className?: string;
  reduce: boolean;
  trigger: Trigger;
  base: number; // seconds: when the solid begins resolving
  validAt: number; // seconds: when the Ø dim + valid stamp land
  faintClass: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const arrowId = `tcl-arrow-${uid}`;

  // --- Geometry: an L-bracket footprint extruded a small amount, in iso. ---
  // Plan footprint corners (x,z) of the base plate, before extrusion.
  const W = 100; // plate width
  const D = 56; // plate depth
  const H = 14; // extrude height (the wall)
  const S = 0.92; // model→viewBox scale
  const OX = 152; // iso origin x in viewBox
  const OY = 96; // iso origin y in viewBox

  // Project a model point (x right, y up, z depth) into viewBox space using
  // artkit's shared 2:1 iso. artkit's iso returns screen-down y already
  // (taller y → smaller value), so we add it onto the origin.
  const P = (x: number, y: number, z: number): Pt => {
    const p = iso(x, y, z);
    return { x: OX + p.x * S, y: OY + p.y * S };
  };

  // Footprint corners (clockwise), centred on origin.
  const x0 = -W / 2;
  const x1 = W / 2;
  const z0 = -D / 2;
  const z1 = D / 2;

  // Top-face quad (y = H) and bottom-face quad (y = 0).
  const topA = P(x0, H, z0);
  const topB = P(x1, H, z0);
  const topC = P(x1, H, z1);
  const topD = P(x0, H, z1);
  const botA = P(x0, 0, z0);
  const botB = P(x1, 0, z0);
  const botC = P(x1, 0, z1);

  // Solid silhouette + visible edges as one cohesive outline.
  const topFace = `M ${topA.x} ${topA.y} L ${topB.x} ${topB.y} L ${topC.x} ${topC.y} L ${topD.x} ${topD.y} Z`;
  // The two visible vertical faces (right + front), drawn as edge runs that
  // close the extruded solid down from the top-face rim.
  const frontWalls =
    `M ${topB.x} ${topB.y} L ${botB.x} ${botB.y}` +
    ` L ${botC.x} ${botC.y} L ${topC.x} ${topC.y}` +
    ` M ${botB.x} ${botB.y} L ${botA.x} ${botA.y} L ${topA.x} ${topA.y}`;

  // Construction wireframe: the dashed bounding box (top + bottom + verticals).
  const wire =
    `${topFace}` +
    ` M ${botA.x} ${botA.y} L ${botB.x} ${botB.y} L ${botC.x} ${botC.y}` +
    ` M ${topA.x} ${topA.y} L ${botA.x} ${botA.y}` +
    ` M ${topB.x} ${topB.y} L ${botB.x} ${botB.y}` +
    ` M ${topC.x} ${topC.y} L ${botC.x} ${botC.y}`;

  // Two M6 bores on the top face, 60 mm apart, centred. Drawn as squashed
  // ellipses (iso circles) — the iso of a circle radius r in the XZ plane.
  const bore = (cxModel: number) => {
    const c = P(cxModel, H, 0);
    return { cx: c.x, cy: c.y };
  };
  const boreL = bore(-30);
  const boreR = bore(30);
  // Iso circle: an ellipse rotated to the iso plane. We approximate with a
  // 2:1-squashed ellipse aligned to the iso diamond — drawn via catmull-rom
  // through 8 projected points for a true iso ring (no chroma, hairline).
  const isoRing = (cxModel: number, r: number): string => {
    const pts: Pt[] = [];
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      pts.push(P(cxModel + Math.cos(a) * r, H, Math.sin(a) * r));
    }
    return catmullRom(pts, true);
  };
  const ringL = isoRing(-30, 9);
  const ringR = isoRing(30, 9);

  // Healed inside-corner fillet: a small arc tucked at one top corner, the
  // "± healed" op made visible as a rounded relief.
  const filletCorner = P(x0 + 14, H, z1 - 14);
  const filletR = 8;

  // Ø dimension witness across the two bore centres (the 60 mm pitch),
  // drawn above the top face as a horizontal leader with arrowheads.
  const dimY = Math.min(topA.y, topB.y) - 22;
  const dimL = { x: boreL.cx, y: dimY };
  const dimR = { x: boreR.cx, y: dimY };

  // Motion driver: reduced → snap; load → draw on mount; view → draw in view.
  const svgMotion = reduce
    ? ({ initial: false, animate: "show" } as const)
    : trigger === "load"
      ? ({ initial: "hidden", animate: "show" } as const)
      : ({
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "-60px" },
        } as const);

  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (d: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : d },
        opacity: { duration: reduce ? 0 : 0.22, delay: reduce ? 0 : d },
      },
    }),
  };
  const fade = (target = 1): Variants => ({
    hidden: { opacity: 0 },
    show: (d: number) => ({
      opacity: target,
      transition: { duration: reduce ? 0 : 0.45, ease: EASE, delay: reduce ? 0 : d },
    }),
  });
  const stamp: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    show: (d: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: reduce ? 0 : 0.32, ease: EASE, delay: reduce ? 0 : d },
    }),
  };
  const fadeFaint = fade(0.42);
  const fadeDim = fade(0.6);

  return (
    <motion.svg
      viewBox="0 0 300 220"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
      {...svgMotion}
    >
      <defs>
        <marker
          id={arrowId}
          markerWidth={9}
          markerHeight={9}
          refX={7}
          refY={3}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 7 3 L 0 6 Z" fill="currentColor" stroke="none" />
        </marker>
      </defs>

      {/* PHASE 1 — dashed construction wireframe (sketch.rect → extrude box) */}
      <motion.path
        d={wire}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 4"
        variants={fadeFaint}
        custom={base - 0.05}
      />

      {/* PHASE 2 — solid top face + extruded walls draw on (part.extrude) */}
      <motion.path
        d={topFace}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        variants={draw}
        custom={base + 0.15}
      />
      <motion.path
        d={frontWalls}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        variants={draw}
        custom={base + 0.4}
      />

      {/* PHASE 3 — two M6 bores stamp through the top face (part.holes) */}
      <motion.path
        d={ringL}
        stroke="currentColor"
        strokeWidth={1.25}
        variants={draw}
        custom={base + 0.7}
      />
      <motion.path
        d={ringR}
        stroke="currentColor"
        strokeWidth={1.25}
        variants={draw}
        custom={base + 0.82}
      />
      {/* bore centre marks */}
      <motion.g variants={fadeFaint} custom={base + 0.9}>
        <circle cx={boreL.cx} cy={boreL.cy} r={1} fill="currentColor" />
        <circle cx={boreR.cx} cy={boreR.cy} r={1} fill="currentColor" />
      </motion.g>

      {/* PHASE 4 — healed inside fillet (part.filletEdges → ± healed) */}
      <motion.path
        d={`M ${filletCorner.x} ${filletCorner.y - filletR} A ${filletR} ${filletR * 0.5} 0 0 1 ${filletCorner.x + filletR} ${filletCorner.y}`}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        variants={draw}
        custom={base + 1.0}
      />

      {/* PHASE 5 — Ø / pitch dimension across the bores (the validated spec) */}
      <motion.g
        stroke="currentColor"
        strokeWidth={1}
        variants={fadeDim}
        custom={validAt - 0.12}
      >
        {/* witness lines up from each bore centre */}
        <g opacity={0.55}>
          <line x1={boreL.cx} y1={boreL.cy - 4} x2={dimL.x} y2={dimL.y + 6} />
          <line x1={boreR.cx} y1={boreR.cy - 4} x2={dimR.x} y2={dimR.y + 6} />
        </g>
        <line
          x1={dimL.x}
          y1={dimL.y}
          x2={dimR.x}
          y2={dimR.y}
          markerStart={`url(#${arrowId})`}
          markerEnd={`url(#${arrowId})`}
        />
      </motion.g>
      <motion.text
        x={(dimL.x + dimR.x) / 2}
        y={dimY - 5}
        textAnchor="middle"
        className="fill-current font-mono"
        stroke="none"
        style={{ fontSize: 11, fontVariantNumeric: "tabular-nums slashed-zero" }}
        variants={fade(1)}
        custom={validAt}
      >
        2× Ø6 · 60
      </motion.text>

      {/* PHASE 6 — coherence-gate "✓ valid" stamp, lands last */}
      <motion.g variants={stamp} custom={validAt + 0.12}>
        <rect
          x={18}
          y={188}
          width={66}
          height={20}
          rx={2}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.5}
        />
        <text
          x={51}
          y={198.5}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-current font-mono"
          stroke="none"
          style={{ fontSize: 10.5 }}
        >
          ✓ valid
        </text>
      </motion.g>

      {/* solid identity caption */}
      <motion.text
        x={282}
        y={203}
        textAnchor="end"
        className={cn("fill-current font-mono", faintClass)}
        stroke="none"
        style={{ fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase" }}
        variants={fade(1)}
        custom={validAt + 0.18}
      >
        solid · B-rep
      </motion.text>
    </motion.svg>
  );
}
