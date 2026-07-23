import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, Space_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
  openGraph: { type: "website", siteName: "ArchDisc", title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#f4efdf",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-dvh bg-cream text-ink antialiased">
        <SmoothScroll />
        <a
          href="#main"
          className="a-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:nb-card focus:bg-lime focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:font-bold focus:uppercase focus:tracking-[0.14em] focus:text-ink"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
