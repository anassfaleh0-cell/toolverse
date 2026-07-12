"use client";

import { useState, useCallback, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import { ResultExport, AiExplain } from "@/components/shared";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface SPFScore {
  score: number;
  breakdown: { reason: string; points: number }[];
}

interface DMARCAnalysis {
  tags: Record<string, string>;
  score: number;
  strengths: string[];
  weaknesses: string[];
}

interface DKIMSelectorResult {
  selector: string;
  found: boolean;
  record?: string;
  keyType?: string;
  keySize?: number;
}

interface DKIMScore {
  score: number;
  breakdown: { reason: string; points: number }[];
}

interface BIMIValidation {
  hasSVG: boolean;
  svgUrl?: string;
  svgAccessible?: boolean;
  svgError?: string;
  hasAuthority: boolean;
  authorityUrl?: string;
  authorityValid?: boolean;
  authorityError?: string;
  dmarcEnforced: boolean;
  score: number;
}

interface CategoryScore {
  score: number;
  max: number;
  weight: number;
  label: string;
}

interface DeliverabilityScore {
  overall: number;
  categories: Record<string, CategoryScore>;
  details: Record<string, any>;
}

interface ComparisonData {
  domain1: string;
  domain2: string;
  comparisons: Record<string, { domain1: any; domain2: any; winner?: string }>;
  overall: { domain1: DeliverabilityScore; domain2: DeliverabilityScore; winner: string };
}

interface LookupResult {
  type: string;
  domain: string;
  records: string[];
  raw?: string[];
  error?: string;
  spfScore?: SPFScore;
  dmarcAnalysis?: DMARCAnalysis;
  dkimSelectors?: DKIMSelectorResult[];
  dkimScore?: DKIMScore;
  selector?: string;
  bimiValidation?: BIMIValidation;
  deliverabilityScore?: DeliverabilityScore;
  comparison?: ComparisonData;
  recommendations?: string[];
}

interface EmailAuthLookupProps {
  lookupType: "spf" | "dkim" | "dmarc" | "bimi" | "mx";
  title: string;
  description: string;
  placeholder?: string;
  showSelector?: boolean;
  selectorLabel?: string;
  beginnerGuide?: { title: string; content: string }[];
}

const RECORD_DESCRIPTIONS: Record<string, { name: string; rfc: string; desc: string }> = {
  spf: { name: "SPF", rfc: "RFC 7208", desc: "Specifies which mail servers are authorized to send email for your domain." },
  dkim: { name: "DKIM", rfc: "RFC 6376", desc: "Provides a digital signature for email, proving it hasn't been tampered with." },
  dmarc: { name: "DMARC", rfc: "RFC 7489", desc: "Tells receiving servers how to handle email that fails SPF or DKIM checks." },
  bimi: { name: "BIMI", rfc: "RFC 9371", desc: "Associates your brand logo with authenticated email for display in supporting clients." },
  mx: { name: "MX", rfc: "RFC 5321", desc: "Identifies the mail servers responsible for receiving email for your domain." },
};

function generateRecommendations(result: LookupResult, lookupType: string): { type: "error" | "warning" | "info"; text: string }[] {
  const recs: { type: "error" | "warning" | "info"; text: string }[] = [];

  if (lookupType === "spf") {
    if (!result.spfScore) {
      recs.push({ type: "error", text: "No SPF record found. Your domain is vulnerable to email spoofing. Create an SPF record listing all authorized sending sources and end with -all." });
    } else {
      const breakdown = result.spfScore.breakdown;
      for (const b of breakdown) {
        if (b.points === -20 && b.reason.includes("+all")) {
          recs.push({ type: "error", text: "Your SPF record has +all which allows any server to send email as you. Change this to -all immediately to prevent spoofing." });
        }
        if (b.points === -20 && b.reason.includes("exceeds DNS lookup limit")) {
          recs.push({ type: "error", text: "Your SPF record exceeds the 10 DNS lookup limit. Receivers will permanently reject your email. Consolidate includes or use a subdomain for some services." });
        }
        if (b.points === -10 && b.reason.includes("approaching DNS lookup limit")) {
          recs.push({ type: "warning", text: "Your SPF record is approaching the 10 DNS lookup limit. Consider consolidating include statements to avoid delivery failures." });
        }
      }
      if (result.spfScore.score < 50) {
        recs.push({ type: "warning", text: `SPF score is ${result.spfScore.score}/100. Improve it by using -all (hard fail) policy and keeping includes under 5.` });
      }
    }
  }

  if (lookupType === "dkim") {
    if (result.dkimSelectors) {
      const found = result.dkimSelectors.filter((s) => s.found);
      if (found.length === 0) {
        recs.push({ type: "error", text: "No DKIM record found across 20+ common selectors. Verify your email provider's DKIM selector name and publish the DNS record." });
      } else {
        const best = found.reduce((a, b) => (a.keySize && b.keySize && a.keySize > b.keySize ? a : b));
        if (best.keySize && best.keySize < 1024) {
          recs.push({ type: "warning", text: `DKIM key for "${best.selector}" is ${best.keySize}-bit (below 1024-bit minimum). Generate a new 2048-bit key for better security.` });
        }
        if (found.length > 1) {
          recs.push({ type: "info", text: `${found.length} DKIM selectors found: ${found.map((s) => s.selector).join(", ")}. Remove unused selectors to reduce DNS clutter.` });
        }
        recs.push({ type: "info", text: `DKIM found for selector "${found[0].selector}". Ensure DMARC is configured to enforce DKIM alignment.` });
      }
    }
    if (result.dkimScore && result.dkimScore.score < 40) {
      recs.push({ type: "warning", text: `DKIM score is ${result.dkimScore.score}/100. Consider using stronger keys or adding additional selectors from your email provider.` });
    }
  }

  if (lookupType === "dmarc") {
    if (result.dmarcAnalysis) {
      const a = result.dmarcAnalysis;
      if (a.tags.p === "none") {
        recs.push({ type: "warning", text: "You're monitoring but not enforcing with DMARC. Move to p=quarantine once you're confident all legitimate sources are covered. Then progress to p=reject for full protection." });
      }
      if (a.tags.p === "quarantine") {
        recs.push({ type: "info", text: "DMARC is set to p=quarantine — good progress. Consider moving to p=reject once you verify no legitimate email is being quarantined." });
      }
      if (a.tags.p === "reject") {
        recs.push({ type: "info", text: "DMARC is set to p=reject — maximum protection. Continue monitoring aggregate reports to catch any new unauthorized sources." });
      }
      if (!a.tags.rua) {
        recs.push({ type: "warning", text: "No rua tag configured. Add rua=mailto:you@yourdomain.com to receive aggregate DMARC reports and gain visibility into who is sending email as your domain." });
      }
      const pct = a.tags.pct ? parseInt(a.tags.pct) : 100;
      if (pct < 100) {
        recs.push({ type: "info", text: `Policy applies to ${pct}% of email. Gradually increase to 100% as you verify legitimate email passes authentication.` });
      }
      if (a.score < 30) {
        recs.push({ type: "warning", text: `DMARC score is ${a.score}/100. Improve by enforcing p=reject, adding rua for reporting, and setting pct=100.` });
      }
    } else {
      recs.push({ type: "error", text: "No DMARC record found. You cannot control how receivers handle unauthenticated email. Create a DMARC record starting with p=none to monitor, then progress to p=reject." });
    }
  }

  if (lookupType === "bimi") {
    if (result.bimiValidation) {
      const v = result.bimiValidation;
      if (v.hasSVG && !v.svgAccessible) {
        recs.push({ type: "error", text: `BIMI logo at ${v.svgUrl} is not accessible (${v.svgError || "unknown error"}). Ensure the SVG is publicly accessible via HTTPS and follows the BIMI SVG Tiny 1.2 profile.` });
      }
      if (v.hasAuthority && !v.authorityValid) {
        recs.push({ type: "warning", text: `BIMI authority (VMC) at ${v.authorityUrl} is not accessible. Verify the certificate file is publicly served over HTTPS.` });
      }
      if (!v.dmarcEnforced) {
        recs.push({ type: "warning", text: "DMARC must be set to p=quarantine or p=reject for BIMI to work. Your DMARC policy is not currently enforcing — BIMI indicators will not display." });
      }
      if (!v.hasSVG) {
        recs.push({ type: "error", text: "No SVG logo URL (l= tag) found in BIMI record. Add your brand logo as an SVG Tiny 1.2 to enable BIMI." });
      }
      if (v.score < 50) {
        recs.push({ type: "warning", text: `BIMI readiness score is ${v.score}/100. Ensure DMARC enforcement, a valid SVG logo, and optionally a VMC for the verified checkmark in Gmail.` });
      }
    } else {
      recs.push({ type: "info", text: "No BIMI record found. BIMI displays your brand logo in supporting email clients. Requires DMARC enforcement (p=quarantine or p=reject) and an SVG Tiny 1.2 logo." });
    }
  }

  if (lookupType === "mx") {
    if (result.records.length === 0) {
      recs.push({ type: "error", text: "No MX records found. This domain cannot receive email. Add MX records pointing to your email provider's mail servers." });
    } else {
      if (result.records.length === 1) {
        recs.push({ type: "warning", text: "Only one MX record. Add a secondary MX server with a higher priority value for redundancy during outages." });
      }
      const hasLowPriority = result.records.some((r) => parseInt(r.split(" ")[0]) === 0);
      if (hasLowPriority) {
        recs.push({ type: "info", text: "You have a priority 0 MX record. Ensure this is intentional — priority 0 is the highest priority (tried first)." });
      }
    }
  }

  return recs;
}

function ScoreBadge({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const color =
    score >= 70 ? "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 dark:text-green-400"
      : score >= 40 ? "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400"
        : "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400";
  const cls = size === "lg" ? "text-2xl px-4 py-2" : "text-sm px-2.5 py-1";
  return (
    <span className={`inline-flex items-center rounded-lg border font-bold ${color} ${cls}`}>
      {score}/100
    </span>
  );
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "bg-green-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-xs text-zinc-500">{label}</span>
      <div className="flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
        </div>
      </div>
      <span className={`w-12 text-right text-xs font-bold ${score >= 70 ? "text-green-600" : score >= 40 ? "text-amber-600" : "text-red-600"}`}>{score}</span>
    </div>
  );
}

export function EmailAuthLookup({ lookupType, title, description, placeholder, showSelector, selectorLabel, beginnerGuide }: EmailAuthLookupProps) {
  const [domain, setDomain] = useState("");
  const [domain2, setDomain2] = useState("");
  const [selector, setSelector] = useState("auto");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBeginner, setShowBeginner] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleLookup() {
    const cleanDomain = domain.trim().toLowerCase();
    if (!cleanDomain) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({ type: lookupType, domain: cleanDomain });
      if (selector && selector !== "default") params.set("selector", selector);
      if (domain2.trim()) params.set("domain2", domain2.trim().toLowerCase());
      const res = await fetch(`/api/email?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setResult(data);
      setHistory((prev) => [cleanDomain, ...prev.filter((d) => d !== cleanDomain)].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  const info = RECORD_DESCRIPTIONS[lookupType];

  const dynamicRecommendations = useMemo(() => {
    if (!result) return [];
    return generateRecommendations(result, lookupType);
  }, [result, lookupType]);

  const warnings = useMemo(() => {
    if (!result) return [];
    const w: { type: "warning" | "error" | "info"; text: string }[] = [];

    if (dynamicRecommendations.length > 0) {
      w.push(...dynamicRecommendations);
    } else {
      if (lookupType === "spf") {
        if (result.records.length === 0) {
          w.push({ type: "error", text: "No SPF record found. Your domain is vulnerable to email spoofing." });
          w.push({ type: "info", text: "Consider creating an SPF record using our SPF Record Generator." });
        } else {
          result.records.forEach((r) => {
            const redirects = (r.match(/\binclude:/g) || []).length;
            const lookups = (r.match(/\b(include:|a:|mx:|ptr:|exists:)/g) || []).length;
            if (lookups > 8) w.push({ type: "warning", text: `SPF record has ${lookups} DNS lookups. The limit is 10. Consider consolidating.` });
            if (redirects > 10) w.push({ type: "warning", text: `SPF record includes ${redirects} mechanisms. Too many can cause delivery issues.` });
            if (r.includes("+all")) w.push({ type: "error", text: "SPF policy is +all (Pass All). This allows any server to send email as your domain. Change to -all or ~all." });
          });
        }
      }
      if (lookupType === "dmarc") {
        if (result.records.length === 0) {
          w.push({ type: "error", text: "No DMARC record found. You cannot control how receivers handle unauthenticated email." });
          w.push({ type: "info", text: "Create a DMARC record using our DMARC Record Generator." });
        } else {
          result.records.forEach((r) => {
            if (r.includes("p=none")) w.push({ type: "warning", text: "DMARC policy is p=none (monitor only). No enforcement is applied. Move to p=quarantine or p=reject." });
            if (r.includes("pct=")) {
              const pct = r.match(/pct=(\d+)/);
              if (pct && parseInt(pct[1]) < 100) w.push({ type: "info", text: `DMARC policy applies to ${pct[1]}% of email. Gradually increase to 100%.` });
            }
            if (!r.includes("rua=")) w.push({ type: "warning", text: "No rua tag (report URI) found. You won't receive aggregate DMARC reports." });
          });
        }
      }
    }

    if (lookupType === "bimi") {
      if (result.records.length === 0) {
        w.push({ type: "info", text: "No BIMI record found. BIMI requires DMARC enforcement (p=quarantine or p=reject) to be effective." });
      }
    }

    if (lookupType === "mx") {
      if (result.records.length === 0) {
        w.push({ type: "error", text: "No MX records found. This domain cannot receive email." });
      } else if (result.records.length === 1) {
        w.push({ type: "warning", text: "Only one MX record. Add a secondary MX server for redundancy." });
      }
    }

    return w;
  }, [result, lookupType, dynamicRecommendations]);

  const reportData = useMemo(() => result ? { tool: `${info.name} Lookup`, domain: result.domain, records: result.records, raw: result.raw, score: result.spfScore?.score ?? result.dmarcAnalysis?.score ?? result.dkimScore?.score ?? null, timestamp: new Date().toISOString() } : null, [result, info]);

  const formatText = useCallback(() => {
    if (!result) return "";
    const lines = [`${info.name} Lookup Report`, `Domain: ${result.domain}`, `Records found: ${result.records.length}`, ""];
    result.records.forEach((r, i) => { lines.push(`Record ${i + 1}:`); lines.push(r); lines.push(""); });
    if (result.raw && result.raw.length > result.records.length) {
      lines.push(`${result.raw.length - result.records.length} additional non-${info.name} TXT records found.`);
    }
    if (warnings.length > 0) {
      lines.push("Analysis:", ...warnings.map((w) => `  [${w.type.toUpperCase()}] ${w.text}`));
    }
    return lines.join("\n");
  }, [result, info, warnings]);

  const formatCsv = useCallback(() => {
    if (!result) return "";
    const header = "Tool,Domain,Record,Index";
    const rows = result.records.map((r, i) => `"${info.name} Lookup","${result.domain}","${r}",${i + 1}`);
    return [header, ...rows].join("\n");
  }, [result, info]);

  const handleDownloadPdf = useCallback(async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const doc = await PDFDocument.create();
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
      let page = doc.addPage([612, 792]);
      const { width, height } = page.getSize();
      let y = height - 50;

      function addLine(text: string, opts?: { bold?: boolean; size?: number; color?: number[] }) {
        const font = opts?.bold ? helveticaBold : helvetica;
        const size = opts?.size || 11;
        const color = opts?.color || [0.2, 0.2, 0.2];
        page.drawText(text, { x: 50, y, size, font, color: rgb(color[0], color[1], color[2]) });
        y -= size + 6;
      }

      function checkPage() {
        if (y < 80) {
          page = doc.addPage([612, 792]);
          y = height - 50;
        }
      }

      addLine("Nuvora — Email Auth Report", { bold: true, size: 18, color: [0.1, 0.1, 0.1] });
      addLine("");
      addLine(`Report generated: ${new Date().toLocaleString()}`, { size: 9, color: [0.5, 0.5, 0.5] });
      addLine("");

      addLine(`Domain: ${result.domain}`, { bold: true, size: 14 });
      addLine(`Lookup Type: ${info.name}`, { size: 11 });
      addLine(`Records Found: ${result.records.length}`, { size: 11 });
      addLine("");

      const score = result.spfScore?.score ?? result.dmarcAnalysis?.score ?? result.dkimScore?.score ?? result.bimiValidation?.score;
      if (score !== undefined && score !== null) {
        addLine(`Score: ${score}/100`, { bold: true, size: 14, color: score >= 70 ? [0.1, 0.6, 0.1] : score >= 40 ? [0.7, 0.5, 0.1] : [0.7, 0.1, 0.1] });
        addLine("");
      }

      addLine("Records", { bold: true, size: 13 });
      checkPage();
      if (result.records.length === 0) {
        addLine("  No records found.", { color: [0.5, 0.5, 0.5] });
      } else {
        result.records.forEach((r, i) => {
          checkPage();
          addLine(`  Record ${i + 1}:`, { bold: true, size: 10 });
          const lines = r.match(/.{1,100}/g) || [r];
          lines.forEach((l) => addLine(`    ${l}`, { size: 8, color: [0.3, 0.3, 0.3] }));
        });
      }
      addLine("");

      if (warnings.length > 0) {
        checkPage();
        addLine("Analysis & Recommendations", { bold: true, size: 13 });
        warnings.forEach((w) => {
          checkPage();
          const prefix = w.type === "error" ? "ERROR" : w.type === "warning" ? "WARNING" : "INFO";
          addLine(`  [${prefix}] ${w.text}`, { size: 9, color: w.type === "error" ? [0.7, 0.1, 0.1] : w.type === "warning" ? [0.7, 0.5, 0.1] : [0.1, 0.3, 0.6] });
        });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${info.name.toLowerCase()}-report-${result.domain}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  }, [result, info, warnings]);

  const comparisonResult = result?.comparison;

  return (
    <div className="mx-auto max-w-3xl space-y-5" role="region" aria-label={`${title} tool`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={`${lookupType}-domain`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Domain</label>
          <Input
            id={`${lookupType}-domain`}
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={placeholder || "example.com"}
            onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }}
          />
        </div>
        <div className="flex-1">
          <label htmlFor={`${lookupType}-domain2`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Compare with (optional)</label>
          <Input
            id={`${lookupType}-domain2`}
            type="text"
            value={domain2}
            onChange={(e) => setDomain2(e.target.value)}
            placeholder="example.org"
            onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }}
          />
        </div>
        {showSelector && (
          <div className="sm:w-48">
            <label htmlFor={`${lookupType}-selector`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{selectorLabel || "Selector"}</label>
            <Input
              id={`${lookupType}-selector`}
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="auto"
              onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }}
            />
          </div>
        )}
        <div className="flex items-end">
          <Button onClick={handleLookup} disabled={loading || !domain.trim()}>
            {loading ? "Looking up..." : "Lookup"}
          </Button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-zinc-400">Recent:</span>
          {history.slice(0, 5).map((d) => (
            <button key={d} type="button" onClick={() => { setDomain(d); }} className="rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">{d}</button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={() => setShowBeginner(!showBeginner)} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400" aria-expanded={showBeginner}>
          {showBeginner ? "Hide" : "Show"} beginner guide
        </button>
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400" aria-expanded={showAdvanced}>
          {showAdvanced ? "Hide" : "Show"} advanced mode
        </button>
      </div>

      {showBeginner && beginnerGuide && beginnerGuide.length > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800 dark:bg-blue-950">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">What is a {info.name} record?</p>
          <p className="mb-3 text-sm text-blue-800 dark:text-blue-200">{info.desc} ({info.rfc})</p>
          <div className="space-y-2">
            {beginnerGuide.map((g, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">{g.title}</summary>
                <p className="mt-1 pl-4 text-sm text-blue-800 dark:text-blue-200">{g.content}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {showAdvanced && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Developer Mode</p>
          <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <p>API: <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-700">GET /api/email?type={lookupType}&domain=example.com{showSelector ? "&selector=auto" : ""}</code></p>
            <p>CLI: <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-700">nslookup -type=TXT {lookupType === "dmarc" ? "_dmarc." : lookupType === "bimi" ? "default._bimi." : lookupType === "dkim" ? "default._domainkey." : ""}example.com</code></p>
            {lookupType === "mx" && <p>CLI: <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-700">nslookup -type=MX example.com</code></p>}
            {result && <p className="mt-2 font-mono text-zinc-400">Raw result: {JSON.stringify(result, null, 2).slice(0, 500)}</p>}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" role="alert">
          {error}
        </div>
      )}

      {result && !comparisonResult && (
        <>
          {result.type !== "DELIVERABILITY" && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{result.type} Records for {result.domain}</p>
                    <p className="mt-0.5 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.records.length}</p>
                    <p className="text-xs text-zinc-500">{result.records.length === 1 ? "record found" : "records found"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(result.spfScore || result.dmarcAnalysis || result.dkimScore || (result.bimiValidation && result.bimiValidation.score !== undefined)) && (
                      <ScoreBadge score={result.spfScore?.score ?? result.dmarcAnalysis?.score ?? result.dkimScore?.score ?? result.bimiValidation?.score ?? 0} />
                    )}
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={pdfLoading}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                      {pdfLoading ? "Generating..." : "Download Report"}
                    </button>
                    {reportData && (
                      <ResultExport
                        rawData={reportData}
                        fileName={`${info.name.toLowerCase()}-lookup-${result.domain}`}
                        displayName={`${info.name} Lookup - ${result.domain}`}
                        formatAsText={formatText}
                        formatAsCsv={formatCsv}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Score breakdown */}
              {result.spfScore && (
                <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                  <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">SPF Score Breakdown</p>
                  {result.spfScore.breakdown.map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-0.5 text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">{b.reason}</span>
                      <span className={`font-bold ${b.points >= 0 ? "text-green-600" : "text-red-600"}`}>{b.points >= 0 ? `+${b.points}` : b.points}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.dmarcAnalysis && (
                <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                  <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">DMARC Policy Analysis</p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {Object.entries(result.dmarcAnalysis.tags).map(([k, v]) => (
                      <span key={k} className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{k}={v}</span>
                    ))}
                  </div>
                  {result.dmarcAnalysis.strengths.length > 0 && (
                    <div className="mb-1 space-y-0.5">
                      <p className="text-[11px] font-medium text-green-600">Strengths</p>
                      {result.dmarcAnalysis.strengths.map((s, i) => (
                        <p key={i} className="text-xs text-green-700 dark:text-green-400">✓ {s}</p>
                      ))}
                    </div>
                  )}
                  {result.dmarcAnalysis.weaknesses.length > 0 && (
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-medium text-red-600">Weaknesses</p>
                      {result.dmarcAnalysis.weaknesses.map((w, i) => (
                        <p key={i} className="text-xs text-red-700 dark:text-red-400">✗ {w}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {result.dkimSelectors && (
                <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                  <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">DKIM Selector Detection</p>
                  <p className="mb-2 text-xs text-zinc-500">Probed {result.dkimSelectors.length} common selectors. Found {result.dkimSelectors.filter((s) => s.found).length} valid.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.dkimSelectors.filter((s) => s.found).map((s) => (
                      <span key={s.selector} className="rounded bg-green-100 px-2 py-0.5 text-xs font-mono text-green-700 dark:bg-green-900/30 dark:text-green-400" title={s.keySize ? `${s.keyType} ${s.keySize}-bit` : s.keyType}>
                        {s.selector}{s.keySize ? ` (${s.keySize}b)` : ""}
                      </span>
                    ))}
                    {result.dkimSelectors.filter((s) => !s.found).slice(0, 10).map((s) => (
                      <span key={s.selector} className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono text-zinc-400 dark:bg-zinc-800">-{s.selector}</span>
                    ))}
                  </div>
                  {result.dkimScore && (
                    <div className="mt-2 border-t border-zinc-200 pt-2 dark:border-zinc-800">
                      <p className="mb-1 text-xs font-semibold text-zinc-500">DKIM Score Breakdown</p>
                      {result.dkimScore.breakdown.map((b, i) => (
                        <div key={i} className="flex items-center justify-between py-0.5 text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">{b.reason}</span>
                          <span className={`font-bold ${b.points >= 0 ? "text-green-600" : "text-red-600"}`}>{b.points >= 0 ? `+${b.points}` : b.points}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {result.bimiValidation && (
                <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                  <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">BIMI Validation</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${result.bimiValidation.hasSVG ? "bg-green-500" : "bg-red-500"}`} />
                      <span>{result.bimiValidation.hasSVG ? "SVG logo configured" : "No SVG logo"}</span>
                    </div>
                    {result.bimiValidation.svgUrl && (
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${result.bimiValidation.svgAccessible ? "bg-green-500" : result.bimiValidation.svgAccessible === false ? "bg-red-500" : "bg-zinc-300"}`} />
                        <span className="truncate" title={result.bimiValidation.svgUrl}>SVG accessible: {result.bimiValidation.svgAccessible ? "Yes" : "No"}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${result.bimiValidation.hasAuthority ? "bg-green-500" : "bg-zinc-300"}`} />
                      <span>{result.bimiValidation.hasAuthority ? "VMC configured" : "No VMC"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${result.bimiValidation.dmarcEnforced ? "bg-green-500" : "bg-red-500"}`} />
                      <span>DMARC enforced: {result.bimiValidation.dmarcEnforced ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  {result.bimiValidation.svgError && (
                    <p className="mt-1 text-xs text-red-500">SVG error: {result.bimiValidation.svgError}</p>
                  )}
                  {result.bimiValidation.authorityError && (
                    <p className="mt-1 text-xs text-red-500">Authority error: {result.bimiValidation.authorityError}</p>
                  )}
                </div>
              )}

              {warnings.length > 0 && (
                <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    {warnings.map((w, i) => (
                      <div key={i} className={`flex items-start gap-2 text-xs ${w.type === "error" ? "text-red-600 dark:text-red-400" : w.type === "warning" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>
                        <span className="mt-0.5 shrink-0">{w.type === "error" ? "✕" : w.type === "warning" ? "!" : "i"}</span>
                        <span>{w.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {result.records.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-zinc-500">
                    No {result.type} records found for {result.domain}.
                  </div>
                ) : (
                  result.records.map((record, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-400">Record {i + 1}</span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-all text-sm text-zinc-900 dark:text-zinc-50">{record}</pre>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(record)}
                          className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          aria-label="Copy record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {result.raw && result.raw.length > result.records.length && (
                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs text-zinc-500">
                    {result.raw.length - result.records.length} additional TXT record{result.raw.length - result.records.length !== 1 ? "s" : ""} found (non-{result.type})
                  </p>
                </div>
              )}

              {showAdvanced && result.raw && (
                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="mb-1 text-[11px] font-medium text-zinc-500">Raw DNS Response</p>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs text-zinc-400">All TXT records: {JSON.stringify(result.raw)}</pre>
                </div>
              )}
            </div>
          )}

          {result.type === "DELIVERABILITY" && result.deliverabilityScore && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Email Deliverability Score</p>
                    <p className={`mt-1 text-3xl font-bold ${result.deliverabilityScore.overall >= 70 ? "text-green-600" : result.deliverabilityScore.overall >= 40 ? "text-amber-600" : "text-red-600"}`}>
                      {result.deliverabilityScore.overall}/100
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={pdfLoading}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                    {pdfLoading ? "Generating..." : "Download Report"}
                  </button>
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                {Object.entries(result.deliverabilityScore.categories).map(([key, cat]) => (
                  <ScoreBar key={key} score={Math.round((cat.score / cat.max) * 100)} label={cat.label} />
                ))}
              </div>
              <div className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
                <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Details</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {result.spfScore && (
                    <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">SPF</p>
                      <p className="text-zinc-500">{result.spfScore.breakdown.map((b) => b.reason).join("; ")}</p>
                    </div>
                  )}
                  {result.dkimScore && (
                    <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">DKIM</p>
                      <p className="text-zinc-500">{result.dkimScore.breakdown.map((b) => b.reason).join("; ")}</p>
                    </div>
                  )}
                  {result.dmarcAnalysis && (
                    <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">DMARC</p>
                      <p className="text-zinc-500">{result.dmarcAnalysis.strengths.concat(result.dmarcAnalysis.weaknesses).join("; ")}</p>
                    </div>
                  )}
                  {result.bimiValidation && (
                    <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">BIMI</p>
                      <p className="text-zinc-500">{result.bimiValidation.dmarcEnforced ? "DMARC enforced" : "DMARC not enforced"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="my-5">
            <AiExplain
              toolName={`${lookupType}-lookup`}
              analysis={{
                issues: dynamicRecommendations.length > 0
                  ? dynamicRecommendations.map(w => ({ severity: w.type, message: w.text }))
                  : warnings.length > 0
                    ? warnings.map(w => ({ severity: w.type, message: w.text }))
                    : undefined,
                recommendations: dynamicRecommendations.length > 0
                  ? dynamicRecommendations.map(w => w.text)
                  : warnings.filter(w => w.type === "error" || w.type === "warning").map(w => w.text),
              }}
            />
          </div>
        </>
      )}

      {comparisonResult && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Domain Comparison</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Comparing {comparisonResult.domain1} vs {comparisonResult.domain2}
            </p>
          </div>

          {comparisonResult.overall && (
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Overall Deliverability</p>
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-lg border p-3 ${comparisonResult.overall.winner === comparisonResult.domain1 ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20" : "border-zinc-200 dark:border-zinc-700"}`}>
                  <p className="text-xs font-medium text-zinc-500">{comparisonResult.domain1}</p>
                  <p className={`text-2xl font-bold ${comparisonResult.overall.domain1.overall >= 70 ? "text-green-600" : comparisonResult.overall.domain1.overall >= 40 ? "text-amber-600" : "text-red-600"}`}>
                    {comparisonResult.overall.domain1.overall}/100
                  </p>
                  {comparisonResult.overall.winner === comparisonResult.domain1 && <p className="text-xs text-green-600 font-medium mt-1">Winner</p>}
                </div>
                <div className={`rounded-lg border p-3 ${comparisonResult.overall.winner === comparisonResult.domain2 ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20" : "border-zinc-200 dark:border-zinc-700"}`}>
                  <p className="text-xs font-medium text-zinc-500">{comparisonResult.domain2}</p>
                  <p className={`text-2xl font-bold ${comparisonResult.overall.domain2.overall >= 70 ? "text-green-600" : comparisonResult.overall.domain2.overall >= 40 ? "text-amber-600" : "text-red-600"}`}>
                    {comparisonResult.overall.domain2.overall}/100
                  </p>
                  {comparisonResult.overall.winner === comparisonResult.domain2 && <p className="text-xs text-green-600 font-medium mt-1">Winner</p>}
                </div>
              </div>
            </div>
          )}

          {Object.entries(comparisonResult.comparisons).map(([key, comp]) => (
            <div key={key} className="border-b border-zinc-200 px-5 py-4 last:border-b-0 dark:border-zinc-800">
              <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{key.toUpperCase()}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-lg border p-2 ${comp.winner === comparisonResult.domain1 ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10" : "border-zinc-200 dark:border-zinc-700"}`}>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{comparisonResult.domain1}</p>
                  <pre className="mt-1 text-xs text-zinc-500 whitespace-pre-wrap">{JSON.stringify(comp.domain1, null, 1)}</pre>
                </div>
                <div className={`rounded-lg border p-2 ${comp.winner === comparisonResult.domain2 ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10" : "border-zinc-200 dark:border-zinc-700"}`}>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{comparisonResult.domain2}</p>
                  <pre className="mt-1 text-xs text-zinc-500 whitespace-pre-wrap">{JSON.stringify(comp.domain2, null, 1)}</pre>
                </div>
              </div>
              {comp.winner && (
                <p className="mt-2 text-xs text-green-600 font-medium">Better: {comp.winner}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
