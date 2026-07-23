"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";
import { usePrefersReducedMotion } from "@/lib/artkit";

/**
 * Pencil annotation on real text via rough-notation — underline / circle / box /
 * highlight, drawn when the word scrolls into view. Reduced motion: shown
 * instantly, no draw animation.
 */
export function RoughMark({
  children,
  type = "underline",
  color = "var(--color-coral)",
  strokeWidth = 2,
  padding = 4,
  multiline = true,
  animated = true,
  className,
}: {
  animated?: boolean;
  children: ReactNode;
  type?: "underline" | "circle" | "box" | "highlight" | "strike-through" | "crossed-off" | "bracket";
  color?: string;
  strokeWidth?: number;
  padding?: number;
  multiline?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let annotation: RoughAnnotation | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !annotation) {
          annotation = annotate(el, {
            type,
            color,
            strokeWidth,
            padding,
            multiline,
            animate: animated && !reduce,
            animationDuration: 900,
            iterations: 1,
          });
          annotation.show();
          io.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      annotation?.remove();
    };
  }, [type, color, strokeWidth, padding, multiline, reduce, animated]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
