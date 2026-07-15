import type { NextConfig } from "next";

let nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  serverExternalPackages: [],
  logging: {
    fetches: { fullUrl: false },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["pdf-lib", "pdfjs-dist", "docx", "mammoth", "jszip", "marked", "ua-parser-js"],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|png|jpg|jpeg|gif|webp|avif|ico|woff2|css|js)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        ],
      },
    ];
  },
};

if (!process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL === "https://{DOMAIN}") {
  console.warn("⚠️  NEXT_PUBLIC_SITE_URL is not set. Sitemap and OG URLs will use a placeholder.");
}

export default async function loadConfig() {
  if (process.env.ANALYZE === "true") {
    const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({ enabled: true });
    return withBundleAnalyzer(nextConfig);
  }
  return nextConfig;
}