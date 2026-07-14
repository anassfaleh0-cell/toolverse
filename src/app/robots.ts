import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Mediapartners-Google", allow: "/" },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/nuvora-api/",
          "/widgets/",
          "/*?",
          "/search",
          "/tag/",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://{DOMAIN}"}/sitemap.xml`,
  };
}
