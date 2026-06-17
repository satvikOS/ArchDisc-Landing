"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { RasterInspection } from "@/components/instrument/RasterInspection";
import { stagger, riseIn } from "@/lib/motion";
import { APP_URL } from "@/lib/site";

const HEADLINE = "AI-native doesn't mean approximate.";

const SPEC_CHIPS = ["OCCT 7.9.3", "native B-rep", "no WASM", "free to use"];

export function PrecisionHero() {
  const reduce = useReducedMotion();
  const init = reduce ? false : "hidden";
  const words = HEADLINE.split(" ");

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-ink py-24 text-paper md:py-28">
      {/* dark drafting-plane substrate */}
      <GenerativeGrid dark majorPitch={132} crosshair annotations />

      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* ── copy column ─────────────────────────────────────────── */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <Reveal>
            <span className="u-label inline-flex items-center gap-2 text-white/55">
              <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
              PRECISION · WHY THE GEOMETRY IS TRUSTWORTHY
            </span>
          </Reveal>

          <motion.h1
            className="mt-5 max-w-[16ch] text-balance text-display font-display text-white"
            variants={stagger(0.045, 0.06)}
            initial={init}
            animate="show"
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                variants={riseIn}
                className="mr-[0.24em] inline-block"
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[52ch] text-pretty text-lead text-white/65">
              The copilot is the magic. The substance underneath is a real
              engineering stack — a native CAD kernel compiled from source, true
              B-rep solids, real NURBS, and real FEA on the parts you actually
              design. We build and maintain every layer — the kernel, the math,
              and the on-device model fleet — and it's free for you to use.
            </p>
          </Reveal>

          {/* spec chips — instrument-readout tone. When reduced motion
              resolves, `animate` drives the resting frame immediately,
              independent of scroll; otherwise the stagger plays on scroll-in. */}
          <motion.ul
            className="mt-7 flex flex-wrap gap-2"
            variants={stagger(0.07, 0.2)}
            initial="hidden"
            animate={reduce ? "show" : undefined}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            transition={reduce ? { duration: 0 } : undefined}
            aria-label="Kernel specifications"
          >
            {SPEC_CHIPS.map((chip) => (
              <motion.li
                key={chip}
                variants={riseIn}
                className="u-spec rounded-[2px] border border-white/12 bg-white/[0.03] px-2.5 py-1 text-white/70"
              >
                {chip}
              </motion.li>
            ))}
          </motion.ul>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button href={APP_URL} size="lg">
                Open ArchDisc
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button
                href="#kernel"
                size="lg"
                variant="secondary"
                className="border-white/20 bg-transparent text-paper hover:border-white/45 hover:bg-white/[0.04] focus-visible:ring-white/30 focus-visible:ring-offset-ink"
              >
                Inspect the kernel
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="u-spec mt-6 text-white/40">
              Free to use · local & private · public release soon
            </p>
          </Reveal>
        </div>

        {/* ── signature artifact column — RASTER INSPECTION ──────────
            A measuring light-line rasters across the focal part on
            scroll-seat and leaves a 1-bit Bayer-dither value-map as it
            passes, as if the instrument is digitizing the surface line by
            line. The dark inspection table gets one radial backlight
            value-lift behind the part (light-table backlight, ≤10% white,
            never a colored glow); the anodized-plate frame keeps the house
            2px radius + hairline border. Reduced motion → the complete
            digitized portrait at rest, no sweep. */}
        <div className="order-1 lg:order-2 lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-[2px] border border-white/12 bg-white/[0.02]">
            {/* light-table backlight — pure white → transparent radial lift */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 55% at 50% 46%, rgba(255,255,255,0.09), rgba(255,255,255,0) 72%)",
              }}
            />
            <RasterInspection
              scrub="play"
              dark
              className="absolute inset-0 h-full w-full p-7"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
