"use client";

import dynamic from "next/dynamic";

const Analytics = dynamic(() => import("@/components/shared/analytics").then((m) => ({ default: m.Analytics })), { ssr: false });

const CookieConsent = dynamic(() => import("@/components/shared/cookie-consent").then((m) => ({ default: m.CookieConsent })), { ssr: false });

const ServiceWorkerRegister = dynamic(() => import("@/components/shared/service-worker-register").then((m) => ({ default: m.ServiceWorkerRegister })), { ssr: false });

export function ClientDynamic() {
  return (
    <>
      <CookieConsent />
      <Analytics />
      <ServiceWorkerRegister />
    </>
  );
}
