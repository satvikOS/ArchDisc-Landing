"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { clamp, cssVar, lerp, mulberry32, useCanvas2D } from "@/lib/artkit";

/**
 * ConstellationField — a sparse node/hairline lattice that doubles as the
 * FREE-TO-USE / LOCAL-FLEET signature of the site. Nodes are placed on a
 * deterministic jittered grid (mulberry32, so SSR === client) and wired to
 * their nearest neighbours with distance-faded hairlines — read as a
 * distributed model fleet or a dependency graph.
 *
 * A handful of nodes are promoted to hollow 5-point STARS carrying the
 * free-to-use thread, each with an optional mono micro-label
 * (default: free to use · local & private · on-device · public release soon).
 *
 * Network + dots paint on a lazy, dpr-capped canvas (useCanvas2D); the crisp
 * star glyphs + labels live on a responsive SVG overlay so type stays sharp.
 *
 * MOTION — once-then-hold: nodes pop (staggered), edges draw outward from a
 * seed, stars twinkle ONCE (single opacity pulse, never looping). The
 * `ambient` variant is the only one permitted a slow ≤2px parallax drift; it
 * is reduced-motion gated and paused off-screen by the shared canvas hook.
 *
 * Monochrome only: canvas reads --color-ink / --color-paper via cssVar; the
 * `dark` prop flips to paper-coloured strokes for dark gravity fields.
 *
 * @prop className   Sizing / color-context classes for the root (decorative).
 * @prop labels      Mono micro-labels for the starred anchor nodes. The count
 *                   of stars equals labels.length (capped at the node count).
 * @prop dark        Render for a dark ink field (paper-coloured marks).
 * @prop nodeCount   Approximate number of lattice nodes (placed on a grid).
 * @prop seed        RNG seed for deterministic placement.
 * @prop ambient     Substrate mode: slow reduced-motion-gated parallax drift
 *                   instead of the play-once draw-on. Use only far from text.
 * @prop duration    Draw-on duration in ms for the once-then-hold reveal.
 */

const DEFAULT_LABELS = [
  "free to use",
  "local & private",
  "on-device",
  "public release soon",
];

type Node = {
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  r: number; // dot radius factor 0..1
  drift: number; // ambient phase offset
  delay: number; // pop-in order 0..1
  star: number; // -1 = plain node, else index into labels
};

type Edge = { a: number; b: number; w: number };

// VIEWBOX coordinate space for the SVG overlay (matches canvas aspect intent).
const VW = 600;
const VH = 380;

/** Hollow 5-point star path centered at (cx,cy), outer radius `or`. */
function starPath(cx: number, cy: number, or: number): string {
  const ir = or * 0.42;
  let d = "";
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? or : ir;
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad;
    d += `${i === 0 ? "M" : "L"} ${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100} `;
  }
  return d + "Z";
}

/** Deterministically place nodes on a jittered grid, wire nearest neighbours,
 *  and promote a spread-out subset to stars. Pure of the DOM → SSR-stable. */
