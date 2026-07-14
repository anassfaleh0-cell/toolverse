import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/shared/json-ld";
import { BRAND } from "@/lib/nuvora/brand";

import { ClientDynamic } from "@/components/shared/client-dynamic";

const Header = dynamic(() => import("@/components/header").then((m) => ({ default: m.Header })), { ssr: true });
const UniversalWorkspace = dynamic(() => import("@/components/shared/universal-workspace").then((m) => ({ default: m.UniversalWorkspace })));
const CommandPalette = dynamic(() => import("@/components/shared/command-palette").then((m) => ({ default: m.CommandPalette })));
const ErrorBoundary = dynamic(() => import("@/components/shared/error-boundary").then((m) => ({ default: m.ErrorBoundary })));

import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, HERO_TAGLINE } from "@/lib/constants";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${HERO_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Nuvora", "online tools", "free tools", "browser tools",
    "DNS lookup", "WHOIS", "SSL checker", "PDF tools", "image editor",
    "developer tools", "network diagnostics", "security tools",
    "privacy tools", "browser utilities", "converter tools",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${HERO_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${HERO_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.svg`],
  },
  robots: { index: true, follow: true },
  other: {
    "color-scheme": "light dark",
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    "p:domain_verify": process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || "",
    "pinterest-rich-pin": "true",
    "chatgpt-1d": "all",
    "perplexity-allow": "all",
    "reddit:title": SITE_NAME,
    "reddit:description": SITE_DESCRIPTION,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    other: [
      { rel: "icon", url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { rel: "icon", url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
            <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
          </>
        )}
        <link rel="dns-prefetch" href="https://www.googletagservices.com" />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <ThemeProvider>
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.svg`,
            description: SITE_DESCRIPTION,
            foundingDate: BRAND.founded,
            slogan: BRAND.tagline,
            contactPoint: {
              "@type": "ContactPoint",
              email: BRAND.email,
              contactType: "customer support",
            },
            sameAs: [
              "https://twitter.com/NuvoraHQ",
              "https://github.com/NuvoraHQ",
              "https://linkedin.com/company/NuvoraHQ",
              "https://youtube.com/@NuvoraHQ",
              "https://pinterest.com/NuvoraHQ",
            ],
          }} />
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }} />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-nuvora-600 focus:px-4 focus:py-2 focus:text-white">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1"><ErrorBoundary>{children}</ErrorBoundary></main>
          <Footer />
          <ClientDynamic />
          <Suspense fallback={null}><UniversalWorkspace /></Suspense>
          <Suspense fallback={null}><CommandPalette /></Suspense>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
