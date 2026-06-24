"use client";

import { useEffect, useState } from "react";
import { LAUNCH_ISO } from "@/lib/site";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true once the target has passed — UI flips to "SIGNAL LIVE". */
  live: boolean;
  /** true until the first client tick (avoids hydration mismatch). */
  pending: boolean;
};

const ZERO: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  live: false,
  pending: true,
};

function compute(targetMs: number, nowMs: number): Countdown {
  const delta = targetMs - nowMs;
  if (delta <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true, pending: false };
  }
  const s = Math.floor(delta / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    live: false,
    pending: false,
  };
}

/** Live countdown to the public-release target. SSR-safe: renders ZERO/pending
 *  on the server and first paint, then ticks once mounted. */
export function useCountdown(iso: string = LAUNCH_ISO): Countdown {
  const [state, setState] = useState<Countdown>(ZERO);

  useEffect(() => {
    const target = new Date(iso).getTime();
    const tick = () => setState(compute(target, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  return state;
}

export const pad2 = (n: number) => n.toString().padStart(2, "0");
