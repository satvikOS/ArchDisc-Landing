/**
 * Global site constants + information architecture for the multi-page ArchDisc site.
 * Per-page copy lives in each page; this is only the shared shell.
 * TODO(satvik): confirm APP_URL (early-access / download entry) and GITHUB_URL (public org).
 */

export const APP_URL = "https://app.archdisc.com";
export const GITHUB_URL = "https://github.com/satvikOS"; // umbrella org
export const CTA = "Open ArchDisc";
export const CTA_SECONDARY = "Star on GitHub";

/** Forge and Studio are separate repositories; the model/Archie has no public repo yet. */
export const REPOS = {
  studio: "https://github.com/satvikOS/Studio",
  forge: "https://github.com/satvikOS/Forge",
  archie: null,
} as const;

export const nav = {
  links: [
    { href: "/studio", label: "Studio" },
    { href: "/forge", label: "Forge" },
    { href: "/archie", label: "Archie" },
    { href: "/precision", label: "Precision" },
  ],
};

export const footer = {
  brand: "ArchDisc — describe it, Archie builds it.",
  pre: "Open source · public release soon",
  columns: [
    {
      title: "Platform",
      links: [
        { label: "Overview", href: "/" },
        { label: "Studio", href: "/studio" },
        { label: "Forge", href: "/forge" },
        { label: "Archie", href: "/archie" },
        { label: "Precision", href: "/precision" },
      ],
    },
    {
      title: "Open source",
      links: [
        { label: "Studio on GitHub", href: REPOS.studio, external: true },
        { label: "Forge on GitHub", href: REPOS.forge, external: true },
        { label: "Self-host guide", href: "#" },
        { label: "License · OCCT LGPL", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "#" },
        { label: "Tool-call schema", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ],
  attribution: "Built on OpenCASCADE 7.9.3 · Open source",
  bottomLine: "Monochrome by design.",
};
