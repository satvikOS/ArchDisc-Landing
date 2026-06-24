import type { Metadata } from "next";
import { Dossier } from "@/components/pages/dossier/Dossier";
import { DOSSIERS } from "@/lib/dossiers";

const d = DOSSIERS.archie;

export const metadata: Metadata = {
  title: d.metaTitle,
  description: d.metaDescription,
  alternates: { canonical: "/archie" },
  openGraph: { title: d.metaTitle, description: d.metaDescription, url: "/archie" },
  twitter: { title: d.metaTitle, description: d.metaDescription },
};

export default function ArchiePage() {
  return <Dossier d={d} />;
}
