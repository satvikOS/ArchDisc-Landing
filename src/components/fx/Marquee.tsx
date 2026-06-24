"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A seamless, infinite marquee. Renders the row twice and translates -50%.
 *  Honors reduced motion via the global keyframe gate (animation removed). */
export function Marquee({
  children,
  duration = 32,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className="arc-marquee flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
