import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function imageSitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
