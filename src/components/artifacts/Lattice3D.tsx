"use client";

import { Stage3D, type Stage3DCtx, type Stage3DHandle } from "@/components/visual/Stage3D";
import { mulberry32 } from "@/lib/artkit";
import { cn } from "@/lib/utils";

/** A 3D node lattice — Archie's local model fleet as a slowly rotating, breathing
 *  constellation of nodes + nearest-neighbour links. Monochrome WebGL. */
export function Lattice3D({
  dark = false,
  nodes = 48,
  seed = 7,
  className,
}: {
  dark?: boolean;
  nodes?: number;
  seed?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full text-ink", className)}>
      <Stage3D dark={dark} camZ={4} build={(ctx) => buildLattice(ctx, nodes, seed)} />
    </div>
  );
}

function buildLattice(ctx: Stage3DCtx, n: number, seed: number): Stage3DHandle {
  const { THREE, group, colors, dark } = ctx;
  const col = dark ? colors.paper : colors.ink;
  const rnd = mulberry32(seed);

  // Fibonacci sphere with a little jitter so it reads organic, not gridded.
  const pos: import("three").Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * 2.399963229;
    const j = 0.14;
    pos.push(
      new THREE.Vector3(
        Math.cos(phi) * r + (rnd() - 0.5) * j,
        y + (rnd() - 0.5) * j,
        Math.sin(phi) * r + (rnd() - 0.5) * j,
      ).multiplyScalar(1.3),
    );
  }

  const points = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(pos),
    new THREE.PointsMaterial({
      color: col,
      size: 0.055,
      transparent: true,
      opacity: dark ? 0.95 : 0.85,
      sizeAttenuation: true,
    }),
  );

  const segs: import("three").Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const near = pos
      .map((p, j) => ({ j, d: i === j ? Infinity : p.distanceTo(pos[i]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of near) if (j > i) segs.push(pos[i], pos[j]);
  }
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(segs),
    new THREE.LineBasicMaterial({
      color: col,
      transparent: true,
      opacity: dark ? 0.3 : 0.22,
    }),
  );

  group.add(points, lines);

  return {
    update: (t) => {
      group.rotation.y = t * 0.12;
      group.rotation.x = 0.2 + Math.sin(t * 0.3) * 0.08;
      group.scale.setScalar(1 + Math.sin(t * 0.6) * 0.02); // breathe
    },
  };
}
