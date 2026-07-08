"use client";

import { useState, useTransition } from "react";
import { Input, Button, Alert, Skeleton } from "@/components/ui";
import { CopyButton } from "@/components/shared";

interface ReverseDnsResult {
  ip: string;
  hostnames: string[];
}

export function ReverseDnsLookup() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<ReverseDnsResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = ip.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/reverse-dns?ip=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "No reverse DNS record found");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="8.8.8.8"
          aria-label="IP address"
        />
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? "Looking up..." : "Lookup"}
        </Button>
      </form>

      {error && (
        <Alert variant="error" className="mt-6">{error}</Alert>
      )}

      {loading && (
        <div className="mt-8">
          <Skeleton count={4} columns={1} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Reverse DNS for {result.ip}
            </p>
            <CopyButton text={JSON.stringify(result, null, 2)} label="Copy" />
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {result.hostnames.length > 0 ? (
              result.hostnames.map((hostname, i) => (
                <div key={i} className="px-5 py-4 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                  {hostname}
                </div>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                No PTR records found for this IP address.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
