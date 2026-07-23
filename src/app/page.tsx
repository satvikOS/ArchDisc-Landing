import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Declaration } from "@/components/landing/Declaration";
import { MarqueeBand } from "@/components/landing/MarqueeBand";
import { AnyoneCanBuild } from "@/components/landing/AnyoneCanBuild";
import { TheSystem } from "@/components/landing/TheSystem";
import { TwoApps } from "@/components/landing/TwoApps";
import { Closing } from "@/components/landing/Closing";

const TITLE = "ArchDisc — creative AI for the physical world";
const DESCRIPTION =
  "Describe an object in a sentence, and Archie builds it — real, manufacturable geometry verified against a native kernel. Free, local, private. Public release soon.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Declaration />
      <MarqueeBand />
      <AnyoneCanBuild />
      <TheSystem />
      <TwoApps />
      <Closing />
    </>
  );
}
