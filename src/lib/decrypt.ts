"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/artkit";

/** Classified-glyph alphabet for the decrypt mechanic. */
const CIPHER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>#*+=·:▮▦▧▤".split("");

function glyph() {
  return CIPHER[(Math.random() * CIPHER.length) | 0];
}

/** A deterministic redaction of `target` — used for the SSR/initial frame so
 *  server and client first-render match exactly (no hydration mismatch). */
export function maskOf(target: string): string {
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    out += ch === " " || ch === "\n" ? ch : CIPHER[(i * 7) % 36];
  }
  return out;
}

/** Scramble `target`, resolving left-to-right as `progress` (0..1) advances.
 *  Whitespace passes through so word shapes stay intact. Uses randomness, so it
 *  must only run client-side (inside rAF), never during SSR/initial render. */
export function scrambleTo(target: string, progress: number): string {
  const resolved = Math.floor(progress * target.length);
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (ch === " " || ch === "\n") out += ch;
    else if (i < resolved) out += ch;
    else out += glyph();
  }
  return out;
}

type Opts = { active?: boolean; duration?: number; delay?: number };

/**
 * Returns a decrypting view of `text`. While inactive the text reads as a
 * redacted cipher; when `active` flips true it decodes over `duration` ms.
 * Reduced motion resolves instantly.
 */
export function useDecrypt(text: string, { active = true, duration = 900, delay = 0 }: Opts = {}) {
  const reduce = usePrefersReducedMotion();
  // Animated frames live here; the resting states are derived at render time so
  // we never call setState synchronously inside the effect.
  const [frame, setFrame] = useState<string | null>(null);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduce || !active) return; // resting state is rendered directly
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setFrame(scrambleTo(text, p)); // setState inside rAF, not in the effect body
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    timer.current = setTimeout(() => {
      raf.current = requestAnimationFrame(step);
    }, delay);
    return () => {
      cancelAnimationFrame(raf.current);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [text, active, duration, delay, reduce]);

  // Deterministic at SSR/first paint and while resting; animated once active.
  if (reduce) return text;
  if (!active) return maskOf(text);
  return frame ?? maskOf(text);
}
