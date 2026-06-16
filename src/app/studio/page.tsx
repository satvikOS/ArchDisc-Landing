import type { Metadata } from "next";
import { StudioHero } from "@/components/pages/studio/StudioHero";
import { Capabilities } from "@/components/pages/studio/Capabilities";
import { SculptToShade } from "@/components/pages/studio/SculptToShade";
import { FurnitureComposer } from "@/components/pages/studio/FurnitureComposer";
import { RenderInValue } from "@/components/pages/studio/RenderInValue";
import { ArchieDrives } from "@/components/pages/studio/ArchieDrives";
import { OpenSourceStrip } from "@/components/common/OpenSourceStrip";
import { FinalCta } from "@/components/common/FinalCta";

const META_TITLE = "Studio — 3D creation, driven by Archie";
const META_DESCRIPTION =
  "Studio is ArchDisc's 3D content-creation surface: modeling, sculpting, UV, shading, rigging, animation, VFX, simulation, a game engine, and a GPU path tracer — Blender/Maya/Houdini-class breadth, with a parametric furniture library and scene composer. Describe a scene; Archie composes, lights, and frames it. Open source, local-first, public release soon.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/studio",
  },
  twitter: {
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

export default function StudioPage() {
  return (
    <>
      <StudioHero />
      <Capabilities />
      <SculptToShade />
      <FurnitureComposer />
      <RenderInValue />
      <ArchieDrives />
      <OpenSourceStrip />
      <FinalCta
        eyebrow="Open the studio"
        headline="Describe a scene. Watch it take shape."
        subhead="Model, sculpt, animate, and render — Blender/Maya/Houdini-class breadth in one app, driven by Archie. Open source, on your machine."
      />
    </>
  );
}
