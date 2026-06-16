import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";

/** Reliable reduced-motion hook via useSyncExternalStore: reads the media query
 *  synchronously on the client (motion's own useReducedMotion can miss a preset
 *  preference), subscribes to changes, and avoids setState-in-effect. */
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduce(onStoreChange: () => void): () => void {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false,
  );
}

/** Fine-pointer + hover capability (mouse / trackpad / stylus-with-hover), via
 *  useSyncExternalStore — same pattern as usePrefersReducedMotion. Returns false
 *  on touch / coarse / no-hover devices so interactions can degrade to a static
 *  resolved frame. SSR-safe (false). */
const FINE_QUERY = "(hover: hover) and (pointer: fine)";
function subscribeFine(onStoreChange: () => void): () => void {
  const mq = window.matchMedia(FINE_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE_QUERY).matches,
    () => false,
  );
}

/* ============================================================
   artkit — shared, dependency-light primitives for the monochrome
   generative artifacts. Pure helpers + one canvas hook. No new deps.
   ============================================================ */

export type Pt = { x: number; y: number };

/* ---- Isometric projection (2:1) ---- */
export const ISO_COS = Math.cos(Math.PI / 6);
export const ISO_SIN = Math.sin(Math.PI / 6);
/** Project a 3D point to 2D screen space (standard 2:1 iso). y is "up". */
export function iso(x: number, y: number, z: number): Pt {
  return { x: (x - z) * ISO_COS, y: (x + z) * ISO_SIN - y };
}

/* ---- Deterministic RNG (mulberry32) — use for any randomness rendered in SSR'd JSX ---- */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- Value noise in [0,1] (closed permutation table; deterministic) ---- */
const PERM: Uint8Array = (() => {
  const p = new Uint8Array(512);
  const r = mulberry32(1337);
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const tmp = base[i];
    base[i] = base[j];
    base[j] = tmp;
  }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  return p;
})();
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const tl = PERM[PERM[xi] + yi] / 255;
  const tr = PERM[PERM[xi + 1] + yi] / 255;
  const bl = PERM[PERM[xi] + yi + 1] / 255;
  const br = PERM[PERM[xi + 1] + yi + 1] / 255;
  const u = fade(xf);
  const v = fade(yf);
  return lerp(lerp(tl, tr, u), lerp(bl, br, u), v);
}

/* ---- Ordered dithering (8x8 Bayer, normalized) ---- */
const B8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
];
export const BAYER8: number[] = B8.map((v) => (v + 0.5) / 64);
/** True => place a dot (value above the ordered threshold at this pixel). */
export function orderedDither(value: number, x: number, y: number): boolean {
  return value > BAYER8[(y & 7) * 8 + (x & 7)];
}

/* ---- Catmull-Rom → cubic bezier SVG path through control points ---- */
export function catmullRom(points: Pt[], closed = false): string {
  if (points.length < 2) return "";
  const p = points;
  const n = p.length;
  let d = `M ${round(p[0].x)} ${round(p[0].y)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = p[(i - 1 + n) % n] ?? p[i];
    const p1 = p[i % n];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(p2.x)} ${round(p2.y)}`;
  }
  if (closed) d += " Z";
  return d;
}
const round = (n: number) => Math.round(n * 100) / 100;

/* ---- Read a CSS custom property's computed value (for canvas fills) ---- */
export function cssVar(name: string, el?: Element | null): string {
  if (typeof window === "undefined") return "";
  const target = el ?? document.documentElement;
  return getComputedStyle(target).getPropertyValue(name).trim();
}

/* ============================================================
   useCanvas2D — sets up a dpr-capped (<=2) canvas sized to its parent,
   lazy-paints only when in view, pauses rAF off-screen, and respects
   reduced motion. `draw(ctx, w, h, p)`:
     - non-ambient: p ramps 0→1 over `duration` once, then holds at 1.
     - ambient: p is elapsed seconds (continuous drift); paused off-screen.
     - reducedMotion: draw is called once with p=1, no rAF.
   The artifact owns all painting; this hook owns sizing + lifecycle.
   ============================================================ */
export function useCanvas2D(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, p: number) => void,
  opts: { duration?: number; ambient?: boolean; reducedMotion?: boolean; deps?: unknown[] } = {},
): void {
  const { duration = 1200, ambient = false, reducedMotion = false } = opts;
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);
  const deps = opts.deps ?? [];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement ?? canvas;

    let raf = 0;
    let start = 0;
    let done = false;
    let visible = false;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const size = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };

    const paint = (p: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, w, h, p);
    };

    const frame = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      if (ambient) {
        paint(elapsed / 1000);
        raf = requestAnimationFrame(frame);
      } else {
        const p = Math.min(1, elapsed / duration);
        paint(p);
        if (p < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          done = true;
        }
      }
    };

    const run = () => {
      cancelAnimationFrame(raf);
      if (reducedMotion) {
        paint(1);
        done = true;
        return;
      }
      start = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => cancelAnimationFrame(raf);

    size();
    paint(reducedMotion ? 1 : 0);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible) {
            if (ambient || !done) run();
            else paint(1);
          } else {
            stop();
          }
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      size();
      if (reducedMotion || (done && !ambient)) paint(1);
      else if (visible) run();
    });
    ro.observe(parent);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, duration, ambient, reducedMotion, ...deps]);
}
