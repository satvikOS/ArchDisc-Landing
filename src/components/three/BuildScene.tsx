"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/artkit";

/**
 * The live "describe → build" centerpiece.
 *
 * A real mechanical flange part is *manufactured* on screen: a clipping plane
 * sweeps bottom-to-top so the solid materializes, its accent edges draw in, then
 * it settles into a slow, weighty auto-rotation. Everything is raw Three.js,
 * lazily imported so it never bloats the initial bundle. Reduced-motion users get
 * a single, fully-resolved static frame — the story reads with zero motion.
 */
export function BuildScene({
  className,
  startDelay = 1900,
}: {
  className?: string;
  startDelay?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !hostRef.current) return;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.localClippingEnabled = true;
      const canvas = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(3.6, 2.7, 4.6);
      camera.lookAt(0, 0.15, 0);

      // ── Lighting: flat matte "paper" look with a warm coral rim ──
      scene.add(new THREE.HemisphereLight(0xfff3df, 0x9a8722, 1.05));
      const key = new THREE.DirectionalLight(0xffffff, 1.35);
      key.position.set(5, 8, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xe0522f, 0.7);
      rim.position.set(-6, 2, -4);
      scene.add(rim);
      const warm = new THREE.DirectionalLight(0x93ce45, 0.28);
      warm.position.set(-2, -4, 3);
      scene.add(warm);

      // ── Geometry: a bearing flange — rounded plate, central bored boss, 4 holes ──
      const roundedRect = (w: number, h: number, r: number) => {
        const s = new THREE.Shape();
        const x = -w / 2, y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
        s.lineTo(x + w, y + h - r);
        s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
        s.lineTo(x + r, y + h);
        s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
        s.lineTo(x, y + r);
        s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
        return s;
      };

      const W = 3.3, H = 2.3;
      const plateShape = roundedRect(W, H, 0.32);
      const hole = (cx: number, cy: number, rad: number) => {
        const p = new THREE.Path();
        p.absarc(cx, cy, rad, 0, Math.PI * 2, true);
        return p;
      };
      const bore = 0.56;
      plateShape.holes.push(hole(0, 0, bore));
      const hx = W / 2 - 0.42, hy = H / 2 - 0.42;
      for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]] as const) {
        plateShape.holes.push(hole(sx * hx, sy * hy, 0.17));
      }
      const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
        depth: 0.34,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.035,
        bevelSegments: 2,
        curveSegments: 48,
      });

      // Raised bored boss around the central hole (hollow cylinder profile).
      const ring = new THREE.Shape();
      ring.absarc(0, 0, 0.86, 0, Math.PI * 2, false);
      ring.holes.push(hole(0, 0, bore));
      const bossGeo = new THREE.ExtrudeGeometry(ring, {
        depth: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 2,
        curveSegments: 64,
      });
      bossGeo.translate(0, 0, 0.34);

      // Merge by adding as sibling meshes under one group; orient flat (Z-up → Y-up).
      const material = new THREE.MeshStandardMaterial({
        color: 0xf1e7cf,
        metalness: 0.04,
        roughness: 0.92,
      });
      const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.35); // reveals bottom→top
      material.clippingPlanes = [clip];

      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x1a1710,
        transparent: true,
        opacity: 0,
      });
      edgeMat.clippingPlanes = [clip];

      const part = new THREE.Group();
      for (const geo of [plateGeo, bossGeo]) {
        const mesh = new THREE.Mesh(geo, material);
        part.add(mesh);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 32), edgeMat);
        part.add(edges);
      }
      part.rotation.x = -Math.PI / 2; // lay flat
      part.position.y = -0.18;
      const spin = new THREE.Group();
      spin.add(part);
      scene.add(spin);

      // ── Sizing ──
      const size = () => {
        const rect = host.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      size();

      const TOP = 1.15, BOTTOM = -0.35;
      const setReveal = (t: number) => {
        clip.constant = BOTTOM + (TOP - BOTTOM) * t;
        edgeMat.opacity = Math.max(0, (t - 0.5) / 0.5);
      };

      let raf = 0;
      let t0 = 0;
      let visible = true;
      const DUR_BUILD = 1500;

      let lost = false;
      const renderOnce = () => {
        if (!lost) renderer.render(scene, camera);
      };

      // Single per-frame function — both the initial start and the
      // IntersectionObserver resume schedule THIS, so parallax + bob survive a
      // scroll-away/return and the build (keyed off t0) never replays once done.
      const loop = (now: number) => {
        if (!t0) t0 = now + startDelay; // anticipation before the build begins
        const elapsed = now - t0;
        if (elapsed < 0) {
          setReveal(0);
        } else if (elapsed < DUR_BUILD) {
          const t = elapsed / DUR_BUILD;
          setReveal(1 - Math.pow(1 - t, 3)); // ease-out
        } else {
          // Build complete — freeze. The model does not move.
          setReveal(1);
          renderOnce();
          raf = 0;
          return;
        }
        renderOnce();
        if (visible && !lost) raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (!raf && !lost) raf = requestAnimationFrame(loop);
      };

      if (reduce) {
        setReveal(1);
        edgeMat.opacity = 1;
        renderOnce();
      } else {
        start();
      }

      // WebGL context loss/restore — keep the canvas recoverable instead of
      // silently black-and-erroring on a GPU reset or reclaimed context.
      const onLost = (e: Event) => {
        e.preventDefault();
        lost = true;
        cancelAnimationFrame(raf);
        raf = 0;
      };
      const onRestored = () => {
        lost = false;
        size();
        if (reduce) renderOnce();
        else if (visible) start();
      };
      canvas.addEventListener("webglcontextlost", onLost, false);
      canvas.addEventListener("webglcontextrestored", onRestored, false);

      const io = new IntersectionObserver(
        ([e]) => {
          visible = e.isIntersecting;
          if (visible) {
            if (reduce) renderOnce();
            else start();
          } else {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        },
        { rootMargin: "80px" },
      );
      io.observe(host);

      const ro = new ResizeObserver(() => {
        size();
        if (reduce) renderOnce();
      });
      ro.observe(host);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.removeEventListener("webglcontextrestored", onRestored);
        part.traverse((o) => {
          const anyO = o as unknown as { geometry?: { dispose?: () => void } };
          anyO.geometry?.dispose?.();
        });
        material.dispose();
        edgeMat.dispose();
        renderer.forceContextLoss();
        renderer.dispose();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduce, startDelay]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}

export default BuildScene;
