"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EASE } from "@/lib/motion";

const ROWS: { k: string; v: string }[] = [
  { k: "Kernel", v: "OpenCASCADE 7.9.3, compiled from source — native C++, no WASM (forge-kernel.node)." },
  { k: "Solids", v: "B-rep, NURBS surfacing, sweeps, lofts, drafts, variable fillets." },
  { k: "Sketching", v: "planegcs constraint solver with full DOF tracking." },
  { k: "Assemblies", v: "Up to 100,000+ components, real mates, live spatial queries." },
  { k: "Simulation", v: "Linear-static, modal, thermal, buckling, fatigue — with contact." },
  { k: "Manufacturing", v: "CAM toolpaths + associative drawings with full GD&T." },
  { k: "Interop", v: "STEP, IGES, DXF, glTF, STL — read and write." },
  { k: "AI", v: "Local DeepSeek-R1-distilled fleet, per-discipline fine-tunes, structured tool-calls." },
  { k: "License", v: "Open source — open code and open model weights." },
  { k: "Runs on", v: "Native Apple Silicon desktop app; Windows in progress." },
  { k: "Cost", v: "Free forever to open; public release soon." },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is this real CAD or text-to-CAD that spits out a script?",
    a: "Real CAD. Forge is a from-source OpenCASCADE kernel with a constraint solver, FEA, CAM, and drawings. Archie drives it through validated tool-calls and hands back an editable feature tree — you can also drive every operation by hand.",
  },
  {
    q: "Will my models open in SolidWorks, NX, Creo, or Fusion?",
    a: "Yes. Forge reads and writes native STEP, IGES, and DXF, so models move both directions without a lossy re-import. The B-rep export is a true solid, not a mesh.",
  },
  {
    q: "Is the simulation real or an estimate?",
    a: "Real FEA on real meshes — linear-static, modal, thermal, buckling, and fatigue, with contact — run on the solids you designed.",
  },
  {
    q: "How big can an assembly get?",
    a: "Past 100,000 components, organized into zoned structure with real mates and live spatial queries — it stays selectable and responsive instead of collapsing into noise.",
  },
  {
    q: "Do my designs or prompts leave my machine?",
    a: "No. The model fleet runs on-device. Your geometry and your words stay on your hardware — private by default, fast because there is no round-trip.",
  },
  {
    q: "Is it really open source?",
    a: "Yes — open code and open model weights. Inspect the kernel binding, self-host the copilot, and fork it. No lock-in.",
  },
  {
    q: "Can I drive Forge without Archie?",
    a: "Yes. Archie is a copilot, not a wall. Sketches, features, assemblies, FEA, and drawings are all there as normal tools — use them by hand any time.",
  },
  {
    q: "What does it cost?",
    a: "Free forever to open and explore. ArchDisc is in pre-release; a public release is coming soon.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <div>
      {FAQ.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-line first:border-t">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 rounded-[2px] py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <span className="text-h4 font-medium text-ink">{it.q}</span>
              <span className="font-mono text-lg leading-none text-muted">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-body leading-relaxed text-muted">
                    {it.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function ForgeSpecsFaq() {
  return (
    <Section id="specs-faq" className="border-t border-line bg-surface">
      <Container>
        <SectionHeader
          eyebrow="FOR PEOPLE WHO READ THE SPEC SHEET"
          title="The questions a serious team asks."
        />

        <div className="mt-12 grid gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
          <dl className="h-fit">
            {ROWS.map((r) => (
              <div
                key={r.k}
                className="grid grid-cols-[7rem_1fr] gap-3 border-b border-line py-3 first:border-t"
              >
                <dt className="u-label text-faint">{r.k}</dt>
                <dd className="text-body-sm leading-relaxed text-ink-soft">
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>

          <Faq />
        </div>
      </Container>
    </Section>
  );
}
