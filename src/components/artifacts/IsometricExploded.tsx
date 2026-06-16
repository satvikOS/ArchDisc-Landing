"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { iso, mulberry32, type Pt } from "@/lib/artkit";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/* ============================================================
   IsometricExploded — a native-kernel mechanical assembly drawn
   as an isometric exploded plate: clean hairline iso solids,
   separated along a shared dashed explosion axis, with numbered
   balloon callouts and a BOM-style mono legend. The
   "real B-rep assemblies, manufacturable not renderable" story.

   Plus FacilitySwarm — a dense, ZONED iso field of hundreds of
   tiny boxes clustered into rectangular bays divided by aisles
   (organized, not confetti) that fills row-by-row then holds, for
   the 100,000-component scale story. Both reuse iso() from artkit.

   Monochrome only: strokes use currentColor (parent sets `text-*`);
   face value comes from `fill-current` at stepped opacities so the
   edges stay the darkest mark. Dark-field variants work by pointing
   currentColor at a paper token via a text class.

   Props (IsometricExploded):
     @prop {Part[]}  parts      Override the default 4-part stack.
     @prop {boolean} showBom    Render the side BOM legend (default true).
     @prop {boolean} showBalloons  Render numbered balloon callouts (default true).
     @prop {number}  startDelay Seconds before the choreography begins (default 0).
     @prop {"view"|"load"} trigger  Play on scroll-into-view or on mount (default "view").
     @prop {string}  className  Sizing / color (e.g. "text-ink h-80 w-full").

   Props (FacilitySwarm):
     @prop {number}  seed       Deterministic layout seed (default 7).
     @prop {Bay[]}   bays       Override the default 3-bay zoning.
     @prop {number}  cell       Iso grid pitch in world units (default 13).
     @prop {boolean} showLabels Render the zone + count mono labels (default true).
     @prop {"view"|"load"} trigger  (default "view").
     @prop {string}  className  Sizing / color.
   ============================================================ */

/* ---------- shared geometry helpers ---------- */

/** One extruded iso box: a top face + two visible side faces, value-shaded
 *  by fill opacity only (edges stay crisp). Returned as plain path strings so
 *  the same routine serves both the exploded plate and the dense swarm. */
type BoxPaths = { top: string; left: string; right: string; outline: string };

function isoBox(
  x: number,
  y: number,
  z: number,
  sx: number,
  sy: number,
  sz: number,
): BoxPaths {
  // 8 corners; y is "up".
  const x0 = x;
  const x1 = x + sx;
  const z0 = z;
  const z1 = z + sz;
  const yb = y; // bottom
  const yt = y + sy; // top
  // top-face corners (CCW)
  const tA = iso(x0, yt, z0);
  const tB = iso(x1, yt, z0);
  const tC = iso(x1, yt, z1);
  const tD = iso(x0, yt, z1);
  // bottom-face corners we can see
  const bB = iso(x1, yb, z0);
  const bC = iso(x1, yb, z1);
  const bD = iso(x0, yb, z1);
  const P = (p: Pt) => `${r(p.x)} ${r(p.y)}`;
  return {
    top: `M ${P(tA)} L ${P(tB)} L ${P(tC)} L ${P(tD)} Z`,
    // right-front face (towards +x): tB tC bC bB
    right: `M ${P(tB)} L ${P(tC)} L ${P(bC)} L ${P(bB)} Z`,
    // left-front face (towards +z): tD tC bC bD
    left: `M ${P(tD)} L ${P(tC)} L ${P(bC)} L ${P(bD)} Z`,
    // full silhouette for crisp draw-on of the visible edges
    outline: `M ${P(tA)} L ${P(tB)} L ${P(tC)} L ${P(tD)} Z M ${P(tB)} L ${P(bB)} L ${P(bC)} L ${P(tC)} M ${P(tD)} L ${P(bD)} L ${P(bC)}`,
  };
}

const r = (n: number) => Math.round(n * 100) / 100;

/** Bore diameter as a fraction of the smaller top-face dimension. */
const ISO_BORE = 0.62;

/* =====================================================================
   IsometricExploded
   ===================================================================== */

type Shape = "plate" | "boss" | "fastener" | "flange";

