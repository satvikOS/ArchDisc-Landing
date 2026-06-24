import type { MetadataRoute } from "next";

const BASE = "https://archdisc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/forge",
    "/studio",
    "/archie",
    "/access",
    "/manifesto",
    "/precision",
    "/dispatch",
    "/status",
    "/privacy",
    "/terms",
  ];
  const now = new Date("2026-06-23");
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/access" ? 0.9 : 0.7,
  }));
}
