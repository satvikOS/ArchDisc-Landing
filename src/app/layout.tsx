import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/visual/Grain";
import { InstrumentProvider } from "@/lib/instrument";

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

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const TITLE = "ArchDisc — make anything real";
const DESCRIPTION =
  "Real mechanical design from a single sentence — raw model, sketch, render, and manufacturable blueprint. Forge for CAD, Studio for 3D creation, and Archie, the local model that builds in both. Free to use, local, private. Coming soon.";

export const metadata: Metadata = {
  metadataBase: new URL("https://archdisc.com"),
  title: {
    default: TITLE,
    template: "%s · ArchDisc",
  },
  description: DESCRIPTION,
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
    "parametric design",
    "coming soon",
  ],
  authors: [{ name: "ArchDisc" }],
  openGraph: {
    type: "website",
    siteName: "ArchDisc",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#090c14",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-dvh bg-paper text-ink-soft antialiased">
        <InstrumentProvider>
          <Grain />
          <Nav />
          <main>{children}</main>
          <Footer />
        </InstrumentProvider>
      </body>
    </html>
  );
}
