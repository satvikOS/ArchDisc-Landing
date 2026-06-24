"use client";

import { useEffect, useRef } from "react";
import { usePointerRef } from "@/lib/instrument";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/artkit";
import { cn } from "@/lib/utils";

type Blob = {
  color: string;
  top: string;
  left: string;
  size: string;
  dur: string;
  delay: string;
  depth: number; // parallax factor
};

/** The signature "new nature" mesh — drifting iridescent blobs that the whole
 *  field parallaxes gently toward the cursor. Pure CSS motion (robust, cheap),
 *  static under reduced motion. Use as ambient background behind sections. */
const BLOBS: Blob[] = [
  { color: "var(--color-iris-violet)", top: "-12%", left: "-6%", size: "48vw", dur: "27s", delay: "0s", depth: 1.0 },
  { color: "var(--color-iris-magenta)", top: "8%", left: "52%", size: "42vw", dur: "31s", delay: "-6s", depth: 1.7 },
  { color: "var(--color-iris-coral)", top: "44%", left: "20%", size: "46vw", dur: "24s", delay: "-12s", depth: 1.3 },
  { color: "var(--color-iris-amber)", top: "52%", left: "62%", size: "38vw", dur: "29s", delay: "-3s", depth: 2.1 },
  { color: "var(--color-signal)", top: "26%", left: "30%", size: "30vw", dur: "33s", delay: "-9s", depth: 2.6 },
];

export function GradientField({
  tone = "light",
  intensity = 1,
  reactive = true,
  className,
}: {
  tone?: "light" | "vault";
  intensity?: number;
  reactive?: boolean;
  className?: string;
}) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const pointer = usePointerRef();
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!reactive || reduce || !fine || !pointer) return;
    const el = fieldRef.current;
    if (!el) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tick = () => {
      const p = pointer.current;
      const tx = (p.x - 0.5) * 40; // up to ±20px
      const ty = (p.y - 0.5) * 40;
      cur.x += (tx - cur.x) * 0.06;
      cur.y += (ty - cur.y) * 0.06;
      el.style.setProperty("--mx", cur.x.toFixed(2) + "px");
      el.style.setProperty("--my", cur.y.toFixed(2) + "px");
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reactive, reduce, fine, pointer]);

  const blend = tone === "vault" ? "screen" : "multiply";
  const base = tone === "vault" ? 0.55 : 0.45;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        ref={fieldRef}
        className="absolute inset-0"
        style={{ transform: "translate3d(var(--mx,0px), var(--my,0px), 0)" }}
      >
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className="iris-blob"
            style={
              {
                top: b.top,
                left: b.left,
                width: b.size,
                height: b.size,
                "--blob-dur": b.dur,
                "--blob-delay": b.delay,
                opacity: base * intensity,
                mixBlendMode: blend,
                background: `radial-gradient(circle at 50% 50%, ${b.color}, transparent 68%)`,
                filter: "blur(64px)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
