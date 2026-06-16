"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * THE signature device: one hairline that resolves a sketch → revolved mesh →
 * dimensioned, shelled solid (with a Ø callout and a coherence-gate "valid" tag).
 * Authored once; reused in the hero, threaded through the pillar cards, and
 * reprised resolved behind the final CTA. The page's entire boldness budget.
 */

const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.85, ease: EASE, delay: d },
      opacity: { duration: 0.25, delay: d },
    },
  }),
};

const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (d: number) => ({ opacity: 1, transition: { duration: 0.5, delay: d } }),
};

type Trigger = "load" | "view";

export function ThroughLine({
  variant = "hero",
  trigger = "view",
  startDelay = 0,
  className,
}: {
  variant?: "hero" | "final" | "pillar";
  trigger?: Trigger;
  startDelay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Drive parent state; children inherit the variant target.
  const motionProps = reduce
    ? ({ initial: false, animate: "show" } as const)
    : trigger === "load"
      ? ({ initial: "hidden", animate: "show" } as const)
      : ({
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "-60px" },
        } as const);

  if (variant === "pillar") {
    return (
      <div aria-hidden className={cn("relative h-px w-full text-ink", className)}>
        <motion.div
          className="absolute inset-0 origin-left bg-line-strong"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE }}
        />
        {[16.66, 50, 83.33].map((left, i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
            style={{ left: `${left}%` }}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.18 }}
          />
        ))}
      </div>
    );
  }

  const cx = 180;

  return (
    <motion.svg
      viewBox="0 0 360 240"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full text-ink", className)}
      {...motionProps}
    >
      {/* dashed construction centerline */}
      <motion.line
        x1={cx}
        y1={38}
        x2={cx}
        y2={208}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 5"
        opacity={0.3}
        variants={fadeV}
        custom={startDelay}
      />
      {/* sketch profile (dashed) */}
      <motion.path
        d="M180 54 C214 72 246 114 230 162 C222 186 200 198 180 200"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray="4 5"
        opacity={0.35}
        variants={fadeV}
        custom={startDelay + 0.1}
      />
      {/* solid silhouette */}
      <motion.path
        d="M134 64 C120 110 120 158 142 196 L218 196 C240 158 240 110 226 64"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        variants={drawV}
        custom={startDelay + 0.5}
      />
      {/* rim + shell ellipses */}
      <motion.ellipse cx={cx} cy={64} rx={46} ry={12} stroke="currentColor" strokeWidth={1.5} variants={drawV} custom={startDelay + 0.72} />
      <motion.ellipse cx={cx} cy={64} rx={36} ry={9} stroke="currentColor" strokeWidth={1} opacity={0.7} variants={drawV} custom={startDelay + 0.86} />
      {/* revolve rings */}
      <motion.ellipse cx={cx} cy={118} rx={53} ry={13} stroke="currentColor" strokeWidth={1} opacity={0.4} variants={drawV} custom={startDelay + 0.96} />
      <motion.ellipse cx={cx} cy={158} rx={50} ry={12} stroke="currentColor" strokeWidth={1} opacity={0.4} variants={drawV} custom={startDelay + 1.06} />
      <motion.ellipse cx={cx} cy={196} rx={38} ry={10} stroke="currentColor" strokeWidth={1.25} opacity={0.6} variants={drawV} custom={startDelay + 1.16} />
      {/* dimension */}
      <motion.g stroke="currentColor" strokeWidth={1} opacity={0.5} variants={fadeV} custom={startDelay + 1.25}>
        <line x1={134} y1={42} x2={226} y2={42} />
        <line x1={134} y1={36} x2={134} y2={58} />
        <line x1={226} y1={36} x2={226} y2={58} />
      </motion.g>
      <motion.text
        x={cx}
        y={30}
        textAnchor="middle"
        className="fill-muted font-mono"
        style={{ fontSize: 11 }}
        variants={fadeV}
        custom={startDelay + 1.4}
      >
        Ø 60.0
      </motion.text>
      {/* coherence-gate "valid" tag */}
      <motion.g variants={fadeV} custom={startDelay + 1.55}>
        <rect x={252} y={176} width={64} height={22} rx={2} stroke="currentColor" strokeWidth={1} opacity={0.45} />
        <text x={284} y={191} textAnchor="middle" className="fill-ink font-mono" style={{ fontSize: 10 }}>
          ✓ valid
        </text>
      </motion.g>
    </motion.svg>
  );
}
