"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { getAnalyticsConsent, trackPageView, reportWebVitals, type PageView } from "@/lib/analytics";
import { getCLS, getFCP, getLCP, getTTFB } from "web-vitals";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = getAnalyticsConsent();
  const vitalsReported = useRef(false);

  useEffect(() => {
    if (consent !== true) return;
    const pageView: PageView = {
      path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      title: document.title,
      referrer: document.referrer || undefined,
    };
    trackPageView(pageView);
  }, [pathname, searchParams, consent]);

  useEffect(() => {
    if (consent !== true || vitalsReported.current) return;
    vitalsReported.current = true;
    const report = (metric: { id: string; name: string; value: number }) => {
      reportWebVitals(metric.id, metric.name, metric.value, "good");
    };
    getCLS(report);
    getFCP(report);
    getLCP(report);
    getTTFB(report);
  }, [consent]);

  if (!GA4_ID && !CLARITY_ID) return null;

  return (
    <>
      {GA4_ID && consent === true && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA4_ID}',{page_path:window.location.pathname});
`}</Script>
        </>
      )}
      {CLARITY_ID && consent === true && (
        <Script id="clarity-init" strategy="afterInteractive">{`
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");
`}</Script>
      )}
    </>
  );
}