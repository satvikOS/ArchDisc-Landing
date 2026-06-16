"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { usePointerRef } from "@/lib/instrument";
import { cn } from "@/lib/utils";

export type Stage3DColors = { ink: number; paper: number; line: number };
export type Stage3DCtx = {
  THREE: typeof THREE;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  colors: Stage3DColors;
  dark: boolean;
};
export type Stage3DHandle = {
  update?: (t: number, ctx: Stage3DCtx) => void;
  dispose?: () => void;
};
export type Stage3DBuilder = (ctx: Stage3DCtx) => Stage3DHandle;

function readHex(name: string, fallback: string): number {
  let v = fallback;
  if (typeof window !== "undefined") {
    v =
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
      fallback;
  }
  return parseInt(v.replace("#", ""), 16);
}

/**
 * A reusable, dependency-lazy WebGL stage. `build(ctx)` adds meshes to ctx.group
 * and returns an optional { update(t), dispose } — update runs once per frame for
 * orbit/breathing. Monochrome (colors pulled from CSS tokens), reduced-motion-safe
 * (renders a single static frame), paused off-screen, fully disposed on unmount.
 */
export function Stage3D({
  build,
  dark = false,
  camZ = 4.2,
  className,
}: {
  build: Stage3DBuilder;
  dark?: boolean;
  camZ?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildRef = useRef(build);
  useEffect(() => {
    buildRef.current = build;
  }, [build]);
  const reduce = usePrefersReducedMotion();
  const pointerRef = usePointerRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let disposed = false;
    let running = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let ctx: Stage3DCtx | null = null;
    let handle: Stage3DHandle = {};
    const cleanups: Array<() => void> = [];

    void (async () => {
      const THREE_ = await import("three");
      if (disposed || !canvas) return;
      const parent = canvas.parentElement ?? canvas;

      const size = () => {
        const r = parent.getBoundingClientRect();
        return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
      };
      let { w, h } = size();

      try {
        renderer = new THREE_.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(w, h, false);

      const scene = new THREE_.Scene();
      const camera = new THREE_.PerspectiveCamera(34, w / h, 0.1, 100);
      camera.position.set(0, 0, camZ);

      scene.add(new THREE_.AmbientLight(0xffffff, dark ? 0.55 : 0.72));
      const key = new THREE_.DirectionalLight(0xffffff, 1.15);
      key.position.set(-1.5, 1.7, 1.3);
      scene.add(key);
      const rim = new THREE_.DirectionalLight(0xffffff, 0.35);
      rim.position.set(1.6, -0.6, -1.0);
      scene.add(rim);

      const group = new THREE_.Group();
      scene.add(group);

      ctx = {
        THREE: THREE_,
        scene,
        camera,
        group,
        colors: {
          ink: readHex("--color-ink", "#11151c"),
          paper: readHex("--color-paper", "#fafafa"),
          line: readHex("--color-line-strong", "#dcdce0"),
        },
        dark,
      };
      handle = buildRef.current(ctx) ?? {};

      const render = () => renderer && ctx && renderer.render(ctx.scene, ctx.camera);
      const loop = (tms: number) => {
        if (disposed) return;
        // cursor-as-key-light: rake the single key light toward the pointer
        const pt = pointerRef?.current;
        if (pt) {
          const tx = (pt.x - 0.5) * 4.4;
          const ty = (0.42 - pt.y) * 3.6 + 1.1;
          key.position.x += (tx - key.position.x) * 0.06;
          key.position.y += (ty - key.position.y) * 0.06;
        }
        handle.update?.(tms / 1000, ctx as Stage3DCtx);
        render();
        raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (running || disposed) return;
        running = true;
        if (reduce) {
          handle.update?.(0, ctx as Stage3DCtx);
          render();
        } else {
          raf = requestAnimationFrame(loop);
        }
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      const ro = new ResizeObserver(() => {
        const next = size();
        w = next.w;
        h = next.h;
        renderer?.setSize(w, h, false);
        if (ctx) {
          ctx.camera.aspect = w / h;
          ctx.camera.updateProjectionMatrix();
        }
        if (reduce || !running) render();
      });
      ro.observe(parent);
      cleanups.push(() => ro.disconnect());

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) start();
            else stop();
          }
        },
        { rootMargin: "140px" },
      );
      io.observe(canvas);
      cleanups.push(() => io.disconnect());

      render();
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
      handle.dispose?.();
      if (ctx) {
        ctx.scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mat = mesh.material;
          if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
        });
      }
      renderer?.dispose();
    };
  }, [reduce, camZ, dark, pointerRef]);

  return (
    <canvas ref={canvasRef} aria-hidden className={cn("block h-full w-full", className)} />
  );
}
