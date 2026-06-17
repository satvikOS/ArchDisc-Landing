import type { Metadata } from "next";
import { Hero } from "@/components/pages/archie/Hero";
import { LocalFleet } from "@/components/pages/archie/LocalFleet";
import { ToolCalls } from "@/components/pages/archie/ToolCalls";
import { CoherenceGate } from "@/components/pages/archie/CoherenceGate";
import { FeatureTree } from "@/components/pages/archie/FeatureTree";
import { DrivesBoth } from "@/components/pages/archie/DrivesBoth";
import { Faq } from "@/components/pages/archie/Faq";
import { FreeToUseStrip } from "@/components/common/FreeToUseStrip";
import { FinalCta } from "@/components/common/FinalCta";

const META_TITLE = "Archie — the local AI copilot for design";
const META_DESCRIPTION =
  "Archie is a local AI design copilot: an on-device, DeepSeek-R1-distilled model fleet that turns plain language into structured, validated tool-calls and hands back an editable feature tree. Free to use, local, private. Drives both Studio and Forge. No cloud, no API keys — your geometry never leaves the machine.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: "/archie" },
  openGraph: {
    type: "website",
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/archie",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

export default function ArchiePage() {
  return (
    <>
      <Hero />
      <LocalFleet />
      <ToolCalls />
      <CoherenceGate />
      <FeatureTree />
      <DrivesBoth />
      <FreeToUseStrip />
      <Faq />
      <FinalCta />
    </>
  );
}
