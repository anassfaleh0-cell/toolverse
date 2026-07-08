"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  getWorkspaceEntries,
  getPinned,
  getRecentlyViewed,
  removeWorkspaceEntry,
  type WorkspaceEntry,
  type StoredTool,
} from "@/lib/user-storage";

const TOOL_LOOKUP: Record<string, { name: string }> = {
  "dns-lookup": { name: "DNS Lookup" },
  "reverse-dns-lookup": { name: "Reverse DNS Lookup" },
  "dns-propagation-checker": { name: "DNS Propagation Checker" },
  "whois-lookup": { name: "WHOIS Lookup" },
  "http-headers-checker": { name: "HTTP Headers Checker" },
  "ssl-certificate-checker": { name: "SSL Certificate Checker" },
  "ping-test": { name: "Ping Test" },
  "port-checker": { name: "Port Checker" },
  "website-status-checker": { name: "Website Status Checker" },
  "user-agent-parser": { name: "User Agent Parser" },
  "subnet-calculator": { name: "Subnet Calculator" },
  "what-is-my-ip": { name: "What Is My IP" },
  "ip-lookup": { name: "IP Lookup" },
  "password-generator": { name: "Password Generator" },
  "lorem-ipsum-generator": { name: "Lorem Ipsum Generator" },
  "word-counter": { name: "Word Counter" },
  "text-diff-checker": { name: "Text Diff Checker" },
  "list-randomizer": { name: "List Randomizer" },
  "qr-code-generator": { name: "QR Code Generator" },
  "image-resizer": { name: "Image Resizer" },
  "css-gradient-generator": { name: "CSS Gradient Generator" },
  "barcode-generator": { name: "Barcode Generator" },
  "json-formatter": { name: "JSON Formatter" },
  "base64-encoder": { name: "Base64 Encoder" },
  "url-encoder": { name: "URL Encoder" },
  "html-entity-encoder": { name: "HTML Entity Encoder" },
  "jwt-decoder": { name: "JWT Decoder" },
  "uuid-generator": { name: "UUID Generator" },
  "regex-tester": { name: "Regex Tester" },
  "md5-hash-generator": { name: "MD5 Hash Generator" },
  "sha-hash-generator": { name: "SHA Hash Generator" },
  "html-minifier": { name: "HTML Minifier" },
  "css-minifier": { name: "CSS Minifier" },
  "js-minifier": { name: "JS Minifier" },
  "case-converter": { name: "Case Converter" },
  "number-base-converter": { name: "Number Base Converter" },
  "color-converter": { name: "Color Converter" },
  "markdown-preview": { name: "Markdown Preview" },
  "sql-formatter": { name: "SQL Formatter" },
  "html-preview": { name: "HTML Preview" },
  "text-to-slug": { name: "Text to Slug Converter" },
  "url-parser": { name: "URL Parser" },
  "json-path-search": { name: "JSON Path Search" },
  "json-to-csv": { name: "JSON to CSV Converter" },
  "yaml-to-json": { name: "YAML to JSON Converter" },
  "xml-to-json": { name: "XML to JSON Converter" },
  "timestamp-converter": { name: "Timestamp Converter" },
};

function safeName(slug: string): string {
  const entry = TOOL_LOOKUP[slug];
  if (entry) return entry.name;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

function useWorkspaceData() {
  const [workspaceEntries, setWorkspaceEntries] = useState<WorkspaceEntry[]>(() =>
    getWorkspaceEntries(),
  );
  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>(() => getPinned());
  const [recentlyViewed, setRecentlyViewed] = useState<StoredTool[]>(() =>
    getRecentlyViewed(),
  );

  const refresh = useCallback(() => {
    setWorkspaceEntries(getWorkspaceEntries());
    setPinnedSlugs(getPinned());
    setRecentlyViewed(getRecentlyViewed());
  }, []);

  return { workspaceEntries, pinnedSlugs, recentlyViewed, refresh };
}

type Tab = "results" | "pinned" | "history";

export function UniversalWorkspace() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("results");
  const { workspaceEntries, pinnedSlugs, recentlyViewed, refresh } =
    useWorkspaceData();

  const toggle = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next) refresh();
  }, [open, refresh]);

  const handleRemove = useCallback(
    (slug: string, savedAt: string) => {
      removeWorkspaceEntry(slug, savedAt);
      refresh();
    },
    [refresh],
  );

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-lg border border-r-0 border-zinc-200 bg-white px-1.5 py-4 text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        aria-label={open ? "Close workspace" : "Open workspace"}
        title="Workspace"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="size-5"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </button>

      <div
        className={`fixed inset-y-0 right-0 z-50 flex flex-col border-l border-zinc-200 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:border-zinc-700 dark:bg-zinc-900 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "340px" }}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Workspace
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close workspace"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-zinc-200 dark:border-zinc-700">
          {(
            [
              { key: "results", label: "Results" },
              { key: "pinned", label: "Pinned" },
              { key: "history", label: "History" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                tab === t.key
                  ? "border-b-2 border-blue-500 text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "results" && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {workspaceEntries.length === 0 ? (
                <EmptyState message="No saved results yet" />
              ) : (
                workspaceEntries.map((entry) => (
                  <div
                    key={`${entry.toolSlug}-${entry.savedAt}`}
                    className="group flex items-center gap-3 px-4 py-2.5"
                  >
                    <Link
                      href={`/${entry.toolSlug}`}
                      className="flex-1 min-w-0"
                    >
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {entry.toolName}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {entry.label}
                      </p>
                      <p className="text-[10px] text-zinc-300">
                        {formatTime(entry.savedAt)}
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(entry.toolSlug, entry.savedAt)
                      }
                      className="shrink-0 rounded p-1 text-zinc-300 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                      aria-label="Remove entry"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="size-3.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "pinned" && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {pinnedSlugs.length === 0 ? (
                <EmptyState message="No pinned tools yet" />
              ) : (
                pinnedSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="size-3.5 shrink-0 text-amber-500"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {safeName(slug)}
                    </span>
                  </Link>
                ))
              )}
            </div>
          )}

          {tab === "history" && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentlyViewed.length === 0 ? (
                <EmptyState message="No recently viewed tools" />
              ) : (
                recentlyViewed.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.url}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="size-3.5 shrink-0 text-zinc-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {tool.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {formatTime(tool.viewedAt)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="px-4 py-10 text-center text-sm text-zinc-400">{message}</p>
  );
}
