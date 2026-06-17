/**
 * Global site constants + information architecture for the multi-page ArchDisc site.
 * Per-page copy lives in each page; this is only the shared shell.
 * TODO(satvik): confirm APP_URL (early-access / download entry).
 */

export const APP_URL = "https://app.archdisc.com";
export const CTA = "Open ArchDisc";

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
  pre: "Free to use · public release soon",
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
      title: "Product",
      links: [
        { label: "How it works", href: "/#how-it-works" },
        { label: "Precision", href: "/precision" },
        { label: "Pricing", href: "#" },
        { label: "What's free", href: "#" },
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
  attribution: "Built on OpenCASCADE 7.9.3 · Free to use",
  bottomLine: "Monochrome by design.",
};
