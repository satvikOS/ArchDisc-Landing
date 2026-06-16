import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Pillars } from "@/components/sections/Pillars";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PrecisionProof } from "@/components/sections/PrecisionProof";
import { Showcase } from "@/components/sections/Showcase";
import { SpecsFaq } from "@/components/sections/SpecsFaq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Pillars />
      <HowItWorks />
      <PrecisionProof />
      <Showcase />
      <SpecsFaq />
      <FinalCta />
    </>
  );
}
