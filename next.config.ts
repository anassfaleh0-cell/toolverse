import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  logging: {
    fetches: { fullUrl: false },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.toolverse.dev" }],
        destination: "https://toolverse.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;