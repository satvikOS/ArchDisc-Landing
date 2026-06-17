import type { Metadata } from "next";

import { PrecisionHero } from "@/components/pages/precision/PrecisionHero";
import { Thesis } from "@/components/pages/precision/Thesis";
import { Kernel } from "@/components/pages/precision/Kernel";
import { Math as MathProof } from "@/components/pages/precision/Math";
import { Scale } from "@/components/pages/precision/Scale";
import { Export } from "@/components/pages/precision/Export";
import { Verify } from "@/components/pages/precision/Verify";
import { FreeToUseStrip } from "@/components/common/FreeToUseStrip";
import { FinalCta } from "@/components/common/FinalCta";

const META_TITLE = "Precision — AI-native doesn't mean approximate";
const META_DESCRIPTION =
  "ArchDisc geometry runs on a native OpenCASCADE 7.9.3 kernel compiled from source — real B-rep solids and NURBS, the full FEA set, assemblies past 100,000 components, and manufacturable STEP/IGES/DXF export. AI-native, never approximate. Free to use, local, private, public release soon.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/precision",
  },
};

export default function PrecisionPage() {
  return (
    <>
      <PrecisionHero />
      <Thesis />
      <Kernel />
      <MathProof />
      <Scale />
      <Export />
      <Verify />
      <FreeToUseStrip />
      <FinalCta
        eyebrow="Take none of it on faith"
        headline="See the geometry for yourself."
        subhead="A native CAD kernel, real B-rep solids, real FEA — built and maintained by us, free for you to use. AI-native, never approximate."
      />
    </>
  );
}
