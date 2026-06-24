"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { Solid3D, type Solid3DVariant } from "@/components/artifacts/Solid3D";
import { stagger, riseIn } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/artkit";
import { cn } from "@/lib/utils";

type Preset = {
  key: string;
  label: string;
  variant: Solid3DVariant;
  prompt: string;
  calls: [string, string][];
  dim: string;
};

const PRESETS: Preset[] = [
  {
    key: "vase",
    label: "Shelled vase",
    variant: "vessel",
    prompt: "Revolve a 60 mm vase, shell to 2 mm, fillet the rim.",
    calls: [
      ["sketch.revolveProfile", "pts=7"],
      ["part.shell", "t=2.0"],
      ["part.filletEdges", "rim · r1.5"],
      ["heal.checkValidity", "valid"],
    ],
    dim: "Ø 60.0 · h 146",
  },
  {
    key: "bracket",
    label: "Wall bracket",
    variant: "bracket",
    prompt: "A 100 mm wall bracket, two M6 holes 60 mm apart, 4 mm wall.",
    calls: [
      ["sketch.rect", "100×40"],
      ["part.extrude", "d=4"],
      ["part.holes", "2×M6 @60"],
      ["part.filletEdges", "inner · r3"],
      ["heal.checkValidity", "valid"],
    ],
    dim: "100.0 · 2×Ø6",
  },
  {
    key: "manifold",
    label: "Twisted manifold",
    variant: "knot",
    prompt: "A twisted toroidal manifold, 2×3 winding, Ø8 tube.",
    calls: [
      ["sketch.torusKnot", "p=2 · q=3"],
      ["part.sweep", "Ø0.4"],
      ["heal.checkValidity", "valid"],
    ],
    dim: "R 0.60 · 2×3",
  },
];

function matchPreset(text: string, current: number): number {
  const t = text.toLowerCase();
  if (/vase|vessel|shell|cup|revolv|bowl|lathe/.test(t)) return 0;
  if (/brack|plate|hole|mount|wall|flange|extrud/.test(t)) return 1;
  if (/knot|torus|manifold|coil|twist|gear|sweep/.test(t)) return 2;
  return current;
}

/** The interactive exhibit behind glass: type a part, Archie builds it for real,
 *  but the finished work stays a preview until the doors open. */
export function LockedProbe({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  const [pi, setPi] = useState(0);
  const [text, setText] = useState("");
  const preset = PRESETS[pi];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_30px_80px_-40px_rgba(12,19,34,0.35)]",
        className,
      )}
    >
      {/* glass sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 35%)",
        }}
      />

      {/* prompt field + presets */}
      <div className="relative border-b border-line p-3.5">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="u-label text-faint">The interactive exhibit</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-iris-magenta">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-iris-magenta" aria-hidden />
            live preview
          </span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPi((cur) => matchPreset(text, cur));
          }}
          className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2"
        >
          <span className="font-mono text-[12px] text-faint">›</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe a part — e.g. “a 100 mm wall bracket”"
            aria-label="Describe a part for Archie to build"
            className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-ink placeholder:text-faint focus:outline-none"
          />
          <button
            type="submit"
            className="iris-fill rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris-magenta/40"
          >
            build
          </button>
        </form>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {PRESETS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                setPi(i);
                setText("");
              }}
              aria-pressed={i === pi}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris-magenta/40",
                i === pi
                  ? "border-transparent iris-fill text-white"
                  : "border-line text-muted hover:border-ink/30 hover:text-ink",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* bench: resolving 3D part + the tool-call stream */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_215px]">
        <div className="relative min-h-[300px] sm:min-h-[360px]">
          <Solid3D key={preset.key} variant={preset.variant} className="absolute inset-0" />
          <span className="absolute bottom-3 left-3 font-mono text-[10px] tabular-nums text-faint">
            {preset.dim}
          </span>
        </div>

        <div className="border-t border-line p-3.5 sm:border-l sm:border-t-0">
          <span className="u-label text-faint">archie · tool-calls</span>
          <motion.ul
            key={preset.key}
            className="mt-3 flex flex-col gap-2"
            variants={stagger(0.1, 0.15)}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            {preset.calls.map(([verb, arg], i) => {
              const last = i === preset.calls.length - 1;
              return (
                <motion.li
                  key={verb}
                  variants={riseIn}
                  className="flex items-baseline gap-1.5 font-mono text-[10.5px] leading-snug"
                >
                  <span className={last ? "text-signal" : "text-faint"}>{last ? "✓" : "→"}</span>
                  <span className="min-w-0 flex-1 truncate text-ink-soft">
                    {verb}
                    <span className="text-faint">({arg})</span>
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
          <div className="mt-3 inline-flex items-center gap-1.5 border-t border-line pt-3 font-mono text-[10.5px] text-signal">
            <span>✓</span> valid · editable tree
          </div>
        </div>
      </div>

      {/* the stamp — preview only */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-paper/60 px-3.5 py-2.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
          <Lock size={11} /> preview · full access by clearance
        </span>
        <a
          href="/access"
          className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-iris-magenta hover:text-ink"
        >
          request access →
        </a>
      </div>
    </div>
  );
}
