import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://archdisc.com/sitemap.xml",
    host: "https://archdisc.com",
  };
}
