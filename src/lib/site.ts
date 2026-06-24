/**
 * Global site constants + information architecture.
 * An original message to the maker/engineer community — no pitch-deck copy,
 * no founders, no early-access funnel. Every link resolves to a real page.
 */

export const ACCESS_URL = "/manifesto";
export const CLEARANCE_CTA = "Read the manifesto";

/** Back-compat aliases (older components import these). */
export const APP_URL = ACCESS_URL;
export const CTA = CLEARANCE_CTA;

export const LAUNCH_ISO = "2026-09-23T17:00:00Z";

export const PRODUCTS = [
  {
    key: "forge",
    href: "/forge",
    codename: "FORGE",
    designation: "SYS-01",
    role: "Mechanical CAD",
    blurb: "A real geometry kernel. Solid parts, simulation and drawings made to be manufactured.",
  },
  {
    key: "studio",
    href: "/studio",
    codename: "STUDIO",
    designation: "SYS-02",
    role: "3D creation",
    blurb: "Model, light and render — a full 3D suite you reach for in plain words.",
  },
  {
    key: "archie",
    href: "/archie",
    codename: "ARCHIE",
    designation: "SYS-00",
    role: "The model",
    blurb: "The one that builds. Local, private, and made to run on your own machine.",
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
  tagline: "Make anything real.",
  pre: "Coming soon",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Forge", href: "/forge" },
        { label: "Studio", href: "/studio" },
        { label: "Archie", href: "/archie" },
        { label: "Precision", href: "/precision" },
      ],
    },
    {
      title: "More",
      links: [
        { label: "Manifesto", href: "/manifesto" },
        { label: "Dispatch", href: "/dispatch" },
        { label: "Status", href: "/status" },
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
  attribution: "",
  bottomLine: "Free to use. Local. Private.",
};