export type Part = {
  /** Footprint along iso x / z and height along y, in world units. */
  sx: number;
  sy: number;
  sz: number;
  /** How far this part lifts up the explosion axis at rest (world units). */
  lift: number;
  /** Balloon number + BOM description. */
  tag: string;
  bom: string;
  shape?: Shape;
};

const DEFAULT_PARTS: Part[] = [
  { sx: 86, sy: 10, sz: 70, lift: 0, tag: "1", bom: "bracket plate · 4 mm", shape: "plate" },
  { sx: 50, sy: 22, sz: 42, lift: 64, tag: "2", bom: "mounting boss · ⌀30", shape: "boss" },
  { sx: 70, sy: 9, sz: 56, lift: 132, tag: "3", bom: "mating flange · 6 mm", shape: "flange" },
  { sx: 18, sy: 30, sz: 18, lift: 196, tag: "4", bom: "fastener · M6 ×2", shape: "fastener" },
];

// World canvas is laid out in iso space then framed by the viewBox below.
const EX_VIEW = { w: 360, h: 300 };

/** Per-part draw choreography keyed off the part index. */
const partSlide: Variants = {
  hidden: (d: number) => ({ opacity: 0, y: -d }),
  show: { opacity: 1, y: 0 },
};

const edgeDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.55, ease: EASE, delay }, opacity: { duration: 0.2, delay } },
  }),
};

const faceFade: Variants = {
  hidden: { opacity: 0 },
  show: (o: number) => ({ opacity: o, transition: { duration: 0.4, ease: EASE } }),
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: EASE, delay },
  }),
};

const fadeAt: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({ opacity: 1, transition: { duration: 0.4, ease: EASE, delay } }),
};

