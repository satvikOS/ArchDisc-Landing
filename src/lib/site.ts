/**
 * Global site constants + information architecture.
 * Every link here resolves to a real, built page — no "#" stubs.
 */

/** The single conversion destination while the products are pre-release. */
export const ACCESS_URL = "/access";
export const CLEARANCE_CTA = "Request clearance";

/** Back-compat aliases (older components import these). */
export const APP_URL = ACCESS_URL;
export const CTA = CLEARANCE_CTA;

/** Public-release target. Edit this one constant to move the countdown.
 *  When it passes, the UI flips to "SIGNAL LIVE" rather than going negative. */
export const LAUNCH_ISO = "2026-09-23T17:00:00Z";

export const PRODUCTS = [
  {
    key: "forge",
    href: "/forge",
    codename: "FORGE",
    designation: "SYS-01",
    role: "The kernel",
    blurb: "Native parametric CAD on a real geometry kernel — solids made to be made.",
  },
  {
    key: "studio",
    href: "/studio",
    codename: "STUDIO",
    designation: "SYS-02",
    role: "The surface",
    blurb: "A creation environment where scenes, materials, and motion come together.",
  },
  {
    key: "archie",
    href: "/archie",
    codename: "ARCHIE",
    designation: "SYS-00",
    role: "The model",
    blurb: "The local model fleet that turns plain language into precise geometry.",
  },
] as const;

export const nav = {
  links: [
    { href: "/forge", label: "Forge" },
    { href: "/studio", label: "Studio" },
    { href: "/archie", label: "Archie" },
    { href: "/manifesto", label: "Manifesto" },
  ],
};

export const footer = {
  brand: "ArchDisc",
  tagline: "Describe it. It gets built.",
  pre: "Three systems. Not yet public.",
  columns: [
    {
      title: "Systems",
      links: [
        { label: "Forge", href: "/forge" },
        { label: "Studio", href: "/studio" },
        { label: "Archie", href: "/archie" },
        { label: "Precision", href: "/precision" },
      ],
    },
    {
      title: "Signal",
      links: [
        { label: "Request clearance", href: "/access" },
        { label: "Dispatch", href: "/dispatch" },
        { label: "Status", href: "/status" },
        { label: "Manifesto", href: "/manifesto" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  attribution: "Built with care. Free to use.",
  bottomLine: "Nothing leaves your machine.",
};
