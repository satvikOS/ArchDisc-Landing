import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/pages/legal/LegalPage";

const TITLE = "Privacy";
const DESCRIPTION =
  "ArchDisc is pre-release. This website collects nothing about you, and the products are built to run entirely on your own machine.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const SECTIONS: LegalSection[] = [
  {
    h: "What this site collects",
    p: [
      "Right now, nothing. There is no signup form, no email capture, and no account on this site. Browsing these pages doesn't send us personal information about you.",
    ],
  },
  {
    h: "Cookies and analytics",
    p: [
      "This site sets no tracking cookies and runs no third-party analytics. There is nothing here following you around.",
    ],
  },
  {
    h: "What the products collect",
    p: [
      "Nothing leaves your machine. Forge, Studio and Archie are built to run locally — your geometry, prompts and files stay with you. We don't receive them.",
    ],
  },
  {
    h: "Server logs",
    p: [
      "Like any website, our host may keep standard, short-lived request logs (such as an IP address and browser type) to keep the site running and secure. We don't use them to build a profile of you.",
    ],
  },
  {
    h: "If that ever changes",
    p: [
      "If we add something that collects information — for example, an optional email list closer to launch — we'll update this page and tell you exactly what we take, and why, before you give it.",
    ],
  },
  {
    h: "Contact",
    p: ["Questions about any of this: hello@archdisc.com."],
  },
];

export default function PrivacyPage() {
  return (
    <div className="grade-slate">
      <LegalPage
        kicker="Legal · privacy"
        title="Privacy"
        updated="2026.06.24"
        intro="ArchDisc is pre-release. The short version: this website doesn't collect anything about you, and the products are built to run entirely on your own machine."
        sections={SECTIONS}
      />
    </div>
  );
}