export function IsometricExploded({
  parts = DEFAULT_PARTS,
  showBom = true,
  showBalloons = true,
  startDelay = 0,
  trigger = "view",
  className,
}: {
  parts?: Part[];
  showBom?: boolean;
  showBalloons?: boolean;
  startDelay?: number;
  trigger?: "view" | "load";
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Lay the stack out in screen space. A shared explosion axis runs up the
  // centre of the assembly; each part lifts along it at rest (= exploded).
  const layout = useMemo(() => {
    // Centre the footprint of the largest part on the axis.
    const maxFoot = Math.max(...parts.map((p) => Math.max(p.sx, p.sz)));
    const baseY = 220; // screen baseline for the lowest part
    const axisScreen = iso(maxFoot / 2, 0, maxFoot / 2);
    const cx = EX_VIEW.w / 2 - axisScreen.x;

    const items = parts.map((p, i) => {
      const x = (maxFoot - p.sx) / 2;
      const z = (maxFoot - p.sz) / 2;
      const paths = isoBox(x, p.lift, z, p.sx, p.sy, p.sz);
      // Balloon anchor: top-right corner of the top face, projected.
      const anchor = iso(x + p.sx, p.lift + p.sy, z);
      // Tick on the dashed axis where this part's centre sits.
      const axisPt = iso(maxFoot / 2, p.lift + p.sy / 2, maxFoot / 2);
      // Bore centre: projected centre of this part's top face.
      const bore = iso(x + p.sx / 2, p.lift + p.sy, z + p.sz / 2);
      const boreR = Math.min(p.sx, p.sz) * ISO_BORE * 0.5;
      return { p, i, paths, anchor, axisPt, bore, boreR };
    });
    return { items, cx, baseY, maxFoot };
  }, [parts]);

  // Axis endpoints (top to bottom of the lifted stack), in screen space.
  const axisTop = iso(layout.maxFoot / 2, parts[parts.length - 1].lift + 60, layout.maxFoot / 2);
  const axisBot = iso(layout.maxFoot / 2, -28, layout.maxFoot / 2);

  const motionProps = reduce
    ? ({ initial: false, animate: "show" } as const)
    : trigger === "load"
      ? ({ initial: "hidden", animate: "show" } as const)
      : ({ initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } } as const);

  // Choreography clock (seconds). edges → slide → balloons → BOM.
  const t0 = startDelay;
  const tEdges = t0;
  const tBalloons = t0 + parts.length * 0.12 + 0.6;
  const tBom = tBalloons + 0.2;

  return (
    <motion.svg
      viewBox={`0 0 ${EX_VIEW.w} ${EX_VIEW.h}`}
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full text-ink", className)}
      {...motionProps}
    >
      <g transform={`translate(${r(layout.cx)} ${layout.baseY})`}>
        {/* shared dashed explosion axis */}
        <motion.line
          x1={r(axisBot.x)}
          y1={r(axisBot.y)}
          x2={r(axisTop.x)}
          y2={r(axisTop.y)}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="3 5"
          opacity={0.28}
          variants={fadeAt}
          custom={t0}
        />
        {/* arrowhead at the top of the axis */}
        <motion.path
          d={`M ${r(axisTop.x - 4)} ${r(axisTop.y + 7)} L ${r(axisTop.x)} ${r(axisTop.y)} L ${r(axisTop.x + 4)} ${r(axisTop.y + 7)}`}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.4}
          variants={fadeAt}
          custom={t0 + 0.1}
        />

        {/* parts — lowest drawn first so higher parts overlap correctly */}
        {layout.items.map(({ p, i, paths, anchor, axisPt, bore, boreR }) => {
          const slideDelay = tEdges + 0.5 + i * 0.1;
          const edgeDelay = tEdges + i * 0.12;
          return (
            <motion.g
              key={i}
              variants={partSlide}
              custom={reduce ? 0 : 26}
              transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : slideDelay }}
            >
              {/* value faces (fill only — edges stay the darkest mark) */}
              <motion.path d={paths.right} className="fill-current" variants={faceFade} custom={0.16} />
              <motion.path d={paths.left} className="fill-current" variants={faceFade} custom={0.3} />
              <motion.path d={paths.top} className="fill-current" variants={faceFade} custom={0.06} />
              {/* crisp visible edges, drawn on */}
              <motion.path
                d={paths.outline}
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinejoin="round"
                strokeLinecap="round"
                variants={edgeDraw}
                custom={edgeDelay}
              />

              {/* shape detail — a counterbore on the boss/flange, value only */}
              {(p.shape === "boss" || p.shape === "flange") && (
                <Bore cx={bore.x} cy={bore.y} radius={boreR} delay={edgeDelay + 0.3} reduce={!!reduce} />
              )}

              {/* leader + numbered balloon */}
              {showBalloons && (
                <motion.g variants={popIn} custom={tBalloons + i * 0.08}>
                  <line
                    x1={r(anchor.x)}
                    y1={r(anchor.y)}
                    x2={r(anchor.x + 28)}
                    y2={r(anchor.y - 16)}
                    stroke="currentColor"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <circle cx={r(anchor.x + 28)} cy={r(anchor.y - 16)} r={1.6} className="fill-current" opacity={0.5} />
                  <circle
                    cx={r(anchor.x + 40)}
                    cy={r(anchor.y - 16)}
                    r={8}
                    stroke="currentColor"
                    strokeWidth={1.1}
                    className="fill-paper"
                  />
                  <text
                    x={r(anchor.x + 40)}
                    y={r(anchor.y - 16) + 3.5}
                    textAnchor="middle"
                    className="fill-current font-mono"
                    style={{ fontSize: 10, fontWeight: 500 }}
                  >
                    {p.tag}
                  </text>
                </motion.g>
              )}

              {/* faint tick where the part meets the explosion axis */}
              <motion.circle
                cx={r(axisPt.x)}
                cy={r(axisPt.y)}
                r={1.4}
                className="fill-current"
                opacity={0.32}
                variants={fadeAt}
                custom={edgeDelay + 0.2}
              />
            </motion.g>
          );
        })}
      </g>

      {/* BOM legend + assembly tag, pinned to the plate's lower-left */}
      {showBom && (
        <motion.g variants={fadeAt} custom={tBom}>
          <line x1={20} y1={EX_VIEW.h - 86} x2={150} y2={EX_VIEW.h - 86} stroke="currentColor" strokeWidth={1} opacity={0.35} />
          <text x={20} y={EX_VIEW.h - 92} className="fill-current font-mono" style={{ fontSize: 8.5, letterSpacing: "0.14em", opacity: 0.6 }}>
            BILL OF MATERIALS
          </text>
          {parts.map((p, i) => (
            <text
              key={i}
              x={20}
              y={EX_VIEW.h - 70 + i * 15}
              className="fill-current font-mono"
              style={{ fontSize: 10.5, opacity: 0.78 }}
            >
              {`${p.tag} · ${p.bom}`}
            </text>
          ))}
          {/* tool-call / kernel stamp, mirroring the ThroughLine "valid" chip */}
          <g transform={`translate(${EX_VIEW.w - 130} ${EX_VIEW.h - 30})`}>
            <rect x={0} y={-14} width={112} height={20} rx={2} stroke="currentColor" strokeWidth={1} opacity={0.4} />
            <text x={56} y={-0.5} textAnchor="middle" className="fill-current font-mono" style={{ fontSize: 9.5 }}>
              part.assembly()
            </text>
          </g>
        </motion.g>
      )}
    </motion.svg>
  );
}

