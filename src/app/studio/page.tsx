import type { Metadata } from "next";
import { Dossier } from "@/components/pages/dossier/Dossier";
import { DOSSIERS } from "@/lib/dossiers";

const d = DOSSIERS.studio;

export const metadata: Metadata = {
  title: d.metaTitle,
  description: d.metaDescription,
  alternates: { canonical: "/studio" },
  openGraph: { title: d.metaTitle, description: d.metaDescription, url: "/studio" },
  twitter: { title: d.metaTitle, description: d.metaDescription },
};

export default function StudioPage() {
  return <Dossier d={d} />;
}
