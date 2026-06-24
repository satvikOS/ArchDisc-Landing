import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { Ticker } from "@/components/common/Ticker";
import { SystemsBento } from "@/components/pages/home/SystemsBento";
import { Statement } from "@/components/pages/home/Statement";
import { Pricing } from "@/components/pages/home/Pricing";
import { Admission } from "@/components/common/Admission";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion/Reveal";
import { LockedProbe } from "@/components/common/LockedProbe";

const META_TITLE = "ArchDisc — describe it, Archie builds it.";
const META_DESCRIPTION =
  "Two apps, one model. Studio for 3D creation, Forge for mechanical CAD, and Archie — the AI that builds in both. You say what you want; it plans and builds, locally and privately. Free to use. Public release soon.";

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
      <Statement />

      {/* Watch it build */}
      <section id="watch" className="scroll-mt-24 border-t border-line py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-10 px-5 md:grid-cols-[40fr_60fr] md:px-10">
          <div>
            <Reveal>
              <Chip tone="coral">Watch it build</Chip>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-[14ch] text-balance text-h1 text-ink">
                Don&rsquo;t take our word.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[44ch] text-pretty text-lead text-muted">
                Describe a part and watch Archie work the kernel — every line is a real
                operation on a real solid. This is a preview; the full thing opens soon.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={24}>
            <LockedProbe />
          </Reveal>
        </div>
      </section>

      <Pricing />
      <Admission />
    </>
  );
}
