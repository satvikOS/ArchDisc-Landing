/**
 * Global site constants + information architecture.
 * Grounded in the ArchDisc pitch deck: "Describe it. Archie builds it.",
 * "Two apps. One model.", "Free to dream. Pay to grow — the source stays ours."
 * Every link resolves to a real, built page.
 */

export const ACCESS_URL = "/access";
export const CLEARANCE_CTA = "Get early access";

/** Back-compat aliases (older components import these). */
export const APP_URL = ACCESS_URL;
export const CTA = CLEARANCE_CTA;

/** Public-release target. Edit this one constant to move the countdown. */
export const LAUNCH_ISO = "2026-09-23T17:00:00Z";

export const PRODUCTS = [
  {
    key: "forge",
    href: "/forge",
    codename: "FORGE",
    designation: "SYS-01",
    role: "Mechanical CAD",
    blurb: "A real CAD kernel. Solid parts, simulation and drawings you can manufacture.",
  },
  {
    key: "studio",
    href: "/studio",
    codename: "STUDIO",
    designation: "SYS-02",
    role: "3D creation",
    blurb: "The breadth of Blender, Maya and Houdini. Model, light, and render — in words.",
  },
  {
    key: "archie",
    href: "/archie",
    codename: "ARCHIE",
    designation: "SYS-00",
    role: "The model",
    blurb: "You speak. It plans and builds, in both apps. Local, private, and fast.",
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
  tagline: "Describe it. Archie builds it.",
  pre: "Two apps. One model.",
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
      title: "Company",
      links: [
        { label: "Manifesto", href: "/manifesto" },
        { label: "Early access", href: "/access" },
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
  attribution: "Satvik Adyanthaya & Jeff Munkondaya · University of Rochester",
  bottomLine: "Free to use — the source stays ours.",
};
