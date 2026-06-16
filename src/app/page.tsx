import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { SubstanceStrip } from "@/components/pages/home/SubstanceStrip";
import { Pillars } from "@/components/pages/home/Pillars";
import { HowItWorks } from "@/components/pages/home/HowItWorks";
import { PrecisionProof } from "@/components/pages/home/PrecisionProof";
import { OpenSource } from "@/components/pages/home/OpenSource";
import { Showcase } from "@/components/pages/home/Showcase";
import { Explore } from "@/components/pages/home/Explore";
import { SpecsFaq } from "@/components/pages/home/SpecsFaq";
import { FinalCta } from "@/components/pages/home/FinalCta";

const META_TITLE =
  "ArchDisc — describe it, Archie builds it. Open-source AI design platform.";
const META_DESCRIPTION =
  "One open-source platform for 3D creation and mechanical CAD, driven by Archie — a local AI copilot that turns plain language into precise, manufacturable geometry on a native CAD kernel. Open code, open weights, self-hostable. Public release coming soon.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/",
  },
  twitter: {
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <SubstanceStrip />
      <Pillars />
      <HowItWorks />
      <PrecisionProof />
      <OpenSource />
      <Showcase />
      <Explore />
      <SpecsFaq />
      <FinalCta />
    </>
  );
}
