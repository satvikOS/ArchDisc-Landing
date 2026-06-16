"use client";

import { Stage3D, type Stage3DCtx, type Stage3DHandle } from "@/components/visual/Stage3D";
import { cn } from "@/lib/utils";

export type Solid3DVariant = "vessel" | "bracket" | "knot";

/** A monochrome WebGL solid — wireframe over faintly-lit faces — that slowly
 *  orbits and breathes. Lazy/disposed/reduced-motion handled by Stage3D. */
export function Solid3D({
  variant = "vessel",
  dark = false,
  className,
}: {
  variant?: Solid3DVariant;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full text-ink", className)}>
      {!dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[20%] bottom-[11%] h-[12%] rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(17,21,28,0.16), transparent 72%)",
            filter: "blur(10px)",
          }}
        />
      )}
      <Stage3D
        dark={dark}
        camZ={variant === "vessel" ? 3.6 : 3.3}
        build={(ctx) => buildSolid(ctx, variant)}
      />
    </div>
  );
}

function buildSolid(ctx: Stage3DCtx, variant: Solid3DVariant): Stage3DHandle {
  const { THREE, group, colors, dark } = ctx;
  const col = dark ? colors.paper : colors.ink;

  let geo: import("three").BufferGeometry;
  let smooth = false;
  if (variant === "vessel") {
    const V = THREE.Vector2;
    const profile = [
      new V(0.001, -1.0),
      new V(0.42, -1.0),
      new V(0.48, -0.86),
      new V(0.6, -0.45),
      new V(0.66, -0.04),
      new V(0.57, 0.34),
      new V(0.31, 0.66),
      new V(0.4, 0.9),
      new V(0.35, 0.99),
    ];
    geo = new THREE.LatheGeometry(profile, 48);
    smooth = true;
  } else if (variant === "bracket") {
    const s = new THREE.Shape();
    s.moveTo(-0.7, -0.7);
    s.lineTo(0.7, -0.7);
    s.lineTo(0.7, -0.28);
    s.lineTo(-0.28, -0.28);
    s.lineTo(-0.28, 0.7);
    s.lineTo(-0.7, 0.7);
    s.closePath();
    const h1 = new THREE.Path();
    h1.absarc(0.36, -0.49, 0.12, 0, Math.PI * 2, true);
    const h2 = new THREE.Path();
    h2.absarc(-0.49, 0.36, 0.12, 0, Math.PI * 2, true);
    s.holes.push(h1, h2);
    geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 1,
      curveSegments: 24,
    });
  } else {
    geo = new THREE.TorusKnotGeometry(0.6, 0.2, 180, 24, 2, 3);
    smooth = true;
  }
  geo.center();
  geo.computeVertexNormals();

  const faceMat = new THREE.MeshStandardMaterial({
    color: col,
    transparent: true,
    opacity: dark ? 0.13 : 0.08,
    roughness: 0.95,
    metalness: 0,
    flatShading: !smooth,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, faceMat);

  const wireGeo =
    variant === "bracket"
      ? new THREE.EdgesGeometry(geo, 22)
      : new THREE.WireframeGeometry(geo);
  const wireMat = new THREE.LineBasicMaterial({
    color: col,
    transparent: true,
    opacity: variant === "bracket" ? (dark ? 0.6 : 0.52) : dark ? 0.28 : 0.2,
  });
  const wire = new THREE.LineSegments(wireGeo, wireMat);

  group.add(mesh, wire);
  group.rotation.set(0.42, 0.5, 0);

  // Fit to a consistent visual size regardless of variant.
  const sphere = new THREE.Box3()
    .setFromObject(group)
    .getBoundingSphere(new THREE.Sphere());
  const base = 1.3 / (sphere.radius || 1);
  group.scale.setScalar(base);

  return {
    update: (t) => {
      group.rotation.y = 0.5 + t * 0.2; // slow orbit
      const breathe = 1 + Math.sin(t * 0.7) * 0.015; // breathing scale
      group.scale.setScalar(base * breathe);
      group.position.y = Math.sin(t * 0.5) * 0.04; // gentle bob
    },
  };
}
