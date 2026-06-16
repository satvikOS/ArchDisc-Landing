import type { Transition, Variants } from "motion/react";

/** Shared motion language — restrained, precise. No bounce, no spring, no parallax. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Critically-damped "servo" — fast approach, settles on the exact value, no overshoot.
 *  For instrument readouts, the in-tol seat, and the measuring head. */
export const EASE_SERVO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DUR = { fast: 0.2, base: 0.45, slow: 0.6, draw: 0.85 } as const;

export const inViewport = { once: true, margin: "-80px" } as const;

export const baseTransition: Transition = { duration: DUR.slow, ease: EASE };

/** A single element fading up into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: baseTransition },
};

/** Smaller rise for tight, word-level or item-level staggers. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

/** Parent that orchestrates staggered children. */
export const stagger = (childDelay = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: childDelay, delayChildren } },
});
