"use client";

import { useState } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  return atob(base64);
}

function parseJwtPart(part: string): Record<string, unknown> | null {
  try {
    return JSON.parse(base64UrlDecode(part));
  } catch {
    return null;
  }
}

function getExpirationStatus(exp: number | undefined): { label: string; color: string } | null {
  if (exp === undefined) return null;
  const now = Math.floor(Date.now() / 1000);
  if (now < exp) {
    const remaining = exp - now;
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    if (hours > 0) {
      return { label: `Valid (expires in ${hours}h ${minutes}m)`, color: "text-green-700 dark:text-green-400" };
    }
    return { label: `Valid (expires in ${minutes}m ${remaining % 60}s)`, color: "text-green-700 dark:text-green-400" };
  }
  return { label: "Expired", color: "text-red-600 dark:text-red-400" };
}

export function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState<Record<string, unknown> | null>(null);
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  function decode(val: string) {
    const trimmed = val.trim();
    if (!trimmed) { setHeader(null); setPayload(null); setSignature(""); setError(""); return; }

    const parts = trimmed.split(".");
    if (parts.length !== 3) { setHeader(null); setPayload(null); setSignature(""); setError("Invalid JWT format. Expected a three-part token (header.payload.signature)."); return; }

    const decodedHeader = parseJwtPart(parts[0]);
    const decodedPayload = parseJwtPart(parts[1]);

    if (!decodedHeader || !decodedPayload) { setHeader(null); setPayload(null); setSignature(""); setError("Could not decode JWT. The header or payload contains invalid Base64-URL encoded data."); return; }

    setHeader(decodedHeader);
    setPayload(decodedPayload);
    setSignature(parts[2]);
    setError("");
  }

  function handleClear() {
    setInput("");
    setHeader(null);
    setPayload(null);
    setSignature("");
    setError("");
  }

  const expStatus = payload?.exp !== undefined ? getExpirationStatus(payload.exp as number) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => { const val = e.target.value; setInput(val); decode(val); }}
          placeholder="Paste JWT token here (e.g. eyJhbGciOiJIUzI1NiIs...)"
          rows={4}
          aria-label="JWT token input"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => decode(input)} variant="primary" disabled={!input.trim()}>
            Decode
          </Button>
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono">{error}</p>
        </Alert>
      )}

      {header && payload && (
        <div className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Header</p>
              <CopyButton text={JSON.stringify(header, null, 2)} label="Copy" />
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{JSON.stringify(header, null, 2)}</pre>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Payload</p>
              <CopyButton text={JSON.stringify(payload, null, 2)} label="Copy" />
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{JSON.stringify(payload, null, 2)}</pre>
          </div>

          {expStatus && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Expiration Status</span>
              <p className={`mt-1 text-sm font-medium ${expStatus.color}`}>{expStatus.label}</p>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Signature</p>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs text-zinc-600 dark:text-zinc-400">{signature}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
