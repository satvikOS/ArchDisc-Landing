import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { Ticker } from "@/components/common/Ticker";
import { Pipeline } from "@/components/pages/home/Pipeline";
import { SystemsBento } from "@/components/pages/home/SystemsBento";
import { Closing } from "@/components/pages/home/Closing";

const META_TITLE = "ArchDisc — make anything real.";
const META_DESCRIPTION =
  "Real mechanical design from a single sentence — raw model, sketch, render, and manufacturable blueprint. Built for everyone who could picture it but never had years of CAD. Free to use, local, private. Coming soon.";

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
      <div className="grade-steel">
        <Pipeline />
      </div>
      <div className="grade-violet">
        <SystemsBento />
      </div>
      <div className="grade-cyan">
        <Closing />
      </div>
    </>
  );
}
