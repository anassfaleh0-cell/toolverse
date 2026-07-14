"use client";

import { useCallback, useSyncExternalStore, useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent, revokeConsent, clearAnalyticsData, getBookmarks, clearBookmarks, clearHistory } from "@/lib/analytics";

function subscribeConsent(cb: () => void) {
  window.addEventListener("tv:analytics-consent-granted", cb);
  window.addEventListener("tv:analytics-consent-revoked", cb);
  return () => {
    window.removeEventListener("tv:analytics-consent-granted", cb);
    window.removeEventListener("tv:analytics-consent-revoked", cb);
  };
}

function getConsentSnapshot() { return getAnalyticsConsent(); }

export function PrivacyControls() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentSnapshot);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [resetDone, setResetDone] = useState<string | null>(null);

  const handleAccept = useCallback(() => { setAnalyticsConsent(true); setResetDone("Consent granted."); setTimeout(() => setResetDone(null), 2000); }, []);
  const handleDecline = useCallback(() => { setAnalyticsConsent(false); setResetDone("Consent declined."); setTimeout(() => setResetDone(null), 2000); }, []);
  const handleRevoke = useCallback(() => { revokeConsent(); setResetDone("Consent revoked."); setTimeout(() => setResetDone(null), 2000); }, []);
  const handleResetAll = useCallback(() => { clearAnalyticsData(); setResetDone("All local data cleared."); setTimeout(() => setResetDone(null), 2000); }, []);
  const handleClearBookmarks = useCallback(() => { clearBookmarks(); setBookmarks([]); setResetDone("Bookmarks cleared."); setTimeout(() => setResetDone(null), 2000); }, []);
  const handleClearHistory = useCallback(() => { clearHistory(); setResetDone("History cleared."); setTimeout(() => setResetDone(null), 2000); }, []);
  const handleShowBookmarks = useCallback(() => { setBookmarks(getBookmarks()); setShowBookmarks(true); }, []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {resetDone && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200" role="status">
          {resetDone}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Analytics Consent</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Current status: <span className="font-semibold">{consent === true ? "Accepted" : consent === false ? "Declined" : "Not set"}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {consent !== true && (
              <button onClick={handleAccept} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">Accept</button>
            )}
            {consent !== false && (
              <button onClick={handleDecline} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Decline</button>
            )}
            {consent !== null && (
              <button onClick={handleRevoke} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">Revoke Consent</button>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Local Data</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Clear all locally stored data including preferences and cached tool results.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={handleResetAll} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">Reset All Local Data</button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Bookmarks</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">View and manage your saved bookmarks.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={handleShowBookmarks} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-200">Show Bookmarks</button>
            <button onClick={handleClearBookmarks} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">Clear Bookmarks</button>
          </div>
          {showBookmarks && (
            <div className="mt-3">
              {bookmarks.length === 0 ? (
                <p className="text-sm text-zinc-600">No bookmarks saved.</p>
              ) : (
                <ul className="max-h-40 space-y-1 overflow-y-auto">
                  {bookmarks.map((b) => <li key={b} className="text-sm text-zinc-600 dark:text-zinc-400">{b}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">History</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Clear your recently viewed tools history.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={handleClearHistory} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">Clear History</button>
          </div>
        </div>
      </div>
    </section>
  );
}