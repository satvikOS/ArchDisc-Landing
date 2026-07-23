"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/artkit";

/** Scroll-linked vertical drift for decorative layers. Static under reduced motion. */
export function Parallax({
  children,
  y = 60,
  className,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], [y, -y]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y: ty }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
