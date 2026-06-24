import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { Ticker } from "@/components/common/Ticker";
import { SystemsBento } from "@/components/pages/home/SystemsBento";
import { Statement } from "@/components/pages/home/Statement";
import { OpeningNight } from "@/components/pages/home/OpeningNight";
import { Admission } from "@/components/common/Admission";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { LockedProbe } from "@/components/common/LockedProbe";

const META_TITLE = "ArchDisc — describe it, it gets built. Three systems, opening soon.";
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
      <SystemsBento />

      {/* The interactive exhibit */}
      <section className="border-t border-ink/10 py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-10 px-5 md:grid-cols-[40fr_60fr] md:px-10">
          <div>
            <Reveal>
              <Chip tone="coral">The interactive exhibit</Chip>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-[14ch] text-balance text-h1 text-ink">
                Touch this one. It builds for real.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[44ch] text-pretty text-lead text-muted">
                Describe a part and watch Archie work the kernel — every line is a real
                operation. The finished piece just stays a preview until opening.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={24}>
            <LockedProbe />
          </Reveal>
        </div>
      </section>

      <Statement />
      <OpeningNight />
      <Admission />
    </>
  );
}
