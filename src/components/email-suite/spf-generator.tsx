"use client";

import { useState, useCallback, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

interface SpfInclude {
  type: "ip4" | "ip6" | "include" | "a" | "mx" | "ptr";
  value: string;
}

export function SpfGenerator() {
  const [includes, setIncludes] = useState<SpfInclude[]>([
    { type: "include", value: "_spf.google.com" },
  ]);
  const [policy, setPolicy] = useState<"-all" | "~all" | "+all" | "?all">("~all");
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  function addInclude() { setIncludes([...includes, { type: "ip4", value: "" }]); }

  function removeInclude(i: number) { setIncludes(includes.filter((_, idx) => idx !== i)); }

  function updateInclude(i: number, field: keyof SpfInclude, val: string) {
    const updated = [...includes];
    updated[i] = { ...updated[i], [field]: val };
    setIncludes(updated);
  }

  const record = `v=spf1 ${includes.map((inc) => {
    if (inc.type === "a" || inc.type === "mx" || inc.type === "ptr") {
      return inc.value ? `${inc.type}:${inc.value}` : inc.type;
    }
    return inc.value ? `${inc.type}:${inc.value}` : "";
  }).filter(Boolean).join(" ")} ${policy}`.replace(/\s+/g, " ");

  const lookupCount = includes.filter((inc) => ["include", "a", "mx", "ptr"].includes(inc.type) && inc.value).length;

  const warnings = useMemo(() => {
    const w: { type: "warning" | "error" | "info"; text: string }[] = [];
    if (lookupCount > 8) w.push({ type: "error", text: `DNS lookup count: ${lookupCount}. RFC 7208 limits SPF to 10 lookups.` });
    if (policy === "+all") w.push({ type: "error", text: "+all allows any server to send email as your domain. This bypasses SPF protection entirely." });
    if (policy === "?all") w.push({ type: "warning", text: "?all provides no policy. Receiving servers may treat this as neutral or no SPF." });
    if (includes.filter((i) => i.type === "ptr" && i.value).length > 0) w.push({ type: "warning", text: "ptr mechanisms are slow, unreliable, and not recommended by RFC 7208 section 5.5." });
    if (!includes.some((i) => i.type === "include" && i.value)) w.push({ type: "info", text: "No include statements. If you use a third-party email provider, add their SPF include." });
    return w;
  }, [lookupCount, policy, includes]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(record);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [record]);

  const handleDownloadTxt = useCallback(() => {
    const blob = new Blob([record], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spf-record.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [record]);

  const handleDownloadZone = useCallback(() => {
    const zone = `@  IN  TXT  "${record}"`;
    const blob = new Blob([zone], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spf-record.bind-zone.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [record]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Authorized Senders</p>
          <span className="text-[11px] text-zinc-600 dark:text-zinc-300">{lookupCount}/10 DNS lookups</span>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {includes.map((inc, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <select
                value={inc.type}
                onChange={(e) => updateInclude(i, "type", e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                aria-label="Mechanism type"
              >
                <option value="ip4">IP4</option>
                <option value="ip6">IP6</option>
                <option value="include">Include</option>
                <option value="a">A Record</option>
                <option value="mx">MX Record</option>
                <option value="ptr">PTR</option>
              </select>
              <Input
                type="text"
                value={inc.value}
                onChange={(e) => updateInclude(i, "value", e.target.value)}
                placeholder={inc.type === "include" ? "_spf.google.com" : inc.type === "ip4" ? "192.168.1.0/24" : "example.com"}
                className="flex-1"
              />
              <button type="button" onClick={() => removeInclude(i)} className="shrink-0 rounded-lg p-2 text-zinc-600 dark:text-zinc-300 hover:text-red-700" aria-label="Remove">
                <Icon name="X" className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <Button variant="secondary" size="sm" onClick={addInclude}>Add Sender</Button>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-1.5">
          {warnings.map((w, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs ${w.type === "error" ? "text-red-700 dark:text-red-400" : w.type === "warning" ? "text-amber-700 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>
              <Icon
                name={w.type === "error" ? "XCircle" : w.type === "warning" ? "AlertTriangle" : "Info"}
                className="size-4 shrink-0 mt-0.5"
              />
              <span>{w.text}</span>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Policy (RFC 7208)</label>
        <select
          value={policy}
          onChange={(e) => setPolicy(e.target.value as typeof policy)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="~all">SoftFail (~all) â€” Recommended for testing</option>
          <option value="-all">Fail (-all) â€” Recommended for production</option>
          <option value="?all">Neutral (?all)</option>
          <option value="+all">Pass (+all) â€” Not recommended</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Generated SPF Record (<span className="font-mono">TXT</span>)</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
            <Button variant="secondary" size="sm" onClick={handleDownloadTxt}>Download TXT</Button>
            <Button variant="secondary" size="sm" onClick={handleDownloadZone}>Zone File</Button>
          </div>
        </div>
        <div className="px-5 py-4">
          <pre className="overflow-x-auto whitespace-pre-wrap break-all text-sm text-zinc-900 dark:text-zinc-50">{record}</pre>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
          {showAdvanced ? "Hide" : "Show"} DNS zone format &amp; command examples
        </button>
      </div>

      {showAdvanced && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">DNS Zone File Entry (BIND format)</p>
          <pre className="mb-3 overflow-x-auto text-sm text-zinc-700 dark:text-zinc-300">@  IN  TXT  "{record}"</pre>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Verify with dig</p>
          <pre className="mb-3 overflow-x-auto text-sm text-zinc-700 dark:text-zinc-300">dig TXT example.com +short</pre>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Verify with nslookup</p>
          <pre className="overflow-x-auto text-sm text-zinc-700 dark:text-zinc-300">nslookup -type=TXT example.com</pre>
        </div>
      )}
    </div>
  );
}
