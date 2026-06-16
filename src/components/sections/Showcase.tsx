import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { showcase } from "@/lib/content";
import { cn } from "@/lib/utils";

type Kind = "facility" | "sculpt" | "assembly" | "pattern" | "sim" | "drawing";

const svg = {
  fill: "none" as const,
  "aria-hidden": true as const,
  className: "h-full w-full",
};

function Scene({ kind }: { kind: Kind }) {
  if (kind === "facility") {
    const cells: { x: number; y: number }[] = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 13; c++)
        cells.push({ x: 16 + c * 21 + (c >= 7 ? 12 : 0), y: 22 + r * 34 });
    return (
      <svg {...svg} viewBox="0 0 320 170" preserveAspectRatio="xMidYMid meet">
        <g stroke="currentColor" strokeWidth={1} opacity={0.7}>
          {cells.map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width={15} height={22} rx={0.5} />
          ))}
          <line x1={159} y1={14} x2={159} y2={156} strokeDasharray="2 4" opacity={0.5} />
        </g>
      </svg>
    );
  }
  if (kind === "sculpt") {
    return (
      <svg {...svg} viewBox="0 0 160 190" preserveAspectRatio="xMidYMid meet">
        <g stroke="currentColor" strokeWidth={1.25} opacity={0.75}>
          <path d="M52 44 C40 86 40 130 60 168 L100 168 C120 130 120 86 108 44" strokeLinejoin="round" />
          <ellipse cx={80} cy={44} rx={28} ry={8} />
          <ellipse cx={80} cy={44} rx={20} ry={5} opacity={0.6} />
          <ellipse cx={80} cy={96} rx={34} ry={9} opacity={0.4} />
          <ellipse cx={80} cy={168} rx={20} ry={6} opacity={0.6} />
        </g>
      </svg>
    );
  }
  if (kind === "assembly") {
    return (
      <svg {...svg} viewBox="0 0 220 150" preserveAspectRatio="xMidYMid meet">
        <g stroke="currentColor" strokeWidth={1.1} opacity={0.75}>
          <ellipse cx={40} cy={75} rx={14} ry={40} />
          <rect x={166} y={45} width={44} height={60} rx={2} />
          <path d="M40 35 C100 30 140 40 166 45" />
          <path d="M40 115 C100 120 140 110 166 105" />
          {Array.from({ length: 7 }, (_, i) => (
            <line
              key={i}
              x1={60 + i * 16}
              y1={42 + i * 1.5}
              x2={60 + i * 16}
              y2={108 - i * 1.5}
              opacity={0.28}
            />
          ))}
        </g>
      </svg>
    );
  }
  if (kind === "pattern") {
    const teeth = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
    return (
      <svg {...svg} viewBox="0 0 180 180" preserveAspectRatio="xMidYMid meet">
        <g stroke="currentColor" strokeWidth={1.1} opacity={0.75}>
          <circle cx={90} cy={90} r={70} />
          <circle cx={90} cy={90} r={60} opacity={0.5} />
          <circle cx={90} cy={90} r={22} />
          {teeth.map((a, i) => (
            <line
              key={i}
              x1={90 + Math.cos(a) * 60}
              y1={90 + Math.sin(a) * 60}
              x2={90 + Math.cos(a) * 70}
              y2={90 + Math.sin(a) * 70}
            />
          ))}
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={90 + Math.cos(a) * 42}
                cy={90 + Math.sin(a) * 42}
                r={12}
                opacity={0.6}
              />
            );
          })}
        </g>
      </svg>
    );
  }
  if (kind === "sim") {
    const bands = [0.12, 0.22, 0.36, 0.54, 0.74, 0.92];
    return (
      <svg {...svg} viewBox="0 0 200 150" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="bracketClip">
            <path d="M28 22 H70 V92 H160 V128 H28 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#bracketClip)">
          {bands.map((v, i) => (
            <rect
              key={i}
              x={28}
              y={22 + i * 18}
              width={140}
              height={18}
              fill="currentColor"
              opacity={v * 0.85}
            />
          ))}
        </g>
        <path
          d="M28 22 H70 V92 H160 V128 H28 Z"
          stroke="currentColor"
          strokeWidth={1.25}
          opacity={0.8}
        />
        <g opacity={0.55} stroke="currentColor" strokeWidth={1}>
          <rect x={170} y={22} width={8} height={106} />
        </g>
      </svg>
    );
  }
  // drawing — GD&T sheet
  return (
    <svg {...svg} viewBox="0 0 240 170" preserveAspectRatio="xMidYMid meet">
      <g stroke="currentColor" strokeWidth={1} opacity={0.75}>
        <rect x={10} y={10} width={220} height={150} />
        <rect x={40} y={42} width={90} height={64} rx={2} />
        <circle cx={85} cy={74} r={12} />
        <line x1={40} y1={30} x2={130} y2={30} opacity={0.6} />
        <line x1={40} y1={26} x2={40} y2={34} opacity={0.6} />
        <line x1={130} y1={26} x2={130} y2={34} opacity={0.6} />
        {/* feature control frame */}
        <g transform="translate(150 46)">
          <rect x={0} y={0} width={62} height={16} />
          <line x1={16} y1={0} x2={16} y2={16} />
          <line x1={40} y1={0} x2={40} y2={16} />
        </g>
        {/* title block */}
        <g opacity={0.7}>
          <rect x={150} y={120} width={80} height={40} />
          <line x1={150} y1={133} x2={230} y2={133} />
          <line x1={150} y1={146} x2={230} y2={146} />
          <line x1={190} y1={120} x2={190} y2={160} />
        </g>
      </g>
    </svg>
  );
}

export function Showcase() {
  return (
    <Section className="relative border-t border-line">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{showcase.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-h2 font-semibold text-ink">
              {showcase.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-[17px] leading-relaxed text-muted">
              {showcase.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[210px] grid-cols-2 gap-4 md:grid-cols-3">
          {showcase.tiles.map((tile, i) => (
            <Reveal
              key={tile.id}
              delay={(i % 3) * 0.06}
              className={cn(
                tile.feature && "col-span-2 row-span-2",
              )}
            >
              <figure className="group relative h-full overflow-hidden rounded-[2px] border border-line bg-surface transition-colors duration-200 hover:border-ink/30">
                <div className="absolute inset-0 flex items-center justify-center p-6 text-ink/70">
                  <Scene kind={tile.kind} />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-2 border-t border-line bg-surface/85 px-3 py-2 backdrop-blur-sm">
                  <span className="font-mono text-[11px] text-ink">
                    &ldquo;{tile.prompt}&rdquo;
                  </span>
                  <span className="font-mono text-[10px] text-faint">
                    {tile.output}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center font-mono text-[12px] text-muted">
            {showcase.caption}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
