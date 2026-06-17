import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { Pillars } from "@/components/pages/home/Pillars";
import { HowItWorks } from "@/components/pages/home/HowItWorks";
import { FreeToUseStrip } from "@/components/common/FreeToUseStrip";
import { FinalCta } from "@/components/common/FinalCta";

const META_TITLE =
  "ArchDisc — describe it, Archie builds it. Free-to-use AI design platform.";
const META_DESCRIPTION =
  "One free-to-use platform for 3D creation and mechanical CAD, driven by Archie — a local AI copilot that turns plain language into precise, manufacturable geometry on a native CAD kernel. Free to use, local, private — we build and maintain the tech. Public release coming soon.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, url: "/" },
  twitter: { title: META_TITLE, description: META_DESCRIPTION },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Pillars />
      <HowItWorks />
      <FreeToUseStrip />
      <FinalCta />
    </>
  );
}
