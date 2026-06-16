"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { usePrefersReducedMotion } from "@/lib/artkit";

export type Vec2 = { x: number; y: number };

const PointerCtx = createContext<RefObject<Vec2> | null>(null);

/**
 * The single travelling light: one rAF smooths the pointer and publishes it as
 * CSS custom properties (--spot-x / --spot-y, 0..1) on :root — the 2D spotlight
 * and contact shadows read these — and exposes a ref for the 3D stage to re-aim
 * its key light (cursor-as-key-light). Disabled under reduced motion / coarse pointer.
 */
export function InstrumentProvider({ children }: { children: ReactNode }) {
  const pointer = useRef<Vec2>({ x: 0.5, y: 0.38 });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement.style;
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduce || !fine) {
      root.setProperty("--spot-x", "0.5");
      root.setProperty("--spot-y", "0.32");
      pointer.current = { x: 0.5, y: 0.32 };
      return;
    }

    const target = { x: 0.5, y: 0.32 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / Math.max(1, window.innerWidth);
      target.y = e.clientY / Math.max(1, window.innerHeight);
    };
    let raf = 0;
    const tick = () => {
      const p = pointer.current;
      p.x += (target.x - p.x) * 0.08;
      p.y += (target.y - p.y) * 0.08;
      root.setProperty("--spot-x", p.x.toFixed(4));
      root.setProperty("--spot-y", p.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return <PointerCtx.Provider value={pointer}>{children}</PointerCtx.Provider>;
}

/** Smoothed, normalized [0..1] pointer ref (null outside the provider). */
export function usePointerRef(): RefObject<Vec2> | null {
  return useContext(PointerCtx);
}
