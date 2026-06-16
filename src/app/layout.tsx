import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/visual/Grain";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://archdisc.com"),
  title: {
    default: "ArchDisc — Design, engineered.",
    template: "%s · ArchDisc",
  },
  description:
    "One platform for 3D creation and mechanical CAD, driven by Archie — an AI copilot that turns plain language into precise, manufacturable geometry. Runs on a native CAD kernel and a local model fleet.",
  applicationName: "ArchDisc",
  keywords: [
    "ArchDisc",
    "AI CAD",
    "generative design",
    "mechanical CAD",
    "3D modeling",
    "Archie",
    "Studio",
    "Forge",
    "OpenCASCADE",
    "parametric design",
  ],
  authors: [{ name: "ArchDisc" }],
  openGraph: {
    type: "website",
    siteName: "ArchDisc",
    title: "ArchDisc — Design, engineered.",
    description:
      "Describe it. Archie builds it — as precise, manufacturable geometry. One platform for 3D creation and mechanical CAD.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchDisc — Design, engineered.",
    description:
      "Describe it. Archie builds it. One platform for 3D creation and mechanical CAD.",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh bg-paper text-ink-soft antialiased">
        <Grain />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
