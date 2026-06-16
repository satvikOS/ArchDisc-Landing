/**
 * Global site constants + information architecture for the multi-page ArchDisc site.
 * Per-page copy lives in each page; this is only the shared shell.
 * TODO(satvik): confirm APP_URL (early-access / download entry) and GITHUB_URL (public org).
 */

export const APP_URL = "https://app.archdisc.com";
export const GITHUB_URL = "https://github.com/archdisc";
export const CTA = "Open ArchDisc";
export const CTA_SECONDARY = "Star on GitHub";

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
        { label: "GitHub", href: GITHUB_URL, external: true },
        { label: "Model weights", href: "#" },
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
