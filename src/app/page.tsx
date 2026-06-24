import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { Ticker } from "@/components/common/Ticker";
import { TheExhibition } from "@/components/pages/home/TheExhibition";
import { Statement } from "@/components/pages/home/Statement";
import { OpeningNight } from "@/components/pages/home/OpeningNight";
import { Admission } from "@/components/common/Admission";

const META_TITLE = "ArchDisc — a private viewing. Three systems, opening soon.";
const META_DESCRIPTION =
  "ArchDisc is one place to design and engineer with an AI at the center — Forge for real CAD, Studio for creation, and Archie, the model that turns plain language into precise, buildable geometry. None of it is public yet. Request clearance for the opening.";

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
      <Ticker />
      <TheExhibition />
      <Statement />
      <OpeningNight />
      <Admission />
    </>
  );
}
