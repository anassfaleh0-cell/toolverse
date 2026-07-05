/**
 * Analytics component — renders provider scripts only when:
 * 1. Consent has been granted
 * 2. Environment variables are configured
 *
 * Currently a no-op shell. Activate by:
 * - Setting NEXT_PUBLIC_GA4_ID in .env.local
 * - Setting NEXT_PUBLIC_CLARITY_ID in .env.local
 */

"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getAnalyticsConsent, trackPageView, type PageView } from "@/lib/analytics";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = getAnalyticsConsent();

  useEffect(() => {
    if (consent !== true) return;
    const pageView: PageView = {
      path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      title: document.title,
      referrer: document.referrer || undefined,
    };
    trackPageView(pageView);
  }, [pathname, searchParams, consent]);

  if (!GA4_ID && !CLARITY_ID) return null;

  return (
    <>
      {GA4_ID && consent === true && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA4_ID}',{page_path:window.location.pathname});`}
          </Script>
        </>
      )}
    </>
  );
}