/** A counterbore ellipse pair at the projected centre of a part's top face. */
function Bore({
  cx,
  cy,
  radius,
  delay,
  reduce,
}: {
  cx: number;
  cy: number;
  radius: number;
  delay: number;
  reduce: boolean;
}) {
  const ry = radius * 0.5; // iso squash on the ground plane
  return (
    <g>
      <motion.ellipse
        cx={r(cx)}
        cy={r(cy)}
        rx={r(radius)}
        ry={r(ry)}
        stroke="currentColor"
        strokeWidth={1.1}
        opacity={0.7}
        variants={edgeDraw}
        custom={reduce ? 0 : delay}
      />
      <motion.ellipse
        cx={r(cx)}
        cy={r(cy)}
        rx={r(radius * 0.6)}
        ry={r(ry * 0.6)}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.45}
        variants={edgeDraw}
        custom={reduce ? 0 : delay + 0.12}
      />
    </g>
  );
}

/* =====================================================================
   FacilitySwarm — dense ZONED iso field. Hundreds of tiny boxes packed
   into 3–4 rectangular bays divided by aisles (organized, NOT confetti),
   one-shot row-by-row fade-in then hold. Reuses iso().
   ===================================================================== */

export type Bay = {
  /** Bay origin + footprint on the iso ground grid, in cell units. */
  gx: number;
  gz: number;
  cols: number;
  rows: number;
  /** Height band for the boxes in this bay (world units). */
  hMin: number;
  hMax: number;
  label: string;
};

const DEFAULT_BAYS: Bay[] = [
  { gx: 0, gz: 0, cols: 9, rows: 7, hMin: 10, hMax: 30, label: "pallet racking" },
  { gx: 11, gz: 0, cols: 7, rows: 7, hMin: 8, hMax: 18, label: "machine rows" },
  { gx: 0, gz: 9, cols: 18, rows: 4, hMin: 14, hMax: 40, label: "tank farm" },
];

const FS_VIEW = { w: 460, h: 320 };

