"use client";

import { useState, useCallback, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

interface ValidationMessage {
  type: "success" | "error" | "warning" | "info";
  text: string;
}

interface ValidationResult {
  valid: boolean;
  messages: ValidationMessage[];
}

export function DkimValidator() {
  const [record, setRecord] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  function validate() {
    const trimmed = record.trim();
    const messages: ValidationMessage[] = [];

    if (!trimmed) {
      messages.push({ type: "error", text: "DKIM record is empty." });
      setResult({ valid: false, messages });
      return;
    }

    if (!trimmed.startsWith("v=DKIM1")) {
      messages.push({ type: "error", text: "Record must start with 'v=DKIM1' (RFC 6376 section 3.4)." });
    } else {
      messages.push({ type: "success", text: "Tag 'v=DKIM1' present and valid." });
    }

    const pMatch = trimmed.match(/\bp=([A-Za-z0-9+/=]+)/);
    if (!pMatch) {
      messages.push({ type: "error", text: "Missing 'p=' tag (public key). Required by RFC 6376 section 3.5." });
    } else {
      const key = pMatch[1];
      if (key.length < 64) {
        messages.push({ type: "warning", text: `Public key seems short (${key.length} chars). A typical 1024-bit RSA key is ~180 base64 chars. This may be a test key.` });
      } else if (key.length > 400) {
        messages.push({ type: "info", text: `Key is ${key.length} chars. Likely a 2048-bit RSA key (strong security).` });
      } else {
        messages.push({ type: "success", text: `Public key found (${key.length} characters).` });
      }
    }

    const hMatch = trimmed.match(/\bh=(\w+)/);
    if (hMatch) {
      const hash = hMatch[1].toLowerCase();
      if (hash === "sha1") messages.push({ type: "warning", text: "Uses deprecated SHA1 hash (h=sha1). RFC 8301 recommends SHA256." });
      else if (hash === "sha256") messages.push({ type: "success", text: "Uses SHA256 hash — current best practice per RFC 8301." });
    }

    const kMatch = trimmed.match(/\bk=(\w+)/);
    if (kMatch) {
      const keyType = kMatch[1].toLowerCase();
      if (keyType === "ed25519") messages.push({ type: "info", text: "Ed25519 key (modern, shorter, faster). Supported by major providers." });
      else if (keyType !== "rsa") messages.push({ type: "warning", text: `Unusual key type: ${keyType}. Standard types are rsa or ed25519.` });
    }

    const tMatch = trimmed.match(/\bt=([\w:]+)/);
    if (tMatch) {
      const flags = tMatch[1].toLowerCase();
      if (flags.includes("y")) messages.push({ type: "info", text: "t=y flag set. This is a test mode DKIM record — no signatures will be used." });
      if (flags.includes("s")) messages.push({ type: "info", text: "t=s flag set. Signature is limited to subdomains (strict)." });
    }

    const validTagPattern = /\b(v=DKIM1|p=[A-Za-z0-9+/=]+|k=(rsa|ed25519)|s=(email|\*|asterisk)|h=(sha256|sha1)|t=([\w:]+))\b/gi;
    const validTags = trimmed.match(validTagPattern);
    const tagCount = validTags ? validTags.length : 0;
    const semicolons = (trimmed.match(/;/g) || []).length;

    if (semicolons < tagCount - 1) {
      messages.push({ type: "warning", text: "DKIM tags should be separated by semicolons (RFC 6376 section 3.4.1)." });
    } else if (tagCount >= 2) {
      messages.push({ type: "success", text: "Tags properly separated by semicolons." });
    }

    setResult({ valid: messages.every((m) => m.type !== "error"), messages });
  }

  function handleClear() { setRecord(""); setResult(null); }

  const handleCopyResult = useCallback(() => {
    if (!result) return;
    const text = result.messages.map((m) => `[${m.type.toUpperCase()}] ${m.text}`).join("\n");
    navigator.clipboard.writeText(text);
  }, [result]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">DKIM Record (RFC 6376)</label>
        <textarea
          value={record}
          onChange={(e) => setRecord(e.target.value)}
          rows={4}
          placeholder='v=DKIM1; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...'
          className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-300">Paste the full TXT record from your DNS. Use DKIM Lookup to fetch one.</p>
      </div>

      <div className="flex gap-3">
        <Button onClick={validate}>Validate</Button>
        <Button variant="secondary" onClick={handleClear}>Clear</Button>
        {result && <Button variant="secondary" onClick={handleCopyResult}>Copy Results</Button>}
      </div>

      {result && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
            <p className={`text-sm font-semibold ${result.valid ? "text-green-700" : "text-red-600"}`}>
              {result.valid ? "Record looks valid" : "Issues found"}
            </p>
          </div>
          <div className="space-y-2 px-5 py-4">
            {result.messages.map((msg, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 shrink-0 flex items-center justify-center size-5">
                  <Icon name={msg.type === "success" ? "CheckCircle2" : msg.type === "warning" ? "AlertTriangle" : msg.type === "info" ? "Info" : "XCircle"} className="size-4" />
                </span>
                <span className={
                  msg.type === "success" ? "text-green-700 dark:text-green-400" 
                  : msg.type === "warning" ? "text-amber-700 dark:text-amber-400"
                  : msg.type === "info" ? "text-blue-700 dark:text-blue-400"
                  : "text-red-700 dark:text-red-400"
                }>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <details className="group">
        <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">How to read a DKIM record</summary>
        <div className="mt-3 space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <p><strong>v=DKIM1</strong> — Version tag (required, must be DKIM1)</p>
          <p><strong>p=</strong> — Public key material (required, base64-encoded)</p>
          <p><strong>k=</strong> — Key type (optional, rsa or ed25519, defaults to rsa)</p>
          <p><strong>h=</strong> — Hash algorithm (optional, sha256 or sha1, defaults to sha256)</p>
          <p><strong>s=</strong> — Service type (optional, email or *, defaults to *)</p>
          <p><strong>t=</strong> — Flags (optional, y=test mode, s=strict subdomain)</p>
        </div>
      </details>

      <details className="group">
        <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Terminal commands to verify DKIM</summary>
        <div className="mt-3 space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <p><strong>Check with dig:</strong></p>
          <pre className="overflow-x-auto text-sm text-zinc-700 dark:text-zinc-300">dig TXT default._domainkey.example.com +short</pre>
          <p><strong>Check with nslookup:</strong></p>
          <pre className="overflow-x-auto text-sm text-zinc-700 dark:text-zinc-300">nslookup -type=TXT default._domainkey.example.com</pre>
          <p><strong>Decode key fingerprint (Unix):</strong></p>
           <pre className="overflow-x-auto text-sm text-zinc-700 dark:text-zinc-300">{`dig TXT default._domainkey.example.com +short | grep -oP 'p=\\K[^;]+' | base64 -d 2>/dev/null | openssl pkey -pubin -noout -text 2>/dev/null || echo 'Key decode requires base64 decoder'`}</pre>
        </div>
      </details>
    </div>
  );
}
