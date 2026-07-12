import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/api/"], crawlDelay: 1 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
