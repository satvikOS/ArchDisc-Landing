"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { useDecrypt } from "@/lib/decrypt";
import { cn } from "@/lib/utils";

/**
 * Text that arrives redacted and decodes into place when scrolled into view —
 * the site's signature gesture. The real string is exposed to assistive tech via
 * aria-label; the animated cipher is aria-hidden.
 */
export function Decrypt({
  text,
  className,
  duration = 900,
  delay = 0,
  trigger = "view",
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  /** "view" decodes on scroll-in; "mount" decodes immediately. */
  trigger?: "view" | "mount";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const active = trigger === "mount" ? true : inView;
  const out = useDecrypt(text, { active, duration, delay });

  return (
    <span ref={ref} className={cn("u-cipher", className)} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
