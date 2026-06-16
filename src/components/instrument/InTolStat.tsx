"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { cn } from "@/lib/utils";

/**
 * A headline metric rendered as a digital readout that "seats" in tolerance:
 * numerics count up (servo, no overshoot) and settle on nominal; a GD&T-style
 * ▽ IN TOL tag + tolerance band sit beside it. Reduced motion → seated instantly.
 * Inherits color (works on paper + ink fields). Reuses the .u-stat token.
 */
export function InTolStat({
  value,
  tol = "± .0",
  className,
}: {
  value: string;
  tol?: string;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const numeric = /^[0-9][0-9,]*$/.test(value);
  const target = numeric ? parseInt(value.replace(/,/g, ""), 10) : 0;
  const [n, setN] = useState(numeric && !reduce ? 0 : target);

  useEffect(() => {
    if (!numeric || reduce || !inView || target === 0) return;
    let raf = 0;
    const dur = 1100;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, reduce, target]);

  return (
    <span ref={ref} className={cn("inline-flex items-start gap-2.5", className)}>
      <span className="u-stat tabular-nums">
        {numeric ? n.toLocaleString("en-US") : value}
      </span>
      <span className="mt-1.5 inline-flex flex-col gap-1">
        <span className="inline-flex items-center gap-1 rounded-[2px] border border-current/25 px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.14em] opacity-70">
          <span aria-hidden>▽</span> in&nbsp;tol
        </span>
        <span className="font-mono text-[9px] tabular-nums leading-none opacity-40">
          {tol}
        </span>
      </span>
    </span>
  );
}
