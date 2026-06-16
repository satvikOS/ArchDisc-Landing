"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, stagger, riseIn } from "@/lib/motion";

/* ============================================================
   ToolCallLedger — Archie's loop made visible.

   A prompt resolves into an ordered stream of validated tool-calls
   that stamp in one row at a time (verb · named params · status glyph),
   over a 1px construction spine with a node at every row, ending in a
   coherence-gate panel: checkValidity() → valid + a mini 4-node
   "editable feature tree" glyph.

   Hybrid (DOM rows + one tiny inline SVG spine + SVG feature-tree).
   No canvas. Monochrome only — colour comes exclusively from text-*
   tokens / currentColor, so the `dark` variant just flips classes.

   Motion doctrine: PLAY ONCE THEN HOLD. Prompt types once, rows stamp
   in sequence, spine grows scaleY 0→1 underneath, gate + tree fade last.
   useReducedMotion → resting frame painted instantly (no typing, static
   block cursor, no draw-on).

   Props (all optional — `<ToolCallLedger />` renders standalone):
   @prop prompt    Prompt string typed on the header row.
   @prop calls     Ordered tool-calls: { verb, args, status:'ok'|'healed' }.
   @prop gateLabel Coherence-gate caption (mono).
   @prop showTree  Render the editable feature-tree glyph in the gate panel.
   @prop variant   'hero' (full readout) | 'compact' (3-row inline).
   @prop tone      'light' (ink on paper) | 'dark' (paper on ink field).
   @prop trigger   'view' (stamp when scrolled in) | 'load' (on mount).
   @prop startDelay Seconds before the choreography begins.
   @prop className  Sizing / layout overrides on the aria-hidden root.
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
  variant?: Variant;
  tone?: Tone;
  trigger?: Trigger;
  startDelay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const compact = variant === "compact";
  const dark = tone === "dark";

  const promptText = prompt ?? DEFAULT_PROMPT;
  const rows = useMemo(
    () => calls ?? (compact ? COMPACT_CALLS : DEFAULT_CALLS),
    [calls, compact],
  );

  // Choreography timing (seconds). Prompt types first, rows stamp, gate last.
  const rowStep = 0.1;
  const typeDur = compact ? 0.32 : Math.min(0.6, promptText.length * 0.018);
  const rowsStart = startDelay + (compact ? 0.18 : 0.32) + typeDur;
  const gateDelay = rowsStart + rows.length * rowStep + 0.18;

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
      };

  const rowPadY = compact ? "py-1.5" : "py-2";
  const rowText = compact ? "text-[11px]" : "text-[12px]";

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
      {/* ── prompt field — typed once, then held ───────────────────── */}
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

      {/* ── tool-call ledger — rows stamp over a drawing spine ─────── */}
      <div className="p-4">
        <span
          className={cn(
            "mb-3 block font-mono text-[10px] uppercase tracking-[0.16em]",
            c.label,
          )}
        >
          tool-calls
        </span>

        <motion.div
          className="relative"
          {...orchestrate(rowsStart, rowStep)}
        >
          {/* construction spine — 1px, grows scaleY 0→1 underneath the rows.
              When reduced motion resolves, `animate` drives the grown resting
              frame immediately, independent of scroll. */}
          <motion.span
            className={cn("absolute left-[3px] top-1 z-0 w-px origin-top", c.spine)}
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
                  <span
                    className={cn("shrink-0 font-mono text-[10px]", c.label)}
                  >
                    →
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate font-mono",
                      rowText,
                    )}
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

        {/* ── coherence-gate panel — fades in last ─────────────────── */}
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
              reduce={!!reduce}
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
    </div>
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
      <circle cx={rootX} cy={rootY} r={2.1} className={cn("fill-current", nodeClass)} />
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
