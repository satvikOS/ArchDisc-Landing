import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import {
  IsometricExploded,
  FacilitySwarm,
  type Part,
} from "@/components/artifacts/IsometricExploded";
import { DitherPortrait } from "@/components/artifacts/DitherPortrait";
import { StressFieldHalftone } from "@/components/artifacts/StressFieldHalftone";
import { DimensionedDetail } from "@/components/artifacts/DimensionedDetail";
import { cn } from "@/lib/utils";

/** A stacked iso "gear ring" — short cylindrical parts read as a parametric pattern. */
const GEAR_PARTS: Part[] = [
  { sx: 78, sy: 12, sz: 78, lift: 0, tag: "1", bom: "ring gear · z=12", shape: "flange" },
  { sx: 44, sy: 16, sz: 44, lift: 60, tag: "2", bom: "planet carrier", shape: "boss" },
  { sx: 24, sy: 20, sz: 24, lift: 120, tag: "3", bom: "sun gear", shape: "boss" },
];

type Tile = {
  id: string;
  header: string;
  prompt: string;
  tag: string;
  art: ReactNode;
  feature?: boolean;
};

const TILES: Tile[] = [
  {
    id: "facility",
    header: "forge · facility",
    prompt: "A zoned pallet warehouse, 100k-part scale.",
    tag: "Forge · zoned assembly",
    feature: true,
    art: <FacilitySwarm className="h-full w-full text-ink" />,
  },
  {
    id: "sculpt",
    header: "studio · sculpt",
    prompt: "A 60 mm shelled vase, filleted rim.",
    tag: "Studio · wireframe-over-clay",
    art: (
      <DitherPortrait
        variant="tile"
        tag="subdiv · L2 · retopo"
        className="h-full w-full"
      />
    ),
  },
  {
    id: "assembly",
    header: "forge · assembly",
    prompt: "An S-duct transition, circular to rectangular.",
    tag: "Forge · sectioned w/ hatching",
    art: <IsometricExploded className="h-full w-full text-ink" />,
  },
  {
    id: "pattern",
    header: "forge · pattern",
    prompt: "A planetary gear ring, 12 teeth.",
    tag: "Forge · parametric pattern",
    art: <IsometricExploded parts={GEAR_PARTS} className="h-full w-full text-ink" />,
  },
  {
    id: "sim",
    header: "fea · stress",
    prompt: "Bracket under load.",
    tag: "FEA · greyscale von Mises",
    art: <StressFieldHalftone className="absolute inset-0 h-full w-full text-ink" />,
  },
  {
    id: "drawing",
    header: "forge · drawing",
    prompt: "GD&T sheet for the bracket.",
    tag: "Forge · title block + FCF",
    art: <DimensionedDetail variant="inline" className="h-full w-full text-ink" />,
  },
];

function TileCard({ tile }: { tile: Tile }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-surface",
        tile.feature && "md:col-span-2",
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="u-label">{tile.header}</span>
        <span className="u-label text-faint">made with archie</span>
      </div>
      <div
        className={cn(
          "relative flex-1",
          tile.feature ? "min-h-[300px]" : "min-h-[240px]",
        )}
      >
        {tile.art}
      </div>
      <div className="border-t border-line px-4 py-3">
        <p className="u-spec truncate text-ink-soft">{`› ${tile.prompt}`}</p>
        <p className="u-label mt-1.5 text-faint">{tile.tag}</p>
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <Section id="showcase" className="border-t border-line">
      <Container>
        <SectionHeader
          eyebrow="MADE WITH ARCHIE"
          title="One prompt each. No retouching."
          lead="Every frame below was driven by Archie and built by the kernel — then exported as STEP or glTF. No filters, no stock, just geometry."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal
              key={tile.id}
              delay={(i % 3) * 0.06}
              className={cn("h-full", tile.feature && "md:col-span-2")}
            >
              <TileCard tile={tile} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="u-spec mt-8 text-faint">
            Every frame above started as a sentence.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
