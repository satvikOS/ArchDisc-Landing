import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/visual/Grain";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
// Body + display fonts preload (above the fold); mono + serif accents don't.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "ArchDisc — creative AI for the physical world";
const DESCRIPTION =
  "Describe an object in a sentence, and Archie builds it — real, manufacturable geometry verified against a native kernel. Studio for 3D creation, Forge for mechanical CAD, and Archie, the local model that runs on your Mac. Free, local, private. Public release soon.";

export const metadata: Metadata = {
  metadataBase: new URL("https://archdisc.com"),
  title: { default: TITLE, template: "%s · ArchDisc" },
  description: DESCRIPTION,
  applicationName: "ArchDisc",
  keywords: [
    "ArchDisc",
    "creative AI",
    "AI CAD",
    "generative design",
    "mechanical CAD",
    "3D modeling",
    "Archie",
    "Studio",
    "Forge",
    "physical AI",
    "vibe designing",
  ],
  authors: [{ name: "ArchDisc" }],
  openGraph: {
    type: "website",
    siteName: "ArchDisc",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#090c14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${bricolage.variable}`}
    >
      <body className="min-h-dvh bg-paper text-ink-soft antialiased">
        <a
          href="#main"
          className="a-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-line-strong focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.14em] focus:text-ink"
        >
          Skip to content
        </a>
        <Grain />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
