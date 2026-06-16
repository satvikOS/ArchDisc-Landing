import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { ToolCallLedger, type ToolCall } from "@/components/artifacts/ToolCallLedger";

const DECK =
  "The copilot that builds manufacturable solids in Forge also sculpts, shades, and stages scenes in Studio — through the same structured, readable tool-calls into the real engine.";

const ROWS: { label: string; body: string }[] = [
  {
    label: "VALIDATED TOOL-CALLS",
    body: "Archie emits the exact operations the engine runs — sculpt, retopo, shade, place, light, frame — ordered and inspectable, never a black box.",
  },
  {
    label: "COHERENCE GATE",
    body: "Every result is checked before you see it; if a step is off, the gate repairs it.",
  },
  {
    label: "EDITABLE FEATURE TREE",
    body: "What comes back isn't a disposable script — it's a live tree you can re-key, re-shade, and re-pose.",
  },
];

const CALLS: ToolCall[] = [
  { verb: "sculpt.dyntopo", args: "detail=high", status: "ok" },
  { verb: "retopo.auto", args: "target=quads", status: "healed" },
  { verb: "shade.assign", args: 'mat="ceramic"', status: "ok" },
  { verb: "scene.frame", args: "camera, 35mm", status: "ok" },
];

export function ArchieDrives() {
  return (
    <Section id="archie-drives" className="border-t border-line">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* copy */}
          <div>
            <Reveal>
              <span className="u-label inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden />
                ONE COPILOT, BOTH SURFACES
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance text-h2 font-display text-ink">
                Archie works in clay and light
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-pretty text-lead text-muted">{DECK}</p>
            </Reveal>

            <dl className="mt-8 flex flex-col">
              {ROWS.map((row, i) => (
                <Reveal key={row.label} delay={0.12 + i * 0.05}>
                  <div className="border-t border-line py-5 first:border-t-0 first:pt-0">
                    <dt className="u-label text-ink">{row.label}</dt>
                    <dd className="mt-2 text-body text-muted">{row.body}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={0.3}>
              <p className="mt-6 text-pretty text-body text-ink-soft">
                Drive it by voice or drive it by hand. Archie is a copilot, not a
                wall — every move lands in the normal Studio tools.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-7">
                <Button href="/archie" variant="ghost" size="sm" className="px-0">
                  Meet Archie
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* ledger */}
          <Reveal delay={0.1} y={24}>
            <ToolCallLedger
              variant="compact"
              trigger="view"
              prompt="Sculpt a smooth ceramic vase, retopo it, give it a soft glaze, then frame the shot."
              calls={CALLS}
              gateLabel="coherence gate · checkValidity() → valid"
              className="w-full"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
