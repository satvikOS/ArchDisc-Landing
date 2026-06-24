import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/pages/legal/LegalPage";

const TITLE = "Terms";
const DESCRIPTION =
  "Short, plain terms for a pre-release site: the preview isn't a promise, your content stays yours, and ArchDisc is free to use when it opens.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/terms" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const SECTIONS: LegalSection[] = [
  {
    h: "What's here today",
    p: [
      "Right now ArchDisc is a preview. Nothing on this site is an offer of a finished product, a delivery date, or a guarantee that any described feature ships exactly as described.",
      "“Coming soon” is our honest intent, not a contract.",
    ],
  },
  {
    h: "Free to use",
    p: [
      "When ArchDisc opens, it's free to use. We build and maintain the technology; you make things with it.",
      "“Free to use” is exactly that — it isn't a transfer of ownership of the software or its underlying source.",
    ],
  },
  {
    h: "Your content",
    p: [
      "Anything you make in the products is yours. Because it stays on your machine, we don't claim it, store it, or license it from you.",
    ],
  },
  {
    h: "The brand",
    p: [
      "The ArchDisc name, the marks, and this site's design belong to ArchDisc. Please don't present them as your own.",
    ],
  },
  {
    h: "No warranties",
    p: [
      "This site and the preview are provided as-is, without warranties. We do our best, but a pre-release is a pre-release.",
    ],
  },
  {
    h: "Changes and contact",
    p: [
      "We may update these terms before launch; we'll date the page when we do. Questions: hello@archdisc.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="grade-steel">
      <LegalPage
        kicker="Legal · terms"
        title="Terms"
        updated="2026.06.24"
        intro="ArchDisc is pre-release and this website is informational. By using it you agree to the following, which we've kept short and plain."
        sections={SECTIONS}
      />
    </div>
  );
}
