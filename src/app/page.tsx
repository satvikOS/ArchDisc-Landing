import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Declaration } from "@/components/landing/Declaration";
import { MarqueeBand } from "@/components/landing/MarqueeBand";
import { Benchmark } from "@/components/landing/Benchmark";
import { TheSystem } from "@/components/landing/TheSystem";
import { TwoApps } from "@/components/landing/TwoApps";
import { Closing } from "@/components/landing/Closing";

const TITLE = "ArchDisc — creative AI for the physical world";
const DESCRIPTION =
  "Describe an object in a sentence, and Archie builds it — real, manufacturable geometry verified against a native kernel. #2 on CADGenBench, #1 among local models. Local and private. Public release soon.";

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
      <Benchmark />
      <TheSystem />
      <TwoApps />
      {/* hard checkerboard divider */}
      <div className="checker-bg h-12 border-y-[2.5px] border-ink bg-lime md:h-14" aria-hidden />
      <Closing />
    </>
  );
}
