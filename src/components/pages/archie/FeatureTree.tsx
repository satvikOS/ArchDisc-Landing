import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GenerativeGrid } from "@/components/artifacts/GenerativeGrid";
import { ParametricRevolveLathe } from "@/components/artifacts/ParametricRevolveLathe";

type TreeNode = {
  op: string;
  value: string;
  edited?: boolean;
  was?: string;
};

const NODES: TreeNode[] = [
  { op: "sketch", value: "rect 100×40" },
  { op: "extrude", value: "4 mm" },
  { op: "holes", value: "2×M6 @ 60" },
  { op: "fillet", value: "r3" },
  { op: "shell", value: "3 mm", edited: true, was: "4" },
];

export function FeatureTree() {
  return (
    <Section id="feature-tree" className="relative isolate">
      <GenerativeGrid />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* feature-tree glyph + re-solved confirmation */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <Reveal y={20}>
              <div className="rounded-[2px] border border-line-strong bg-surface p-6 md:p-7">
                <p className="u-label mb-5 text-faint">feature tree · live</p>
                <ol className="flex flex-col">
                  {NODES.map((n, i) => {
                    const last = i === NODES.length - 1;
                    return (
                      <li
                        key={n.op}
                        className="relative flex items-baseline gap-3 pl-6 pb-5 last:pb-0"
                      >
                        {/* construction spine + node */}
                        {!last && (
                          <span
                            aria-hidden
                            className="absolute left-[3px] top-3 bottom-0 w-px bg-line-strong"
                          />
                        )}
                        <span
                          aria-hidden
                          className="absolute left-[3px] top-[0.5em] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-ink"
                        />
                        <span className="shrink-0 font-mono text-[12px] font-medium text-ink">
                          {n.op}
                        </span>
                        <span className="font-mono text-[12px] text-faint">·</span>
                        {n.edited ? (
                          <span className="font-mono text-[12px] tabular-nums">
                            <span className="text-faint line-through decoration-faint">
                              {n.was}
                            </span>
                            <span className="px-1 text-faint">→</span>
                            <span className="text-ink">{n.value}</span>
                            <span className="ml-2 rounded-[2px] border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                              edited
                            </span>
                          </span>
                        ) : (
                          <span className="font-mono text-[12px] tabular-nums text-muted">
                            {n.value}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-5 flex items-center gap-2 rounded-[2px] border border-line px-3.5 py-2.5">
                  <span className="font-mono text-[12px] text-ink">✓</span>
                  <p className="font-mono text-[12px] text-ink">
                    re-solved locally · 0 cloud calls
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* copy */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <SectionHeader
              eyebrow="PARAMETRIC, NOT FROZEN"
              title="You get an editable feature tree — not a dead mesh."
              lead="Because every call is a real parametric operation, what Archie hands back is the part's living construction history. Open the tree, change the wall from 4 mm to 3 mm, and the kernel re-solves locally — no second prompt, no regenerate-and-pray. Archie built it the same way you would have, so you can keep building from where it stopped."
            />
            <Reveal delay={0.15}>
              <p className="u-spec mt-6 text-faint">
                Drive it by hand any time — every Archie call lands in the same
                feature tree and toolbars you&rsquo;d use yourself.
              </p>
            </Reveal>
          </div>
        </div>

        {/* the visual output of one such edited tree */}
        <Reveal delay={0.05} y={20}>
          <div className="mt-14 border-t border-line pt-12">
            <div className="mx-auto max-w-md">
              <ParametricRevolveLathe
                variant="inline"
                showDims
                className="h-auto w-full text-ink"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
