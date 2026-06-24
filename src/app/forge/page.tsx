import type { Metadata } from "next";
import { Dossier } from "@/components/pages/dossier/Dossier";
import { DOSSIERS } from "@/lib/dossiers";

const d = DOSSIERS.forge;

export const metadata: Metadata = {
  title: d.metaTitle,
  description: d.metaDescription,
  alternates: { canonical: "/forge" },
  openGraph: { title: d.metaTitle, description: d.metaDescription, url: "/forge" },
  twitter: { title: d.metaTitle, description: d.metaDescription },
};

export default function ForgePage() {
  return <Dossier d={d} />;
}
