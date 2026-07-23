/**
 * Hand-doodle work — UNIQUE pieces, each used at most once on the page.
 * Style (per ref): thick wobbly pencil outlines + stipple-dot fills inside
 * shapes, quick ghost passes, speed-lines. stroke=currentColor, aria-hidden.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P, vb = "0 0 120 100") => ({ viewBox: vb, fill: "none", "aria-hidden": true as const, ...p });

/** Stipple pattern def — call once per SVG with a unique id. */
function Dots({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
        <circle cx="2" cy="2" r="1.1" fill="currentColor" opacity="0.75" />
      </pattern>
    </defs>
  );
}

/** Wobbly pencil stroke + faint ghost pass. */
function Sketch({ d, w = 2.6, ghost = true }: { d: string; w?: number; ghost?: boolean }) {
  return (
    <>
      {ghost && (
        <path
          d={d}
          stroke="currentColor"
          strokeWidth={w * 0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
          transform="translate(1.4 -1)"
        />
      )}
      <path d={d} stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity="0.92" />
    </>
  );
}

/** The idea-tangle — a scribbled ball of intent. */
export function ScribbleTangle(p: P) {
  return (
    <svg {...base(p)}>
      <Sketch d="M28 52 C22 38 38 26 52 30 C68 34 74 24 84 32 C96 41 88 50 78 52 C92 54 98 66 86 72 C76 77 66 70 58 74 C48 79 34 76 32 66 C24 68 20 60 28 52 Z" w={2.6} />
      <Sketch d="M40 48 C50 40 66 42 70 50 C74 58 62 64 52 62 C44 60 36 56 40 48 Z" w={2} />
      <Sketch d="M48 52 C56 48 64 52 60 57 C56 62 46 58 48 52 Z" w={1.7} ghost={false} />
    </svg>
  );
}

/** Curly doodle arrow with a loop. */
export function CurlyArrowLoop(p: P) {
  return (
    <svg {...base(p)}>
      <Sketch d="M10 80 C30 78 42 66 44 54 C46 44 38 40 32 46 C26 52 34 60 44 58 C62 54 74 40 96 30" w={2.7} />
      <Sketch d="M84 26 L98 29 L92 42" w={2.7} ghost={false} />
    </svg>
  );
}

/** Wavy doodle arrow, pointing right. */
export function WavyArrow(p: P) {
  return (
    <svg {...base(p)}>
      <Sketch d="M12 40 C30 30 40 54 58 46 C74 39 84 52 100 50" w={2.7} />
      <Sketch d="M90 42 L102 51 L88 58" w={2.7} ghost={false} />
    </svg>
  );
}

/** Straight-ish dart arrow — quick, slightly overshooting. */
export function DartArrow(p: P) {
  return (
    <svg {...base(p, "0 0 110 50")}>
      <Sketch d="M8 30 C34 24 62 28 98 22" w={2.7} />
      <Sketch d="M86 14 L100 22 L84 32" w={2.7} ghost={false} />
    </svg>
  );
}

/** Pencil burst — quick radiating strokes. */
export function InkBurst(p: P) {
  return (
    <svg {...base(p, "0 0 100 100")}>
      <Sketch d="M50 14 L54 40" w={2.6} ghost={false} />
      <Sketch d="M78 26 L58 46" w={2.6} ghost={false} />
      <Sketch d="M88 58 L60 54" w={2.6} ghost={false} />
      <Sketch d="M70 84 L54 60" w={2.6} ghost={false} />
      <Sketch d="M32 80 L46 58" w={2.6} ghost={false} />
      <Sketch d="M14 54 L42 52" w={2.6} ghost={false} />
      <Sketch d="M26 24 L44 44" w={2.6} ghost={false} />
    </svg>
  );
}

/** Speed-lines — three quick dashes (motion/energy). */
export function SpeedLines(p: P) {
  return (
    <svg {...base(p, "0 0 90 60")}>
      <Sketch d="M10 14 C34 10 58 10 82 14" w={3} ghost={false} />
      <Sketch d="M18 30 C38 27 56 27 74 30" w={3} ghost={false} />
      <Sketch d="M26 46 C40 44 52 44 64 46" w={3} ghost={false} />
    </svg>
  );
}

/** Doodled bearing flange — thick outline, stipple-filled plate. */
export function FlangeSketch(p: P) {
  return (
    <svg {...base(p, "0 0 160 110")}>
      <Dots id="hd-dots-flange" />
      <path d="M18 62 L64 34 L142 52 L98 84 Z" fill="url(#hd-dots-flange)" opacity="0.55" />
      <Sketch d="M18 62 L64 34 L142 52 L98 84 Z" w={2.7} />
      <Sketch d="M56 55 A24 12 0 0 0 104 55 A24 12 0 0 0 56 55" w={2.4} />
      <Sketch d="M56 49 A24 12 0 0 0 104 49 A24 12 0 0 0 56 49" w={2.4} />
      <Sketch d="M56 49 L56 55 M104 49 L104 55" w={2.2} ghost={false} />
      <Sketch d="M69 49 A11 5.5 0 0 0 91 49 A11 5.5 0 0 0 69 49" w={2} ghost={false} />
      <Sketch d="M33.5 60 A4.5 2.4 0 0 0 42.5 60 A4.5 2.4 0 0 0 33.5 60" w={1.8} ghost={false} />
      <Sketch d="M65.5 40 A4.5 2.4 0 0 0 74.5 40 A4.5 2.4 0 0 0 65.5 40" w={1.8} ghost={false} />
      <Sketch d="M119.5 55 A4.5 2.4 0 0 0 128.5 55 A4.5 2.4 0 0 0 119.5 55" w={1.8} ghost={false} />
      <Sketch d="M91.5 76 A4.5 2.4 0 0 0 100.5 76 A4.5 2.4 0 0 0 91.5 76" w={1.8} ghost={false} />
    </svg>
  );
}

/** Doodled sculpted vessel — thick outline, stipple-filled belly. */
export function VesselSketch(p: P) {
  return (
    <svg {...base(p, "0 0 100 130")}>
      <Dots id="hd-dots-vessel" />
      <path
        d="M40 38 C30 48 24 62 28 82 C31 98 40 112 50 114 C60 112 69 98 72 82 C76 62 70 48 60 38 Z"
        fill="url(#hd-dots-vessel)"
        opacity="0.5"
      />
      <Sketch d="M38 16 C34 26 42 30 40 38 C30 48 24 62 28 82 C31 98 40 112 50 114 C60 112 69 98 72 82 C76 62 70 48 60 38 C58 30 66 26 62 16 C54 20 46 20 38 16 Z" w={2.7} />
      <Sketch d="M34 74 C44 80 56 80 66 74" w={2.1} ghost={false} />
    </svg>
  );
}
