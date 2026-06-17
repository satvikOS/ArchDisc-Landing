import type { Metadata } from "next";
import { ForgeHero } from "@/components/pages/forge/ForgeHero";
import { ForgeTrustStrip } from "@/components/pages/forge/ForgeTrustStrip";
import { ForgeKernel } from "@/components/pages/forge/ForgeKernel";
import { ForgeSketcher } from "@/components/pages/forge/ForgeSketcher";
import { ForgeAssemblies } from "@/components/pages/forge/ForgeAssemblies";
import { ForgeSimulation } from "@/components/pages/forge/ForgeSimulation";
import { ForgeCamDrawings } from "@/components/pages/forge/ForgeCamDrawings";
import { ForgeInterop } from "@/components/pages/forge/ForgeInterop";
import { ForgeArchie } from "@/components/pages/forge/ForgeArchie";
import { ForgeSpecsFaq } from "@/components/pages/forge/ForgeSpecsFaq";
import { FreeToUseStrip } from "@/components/common/FreeToUseStrip";
import { FinalCta } from "@/components/common/FinalCta";

const META_TITLE = "Forge — Native parametric CAD, driven by Archie";
const META_DESCRIPTION =
  "Forge is mechanical CAD on a from-source OpenCASCADE 7.9.3 kernel — no WASM. Parametric sketching with the planegcs solver, assemblies past 100,000 components, FEA, CAM, GD&T drawings, and STEP/IGES/DXF interop. Free to use, local, private, driven by Archie. Public release soon.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/forge",
  },
  twitter: {
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

export default function ForgePage() {
  return (
    <>
      <ForgeHero />
      <ForgeTrustStrip />
      <ForgeKernel />
      <ForgeSketcher />
      <ForgeAssemblies />
      <ForgeSimulation />
      <ForgeCamDrawings />
      <ForgeInterop />
      <ForgeArchie />
      <FreeToUseStrip />
      <ForgeSpecsFaq />
      <FinalCta
        eyebrow="Build something real"
        headline="Solids that are made to be made."
        subhead="A from-source OpenCASCADE kernel, a real constraint solver, FEA, and drawings — all driven by Archie. Free to use, local, private."
      />
    </>
  );
}
