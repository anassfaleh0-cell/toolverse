"use client";

import Link from "next/link";
import { useCallback, useSyncExternalStore } from "react";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics";

function subscribe(cb: () => void) {
  window.addEventListener("tv:analytics-consent-granted", cb);
  return () => window.removeEventListener("tv:analytics-consent-granted", cb);
}

function getSnapshot() {
  return getAnalyticsConsent();
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const accept = useCallback(() => {
    setAnalyticsConsent(true);
  }, []);

  const decline = useCallback(() => {
    setAnalyticsConsent(false);
  }, []);

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          We use cookies and analytics to improve your experience. You can choose to accept or decline.
          {" "}See our{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