function buildLattice(nodeCount: number, seed: number, starCount: number) {
  const rng = mulberry32(seed);

  // Grid sized to the viewbox aspect so cells stay roughly square.
  const aspect = VW / VH;
  const rows = Math.max(3, Math.round(Math.sqrt(nodeCount / aspect)));
  const cols = Math.max(3, Math.round(nodeCount / rows));

  const nodes: Node[] = [];
  const margin = 0.06;
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      // ~12% thinning keeps the field sparse rather than a full grid.
      if (rng() < 0.12) continue;
      const cellW = (1 - margin * 2) / cols;
      const cellH = (1 - margin * 2) / rows;
      const jx = (rng() - 0.5) * cellW * 0.82;
      const jy = (rng() - 0.5) * cellH * 0.82;
      const x = clamp(margin + (gx + 0.5) * cellW + jx, 0, 1);
      const y = clamp(margin + (gy + 0.5) * cellH + jy, 0, 1);
      nodes.push({
        x,
        y,
        r: 0.45 + rng() * 0.55,
        drift: rng() * Math.PI * 2,
        delay: 0,
        star: -1,
      });
    }
  }

  // Pop-in order: radial sweep from a seed near the centre-left.
  const sx = 0.32;
  const sy = 0.46;
  let maxD = 0.0001;
  for (const n of nodes) {
    const d = Math.hypot(n.x - sx, n.y - sy);
    if (d > maxD) maxD = d;
  }
  for (const n of nodes) n.delay = Math.hypot(n.x - sx, n.y - sy) / maxD;

  // Nearest-neighbour edges (each node → its 2-3 closest), de-duplicated.
  const seen = new Set<string>();
  const edges: Edge[] = [];
  const maxLen = 0.26; // normalized distance at which alpha → 0
  for (let i = 0; i < nodes.length; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      dists.push({ j, d: Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) });
    }
    dists.sort((a, b) => a.d - b.d);
    const k = 2 + (rng() < 0.5 ? 1 : 0);
    for (let m = 0; m < Math.min(k, dists.length); m++) {
      const { j, d } = dists[m];
      if (d > maxLen) continue;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: i, b: j, w: clamp(1 - d / maxLen, 0, 1) });
    }
  }

  // Promote stars: pick well-separated nodes so labels never collide.
  const stars: number[] = [];
  const wantStars = Math.min(starCount, nodes.length);
  const minSep = 0.24;
  // Prefer nodes biased toward the upper band where labels read cleanly.
  const order = nodes
    .map((_, i) => i)
    .sort((a, b) => nodes[a].y - nodes[b].y || nodes[a].x - nodes[b].x);
  for (const i of order) {
    if (stars.length >= wantStars) break;
    const tooClose = stars.some(
      (s) => Math.hypot(nodes[s].x - nodes[i].x, nodes[s].y - nodes[i].y) < minSep,
    );
    // Keep stars off the extreme edges so their label fits in-frame.
    if (nodes[i].x < 0.12 || nodes[i].x > 0.88) continue;
    if (!tooClose) stars.push(i);
  }
  // Fallback in dense-collision cases: relax separation.
  for (const i of order) {
    if (stars.length >= wantStars) break;
    if (!stars.includes(i)) stars.push(i);
  }
  stars.forEach((idx, k) => (nodes[idx].star = k));

  return { nodes, edges, stars };
}

