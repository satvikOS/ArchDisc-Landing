import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/pages/legal/LegalPage";

const TITLE = "Privacy";
const DESCRIPTION =
  "What this site collects (only your clearance request) and what the products collect (nothing — they run locally). Plainly stated.";

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
      "If you request clearance, we receive the email you enter, plus anything optional you add — a name, what you build, and which system interests you most.",
      "Our server also sees the standard request metadata any web server sees: your IP address and browser user-agent. We use these only to prevent abuse of the form.",
    ],
  },
  {
    h: "What we do with it",
    p: [
      "We hold your email so we can send a single message when ArchDisc opens. We don't sell it, rent it, or hand it to advertisers.",
      "If we route submissions through an operational relay (for example, to reach our own inbox), the same details pass to that relay and nowhere else.",
    ],
  },
  {
    h: "What the products collect",
    p: [
      "Nothing leaves your machine. Forge, Studio and Archie are built to run locally. Your geometry, prompts and files stay with you — we don't receive them.",
    ],
  },
  {
    h: "Cookies and analytics",
    p: [
      "This site does not set tracking cookies and does not run third-party analytics. There's nothing here following you around.",
    ],
  },
  {
    h: "Removing your details",
    p: [
      "Want off the list? Email us and we'll delete your entry. No hoops.",
    ],
  },
  {
    h: "Changes and contact",
    p: [
      "If any of this changes before launch, we'll update this page and change the date at the top.",
      "Questions: hello@archdisc.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      kicker="Legal · privacy"
      title="Privacy"
      updated="2026.06.23"
      intro="ArchDisc is pre-release. This page covers the only place we currently collect anything: the clearance form on this website. The products themselves run locally and don't send your work anywhere."
      sections={SECTIONS}
    />
  );
}