export function FacilitySwarm({
  seed = 7,
  bays = DEFAULT_BAYS,
  cell = 13,
  showLabels = true,
  trigger = "view",
  className,
}: {
  seed?: number;
  bays?: Bay[];
  cell?: number;
  showLabels?: boolean;
  trigger?: "view" | "load";
  className?: string;
}) {
  const reduce = useReducedMotion();

  const { boxes, rowCount, labels } = useMemo(() => {
    const rng = mulberry32(seed);
    type B = { paths: BoxPaths; row: number; o: number };
    const out: B[] = [];
    let maxRow = 0;
    const lbls: { p: Pt; text: string }[] = [];

    for (const bay of bays) {
      for (let rz = 0; rz < bay.rows; rz++) {
        for (let cx2 = 0; cx2 < bay.cols; cx2++) {
          // small deterministic per-box gap so units read as discrete crates,
          // not a single melted slab. Footprint < cell pitch.
          const pad = 1.4;
          const wx = bay.gx + cx2;
          const wz = bay.gz + rz;
          const h = bay.hMin + rng() * (bay.hMax - bay.hMin);
          const paths = isoBox(
            wx * cell + pad,
            0,
            wz * cell + pad,
            cell - pad * 2,
            h,
            cell - pad * 2,
          );
          // "Row" for the fill-in wave = diagonal sweep across the whole field.
          const row = wx + wz;
          out.push({ paths, row, o: 0.06 + rng() * 0.1 });
        }
      }
      // bay label anchored at its near corner.
      lbls.push({ p: iso(bay.gx * cell, 0, (bay.gz + bay.rows) * cell + 6), text: bay.label });
    }
    for (const b of out) maxRow = Math.max(maxRow, b.row);
    return { boxes: out, rowCount: maxRow, labels: lbls };
  }, [bays, cell, seed]);

  // Centre the whole field in the viewBox.
  const transform = useMemo(() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const b of boxes) {
      // cheap bbox from the top-face move command is enough for centring.
      const nums = b.paths.outline.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
      for (let i = 0; i < nums.length; i += 2) {
        minX = Math.min(minX, nums[i]);
        maxX = Math.max(maxX, nums[i]);
        minY = Math.min(minY, nums[i + 1]);
        maxY = Math.max(maxY, nums[i + 1]);
      }
    }
    const fieldW = maxX - minX;
    const fieldH = maxY - minY;
    const tx = (FS_VIEW.w - fieldW) / 2 - minX;
    const ty = (FS_VIEW.h - fieldH) / 2 - minY;
    return { tx: r(tx), ty: r(ty) };
  }, [boxes]);

  const motionProps = reduce
    ? ({ initial: false, animate: "show" } as const)
    : trigger === "load"
      ? ({ initial: "hidden", animate: "show" } as const)
      : ({ initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } } as const);

  // The diagonal fill wave: each "row" lights up ~30ms after the previous,
  // capped so a huge field still resolves in ~1.1s.
  const perRow = Math.min(0.03, 1.1 / Math.max(1, rowCount));

  const swarmFace: Variants = {
    hidden: { opacity: 0 },
    show: (i: { row: number; o: number }) => ({
      opacity: i.o,
      transition: { duration: 0.28, ease: EASE, delay: i.row * perRow },
    }),
  };
  const swarmEdge: Variants = {
    hidden: { opacity: 0 },
    show: (i: { row: number }) => ({
      opacity: 0.85,
      transition: { duration: 0.28, ease: EASE, delay: i.row * perRow },
    }),
  };

  return (
    <motion.svg
      viewBox={`0 0 ${FS_VIEW.w} ${FS_VIEW.h}`}
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full text-ink", className)}
      {...motionProps}
    >
      <g transform={`translate(${transform.tx} ${transform.ty})`}>
        {boxes.map((b, i) => (
          <g key={i}>
            <motion.path d={b.paths.top} className="fill-current" variants={swarmFace} custom={{ row: b.row, o: b.o + 0.05 }} />
            <motion.path d={b.paths.left} className="fill-current" variants={swarmFace} custom={{ row: b.row, o: b.o }} />
            <motion.path d={b.paths.right} className="fill-current" variants={swarmFace} custom={{ row: b.row, o: b.o + 0.02 }} />
            <motion.path
              d={b.paths.outline}
              stroke="currentColor"
              strokeWidth={0.6}
              strokeLinejoin="round"
              variants={swarmEdge}
              custom={{ row: b.row }}
              style={{ opacity: 0 }}
            />
          </g>
        ))}
        {showLabels &&
          labels.map((l, i) => (
            <motion.text
              key={i}
              x={r(l.p.x)}
              y={r(l.p.y)}
              className="fill-current font-mono"
              style={{ fontSize: 8.5, letterSpacing: "0.12em", opacity: 0 }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 1.0 + i * 0.08 }}
            >
              {l.text.toUpperCase()}
            </motion.text>
          ))}
        {/* scale readout — the 100k-component story, mono, value only */}
        {showLabels && (
          <motion.text
            x={FS_VIEW.w / 2 - transform.tx}
            y={FS_VIEW.h - 10 - transform.ty}
            textAnchor="middle"
            className="fill-current font-mono"
            style={{ fontSize: 10, letterSpacing: "0.04em", opacity: 0 }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 1.2 }}
          >
            100,000 components · zoned, not confetti
          </motion.text>
        )}
      </g>
    </motion.svg>
  );
}