export function ConstellationField({
  className,
  labels = DEFAULT_LABELS,
  dark = false,
  nodeCount = 64,
  seed = 7,
  ambient = false,
  duration = 1300,
}: {
  className?: string;
  labels?: string[];
  dark?: boolean;
  nodeCount?: number;
  seed?: number;
  ambient?: boolean;
  duration?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { nodes, edges, stars } = useMemo(
    () => buildLattice(nodeCount, seed, labels.length),
    [nodeCount, seed, labels.length],
  );

  // Stars positioned in viewbox space for the SVG overlay.
  const starGlyphs = useMemo(
    () =>
      stars.map((idx) => {
        const n = nodes[idx];
        const px = n.x * VW;
        const py = n.y * VH;
        const right = n.x < 0.62; // label side: keep inside the frame
        return {
          idx,
          px,
          py,
          right,
          label: labels[n.star] ?? "",
          // stagger the single twinkle pulse so they don't all flash at once
          twinkleDelay: 0.95 + n.delay * 0.4,
        };
      }),
    [stars, nodes, labels],
  );

  // ---- Canvas: edges + plain-node dots (stars are drawn by the SVG layer) ----
  useCanvas2D(
    canvasRef,
    (ctx, w, h, p) => {
      const stroke = cssVar(dark ? "--color-paper" : "--color-ink") || (dark ? "#fafafa" : "#11151c");
      // p: once-then-hold = 0→1 reveal; ambient = elapsed seconds.
      const isAmbient = ambient && !reduce;
      const nodeP = isAmbient ? 1 : p; // dots fully present in ambient drift
      const edgeP = isAmbient ? 1 : p;
      const t = isAmbient ? p : 0; // seconds, for the gentle parallax

      const px = (n: Node) => {
        const dx = isAmbient ? Math.cos(n.drift + t * 0.35) * (2.0 / w) : 0;
        return (n.x + dx) * w;
      };
      const py = (n: Node) => {
        const dy = isAmbient ? Math.sin(n.drift * 1.3 + t * 0.3) * (2.0 / h) : 0;
        return (n.y + dy) * h;
      };

      // EDGES — extend outward from the seed; alpha falls off with length.
      ctx.lineCap = "round";
      for (const e of edges) {
        const na = nodes[e.a];
        const nb = nodes[e.b];
        // an edge is "live" once both endpoints have popped in the reveal
        const born = Math.max(na.delay, nb.delay) * 0.7;
        const grow = clamp((edgeP - born) / 0.32, 0, 1);
        if (grow <= 0) continue;
        const baseA = lerp(0.04, 0.2, e.w) * (dark ? 0.95 : 1);
        const ax = px(na);
        const ay = py(na);
        const bx = px(nb);
        const by = py(nb);
        // draw-on: line extends from a → b
        const ex = lerp(ax, bx, grow);
        const ey = lerp(ay, by, grow);
        ctx.globalAlpha = baseA;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lerp(0.6, 1.05, e.w);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }

      // NODES — plain dots pop in (scale + fade); stars handled by SVG overlay.
      ctx.fillStyle = stroke;
      for (const n of nodes) {
        if (n.star >= 0) continue;
        const pop = clamp((nodeP - n.delay * 0.7) / 0.22, 0, 1);
        if (pop <= 0) continue;
        const eased = pop * pop * (3 - 2 * pop); // smoothstep ease for the pop
        const baseR = lerp(0.9, 2.4, n.r);
        const rr = baseR * eased;
        ctx.globalAlpha = lerp(0.28, 0.7, n.r) * eased;
        ctx.beginPath();
        ctx.arc(px(n), py(n), rr, 0, Math.PI * 2);
        ctx.fill();
        // faint ring on the larger nodes to read as "fleet" hubs
        if (n.r > 0.7) {
          ctx.globalAlpha = 0.16 * eased;
          ctx.lineWidth = 0.75;
          ctx.strokeStyle = stroke;
          ctx.beginPath();
          ctx.arc(px(n), py(n), rr + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    },
    {
      duration,
      ambient: ambient && !reduce,
      reducedMotion: reduce,
      deps: [dark, ambient, nodes, edges],
    },
  );

  // SVG overlay (stars + labels). Resolved-state for reduced motion / ambient.
  const resolved = reduce || ambient;
  const starColor = dark ? "text-paper" : "text-ink";
  const labelColor = dark ? "text-white/55" : "text-faint";

  return (
    <div aria-hidden className={cn("relative isolate", starColor, className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {starGlyphs.map((s) => (
          <g key={s.idx}>
            {/* connective spur tying the star into the lattice read */}
            <motion.path
              d={starPath(s.px, s.py, 7.5)}
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinejoin="round"
              fill="none"
              initial={resolved ? false : { opacity: 0, scale: 0.2 }}
              animate={
                resolved
                  ? { opacity: 1, scale: 1 }
                  : {
                      // pop in, then a SINGLE twinkle pulse (never loops)
                      opacity: [0, 1, 0.55, 1],
                      scale: [0.2, 1, 1, 1],
                    }
              }
              transition={
                resolved
                  ? { duration: 0 }
                  : {
                      duration: 0.9,
                      delay: s.twinkleDelay,
                      ease: EASE,
                      times: [0, 0.45, 0.72, 1],
                    }
              }
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            {/* small halo dot at the star's core */}
            <motion.circle
              cx={s.px}
              cy={s.py}
              r={1.3}
              fill="currentColor"
              initial={resolved ? false : { opacity: 0 }}
              animate={{ opacity: resolved ? 1 : [0, 1] }}
              transition={resolved ? { duration: 0 } : { duration: 0.3, delay: s.twinkleDelay }}
            />
            {/* mono micro-label */}
            {s.label && (
              <motion.text
                x={s.right ? s.px + 12 : s.px - 12}
                y={s.py + 3.5}
                textAnchor={s.right ? "start" : "end"}
                className={cn("font-mono", labelColor)}
                fill="currentColor"
                style={{ fontSize: 10, letterSpacing: "0.06em" }}
                initial={resolved ? false : { opacity: 0 }}
                animate={{ opacity: resolved ? 1 : [0, 1] }}
                transition={
                  resolved ? { duration: 0 } : { duration: 0.45, delay: s.twinkleDelay + 0.12 }
                }
              >
                {s.label}
              </motion.text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
