"use client";

import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { ParametricRevolveLathe } from "@/components/artifacts/ParametricRevolveLathe";
import { stagger, riseIn } from "@/lib/motion";
import { APP_URL, GITHUB_URL, CTA, CTA_SECONDARY } from "@/lib/site";
import { cn } from "@/lib/utils";

const EYEBROW = "ARCHDISC · OPEN-SOURCE AI DESIGN PLATFORM";
const HEADLINE = "Describe it. Archie builds it.";
const SUBHEAD =
  "One platform for 3D creation and mechanical CAD, with a local AI copilot at its center. Speak in plain language; Archie turns intent into structured tool-calls that drive a real 3D engine and a native CAD kernel — parametric, validated, manufacturable. Open code, open weights, running on your own machine.";
const MICRO =
  "Open source · free forever · public release soon · native for Apple Silicon · nothing leaves your machine.";

/** The mono tool-call rail that streams beside the lathe artifact. */
const RAIL: { verb: string; status: "ok" | "healed" }[] = [
  { verb: "part.revolveProfile(pts=7)", status: "ok" },
  { verb: "part.shell(thickness=2.0)", status: "ok" },
  { verb: "part.filletEdges(rim, r=1.5)", status: "healed" },
  { verb: "heal.checkValidity()", status: "ok" },
];

export function HomeHero() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";
  const words = HEADLINE.split(" ");

  return (
    <section
      id="hero"
      className="relative isolate scroll-mt-24 overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      <GenerativeGrid majorPitch={132} crosshair origin={["62%", "46%"]} />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[46fr_54fr] lg:gap-16">
        {/* ── Left: copy + CTA ───────────────────────────────────── */}
        <div className="flex flex-col items-start">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
              {EYEBROW}
            </span>
          </Reveal>

          <motion.h1
            className="mt-5 max-w-[15ch] text-balance text-display font-display font-semibold text-ink"
            variants={stagger(0.04, 0.05)}
            initial={init}
            animate="show"
          >
            {words.map((w, i) => (
              <motion.span key={i} variants={riseIn} className="mr-[0.2em] inline-block">
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[56ch] text-pretty text-lead text-muted">
              {SUBHEAD}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button href={APP_URL} size="lg">
                {CTA}
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button href={GITHUB_URL} size="lg" variant="ghost">
                <GitHubIcon size={15} />
                {CTA_SECONDARY}
                <Star size={14} className="text-faint" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="u-spec mt-6 max-w-[60ch] text-faint">{MICRO}</p>
          </Reveal>
        </div>

        {/* ── Right: signature artifact card + tool-call rail ─────── */}
        <Reveal delay={0.1} y={24}>
          <div className="rounded-[2px] border border-line-strong bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="u-label">part.revolve</span>
              <span className="u-label text-faint">archie → kernel</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
              {/* tool-call rail */}
              <div className="border-b border-line p-4 sm:border-b-0 sm:border-r">
                <span className="u-label text-faint">tool-calls</span>
                <ToolRail reduce={!!reduce} />
              </div>
              {/* lathe */}
              <div className="relative min-h-[300px] p-2 sm:min-h-[360px]">
                <ParametricRevolveLathe
                  variant="hero"
                  startDelay={0.5}
                  className="text-ink"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Compact, token-coloured tool-call rail — stamps once, then holds. */
function ToolRail({ reduce }: { reduce: boolean }) {
  const parent = reduce
    ? ({ initial: false as const, animate: "show" })
    : ({ initial: "hidden", animate: "show" });

  return (
    <motion.ul
      className="relative mt-3 flex flex-col gap-2.5"
      variants={stagger(0.12, 0.7)}
      {...parent}
    >
      <span
        className="absolute left-[2.5px] top-1.5 bottom-1.5 w-px bg-line-strong"
        aria-hidden
      />
      {RAIL.map((c) => {
        const healed = c.status === "healed";
        return (
          <motion.li
            key={c.verb}
            variants={riseIn}
            className="relative flex items-baseline gap-2.5 pl-5"
          >
            <span
              className={cn(
                "absolute left-[2.5px] top-[0.45em] h-[6px] w-[6px] -translate-x-1/2 rounded-full",
                healed ? "bg-faint" : "bg-ink",
              )}
              aria-hidden
            />
            <span className="u-spec min-w-0 flex-1 truncate text-[11px] text-ink-soft">
              {c.verb}
            </span>
            <span
              className={cn(
                "shrink-0 font-mono text-[10px]",
                healed ? "text-faint" : "text-ink",
              )}
            >
              {healed ? "± healed" : "✓"}
            </span>
          </motion.li>
        );
      })}
      <li className="mt-1 flex items-center gap-1.5 border-t border-line pt-3 pl-0.5">
        <span className="font-mono text-[11px] text-ink">✓</span>
        <span className="u-spec text-[11px] text-muted">valid · editable tree</span>
      </li>
    </motion.ul>
  );
}
