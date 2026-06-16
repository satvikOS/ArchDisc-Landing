"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { precision } from "@/lib/content";

function StatCounter({ value }: { value: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const numeric = /^[0-9,]+$/.test(value);
  const target = numeric ? parseInt(value.replace(/,/g, ""), 10) : 0;
  const [n, setN] = useState(numeric && !reduce ? 0 : target);

  useEffect(() => {
    if (!numeric || reduce || !inView || target === 0) return;
    let raf = 0;
    const dur = 900;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, reduce, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {numeric ? n.toLocaleString("en-US") : value}
    </span>
  );
}

function FeaStrip() {
  return (
    <div className="mx-auto mt-8 max-w-md">
      <div className="flex h-2.5 w-full gap-px overflow-hidden rounded-[1px]">
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ background: `rgba(255,255,255,${(0.06 + (i / 8) * 0.9).toFixed(3)})` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/40">
        <span>low</span>
        <span>von Mises (value)</span>
        <span>high</span>
      </div>
    </div>
  );
}

export function PrecisionProof() {
  return (
    <section id="precision" className="scroll-mt-24 bg-ink py-24 text-paper md:py-32">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow className="text-white/55 [&>span]:bg-white/40">
              {precision.eyebrow}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h2 font-semibold text-white">
              {precision.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-[17px] leading-relaxed text-white/65">
              {precision.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 sm:grid-cols-2">
          {precision.proofs.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.06}>
              <div className="flex h-full flex-col bg-ink p-7">
                <div className="text-[clamp(2.4rem,4.5vw,3.4rem)] font-semibold leading-none tracking-tight text-white">
                  <StatCounter value={p.stat} />
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/55">
                  {p.label}
                </p>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-white/65">
                  {p.body}
                </p>
                <p className="mt-5 border-t border-white/10 pt-3 font-mono text-[11px] text-white/40">
                  {p.footnote}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 border-t border-white/10 pt-10 text-center">
            <p className="mx-auto max-w-2xl text-pretty text-[17px] leading-relaxed text-white/80">
              {precision.closing}
            </p>
            <FeaStrip />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
