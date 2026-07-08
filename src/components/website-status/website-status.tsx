"use client";

import { useState, useTransition } from "react";
import { Input, Button, Alert, Card, Skeleton } from "@/components/ui";
import { CopyButton } from "@/components/shared";

interface StatusResult {
  url: string;
  statusCode: number;
  statusLabel: string;
  responseTime: number;
  contentType: string;
  contentLength: number | null;
  server: string;
  error?: string;
}

export function WebsiteStatusChecker() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/website-status?url=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to check website status");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const statusColor = (code: number) => {
    if (code === 0) return "border-red-500 bg-red-50 dark:bg-red-950";
    if (code >= 200 && code < 300) return "border-green-500 bg-green-50 dark:bg-green-950";
    if (code >= 300 && code < 400) return "border-blue-500 bg-blue-50 dark:bg-blue-950";
    if (code >= 400 && code < 500) return "border-amber-500 bg-amber-50 dark:bg-amber-950";
    return "border-red-500 bg-red-50 dark:bg-red-950";
  };

  const statusIcon = (label: string) => {
    switch (label) {
      case "Online": return "✅";
      case "Redirect": return "↪️";
      case "Error": return "⚠️";
      case "Offline": return "❌";
      default: return "❓";
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://example.com"
          aria-label="URL"
        />
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? "Checking..." : "Check"}
        </Button>
      </form>

      {error && (
        <Alert variant="error" className="mt-6">{error}</Alert>
      )}

      {loading && (
        <div className="mt-8">
          <Skeleton count={1} columns={1} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8">
          <Card variant="default" className={`border-2 p-8 text-center ${statusColor(result.statusCode)}`}>
            <div className="text-5xl">{statusIcon(result.statusLabel)}</div>
            <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {result.statusLabel}
            </p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {result.statusCode > 0 ? `HTTP ${result.statusCode}` : "No Response"}
            </p>
          </Card>

          {result.statusCode > 0 && (
            <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Response Details
                </p>
                <CopyButton text={JSON.stringify(result, null, 2)} label="Copy" />
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">URL</span>
                  <span className="break-all text-zinc-600 dark:text-zinc-400">{result.url}</span>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">Response Time</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{result.responseTime}ms</span>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">Content Type</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{result.contentType || "N/A"}</span>
                </div>
                {result.contentLength !== null && (
                  <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Content Length</span>
                    <span className="text-zinc-600 dark:text-zinc-400">{result.contentLength.toLocaleString()} bytes</span>
                  </div>
                )}
                <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">Server</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{result.server || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {result.error && (
            <Alert variant="error" className="mt-4">{result.error}</Alert>
          )}
        </div>
      )}
    </div>
  );
}
