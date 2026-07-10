"use client";

import { useState, useCallback } from "react";
import { Button, Input } from "@/components/ui";
import { StatusBadge } from "@/components/shared";
import { cn } from "@/lib/utils";

type Grade = "S" | "A" | "B" | "C" | "D" | "F";

interface CategoryResult {
  key: string;
  label: string;
  icon: string;
  score: number;
  status: "good" | "warning" | "critical";
  statusLabel: string;
  detail: string;
}

interface ReportResult {
  domain: string;
  overallGrade: Grade;
  overallScore: number;
  categories: CategoryResult[];
  recommendations: string[];
  timestamp: number;
}

const GRADE_META: Record<Grade, { label: string; desc: string; border: string; text: string; glow: string }> = {
  S: { label: "S", desc: "Exceptional", border: "border-emerald-400", text: "text-emerald-600 dark:text-emerald-400", glow: "shadow-emerald-500/25" },
  A: { label: "A", desc: "Excellent", border: "border-green-400", text: "text-green-600 dark:text-green-400", glow: "shadow-green-500/25" },
  B: { label: "B", desc: "Good", border: "border-amber-400", text: "text-amber-600 dark:text-amber-400", glow: "shadow-amber-500/25" },
  C: { label: "C", desc: "Fair", border: "border-orange-400", text: "text-orange-600 dark:text-orange-400", glow: "shadow-orange-500/25" },
  D: { label: "D", desc: "Poor", border: "border-red-400", text: "text-red-500 dark:text-red-400", glow: "shadow-red-500/25" },
  F: { label: "F", desc: "Failing", border: "border-red-600", text: "text-red-600 dark:text-red-400", glow: "shadow-red-600/30" },
};

const CACHE_PREFIX = "drc-";
const CACHE_TTL = 300_000;

function getCache(domain: string): ReportResult | null {
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${domain}`);
    if (!raw) return null;
    const data: ReportResult = JSON.parse(raw);
    if (Date.now() - data.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(`${CACHE_PREFIX}${domain}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(domain: string, data: ReportResult) {
  try { sessionStorage.setItem(`${CACHE_PREFIX}${domain}`, JSON.stringify(data)); } catch { }
}

function computeGrade(score: number): Grade {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function checkDns(hostname: string): Promise<CategoryResult> {
  try {
    const data = await fetchJson(`/api/dns-lookup?hostname=${encodeURIComponent(hostname)}`);
    const ok = data.records?.length > 0;
    return { key: "dns", label: "DNS Health", icon: "🌐", score: ok ? 100 : 40, status: ok ? "good" : "warning", statusLabel: ok ? "Resolves" : "No Records", detail: ok ? `${data.records.length} record types resolved` : "No DNS records found — domain may not exist" };
  } catch (e) {
    return { key: "dns", label: "DNS Health", icon: "🌐", score: 0, status: "critical", statusLabel: "Failed", detail: e instanceof Error ? e.message : "DNS query failed" };
  }
}

async function checkSsl(host: string): Promise<CategoryResult> {
  try {
    const data = await fetchJson(`/api/ssl-certificate?host=${encodeURIComponent(host)}`);
    const c = data.certificate;
    const d = c.daysRemaining;
    const score = d > 30 ? 100 : d > 0 ? 60 : 10;
    return { key: "ssl", label: "SSL / TLS", icon: "🔒", score, status: d > 30 ? "good" : d > 0 ? "warning" : "critical", statusLabel: d > 0 ? `${d} days` : "Expired", detail: d > 0 ? `Valid until ${new Date(c.validTo).toLocaleDateString()}` : "Certificate is expired or invalid" };
  } catch (e) {
    return { key: "ssl", label: "SSL / TLS", icon: "🔒", score: 0, status: "critical", statusLabel: "Failed", detail: e instanceof Error ? e.message : "SSL check failed" };
  }
}

async function checkHttp(url: string): Promise<CategoryResult> {
  try {
    const data = await fetchJson(`/api/http-headers?url=https://${encodeURIComponent(url)}`);
    const wanted = ["strict-transport-security", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"];
    const found = wanted.filter(h => data.headers?.[h]).length;
    const score = Math.round((found / wanted.length) * 100);
    return { key: "http", label: "HTTP Headers", icon: "📋", score, status: score >= 80 ? "good" : score >= 40 ? "warning" : "critical", statusLabel: `${found}/${wanted.length}`, detail: found > 0 ? `${found} of ${wanted.length} security headers present` : "No security headers detected" };
  } catch (e) {
    return { key: "http", label: "HTTP Headers", icon: "📋", score: 0, status: "critical", statusLabel: "Failed", detail: e instanceof Error ? e.message : "Headers check failed" };
  }
}

async function checkWhois(domain: string): Promise<CategoryResult> {
  try {
    const data = await fetchJson(`/api/whois?domain=${encodeURIComponent(domain)}`);
    const raw = data.data || "";
    const expired = /Expir|expir/i.test(raw);
    const notFound = /No match|not found|no data found|Domain not found/i.test(raw);
    if (notFound) return { key: "whois", label: "WHOIS", icon: "📝", score: 0, status: "critical", statusLabel: "Not Found", detail: "Domain not found in WHOIS database" };
    const score = expired ? 100 : 50;
    return { key: "whois", label: "WHOIS", icon: "📝", score, status: expired ? "good" : "warning", statusLabel: expired ? "Registered" : "Check Expiry", detail: expired ? "Domain is registered and active" : "Could not verify expiration status" };
  } catch (e) {
    return { key: "whois", label: "WHOIS", icon: "📝", score: 0, status: "critical", statusLabel: "Failed", detail: e instanceof Error ? e.message : "WHOIS lookup failed" };
  }
}

async function checkStatus(url: string): Promise<CategoryResult> {
  try {
    const data = await fetchJson(`/api/website-status?url=https://${encodeURIComponent(url)}`);
    const online = data.statusLabel === "Online";
    const redirect = data.statusLabel === "Redirect";
    const score = online ? 100 : redirect ? 70 : 20;
    return { key: "status", label: "Website Status", icon: "⚡", score, status: online ? "good" : redirect ? "warning" : "critical", statusLabel: online ? "Online" : redirect ? "Redirect" : "Offline", detail: online ? `HTTP ${data.statusCode} — server is responding` : redirect ? `Redirect (HTTP ${data.statusCode})` : "Website is not reachable" };
  } catch (e) {
    return { key: "status", label: "Website Status", icon: "⚡", score: 0, status: "critical", statusLabel: "Offline", detail: e instanceof Error ? e.message : "Website unreachable" };
  }
}

async function checkPing(host: string): Promise<CategoryResult> {
  try {
    const data = await fetchJson(`/api/ping-test?host=${encodeURIComponent(host)}`);
    const loss = data.packetLoss ?? 100;
    const avg = data.avg ?? 0;
    let score = 0;
    if (loss < 100) {
      if (avg < 50) score = 100;
      else if (avg < 100) score = 80;
      else if (avg < 200) score = 60;
      else if (avg < 500) score = 40;
      else score = 20;
    }
    return { key: "ping", label: "Response Time", icon: "📡", score, status: score >= 80 ? "good" : score >= 40 ? "warning" : "critical", statusLabel: loss >= 100 ? "Timeout" : `${avg}ms`, detail: loss >= 100 ? "Host did not respond within timeout" : `${avg}ms avg · ${data.min}–${data.max}ms range · ${loss}% loss` };
  } catch (e) {
    return { key: "ping", label: "Response Time", icon: "📡", score: 0, status: "critical", statusLabel: "Failed", detail: e instanceof Error ? e.message : "Ping test failed" };
  }
}

function buildRecs(categories: CategoryResult[]): string[] {
  const r: string[] = [];
  for (const c of categories) {
    if (c.status === "critical") r.push(`Fix ${c.label}: ${c.detail}.`);
    else if (c.status === "warning") r.push(`Improve ${c.label}: ${c.detail}.`);
  }
  if (r.length === 0) r.push("All checks passed — your domain is in excellent health!");
  return r;
}

export function DomainReportCard() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ReportResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [searchedDomain, setSearchedDomain] = useState("");


  const runChecks = useCallback(async (raw: string) => {
    const d = raw.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split("?")[0];
    if (!d) return;
    const cached = getCache(d);
    if (cached) { setResults(cached); setSearchedDomain(d); return; }
    setLoading(true); setError(""); setSearchedDomain(d);
    try {
      const cats = await Promise.all([checkDns(d), checkSsl(d), checkHttp(d), checkWhois(d), checkStatus(d), checkPing(d)]);
      const score = Math.round(cats.reduce((s, c) => s + c.score, 0) / 6);
      const grade = computeGrade(score);
      const recs = buildRecs(cats);
      const result: ReportResult = { domain: d, overallGrade: grade, overallScore: score, categories: cats, recommendations: recs, timestamp: Date.now() };
      setCache(d, result);
      setResults(result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }, []);

  const inputRefCallback = useCallback((el: HTMLInputElement | null) => {
    if (el) {
      el.focus();
      const d = new URLSearchParams(window.location.search).get("domain");
      if (d) {
        setDomain(d);
        setTimeout(() => runChecks(d), 100);
      }
    }
  }, [runChecks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    runChecks(domain);
    const url = new URL(window.location.href);
    url.searchParams.set("domain", domain.trim().toLowerCase());
    window.history.replaceState({}, "", url.toString());
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/domain-report?domain=${encodeURIComponent(searchedDomain)}`;
    const text = `I checked ${searchedDomain} and it scored ${results?.overallGrade} (${results?.overallScore}%) on Nuvora Domain Report Card! Check yours →`;
    if (navigator.share) {
      try { await navigator.share({ title: `${searchedDomain} Domain Report`, text, url: shareUrl }); return; } catch { }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gm = results ? GRADE_META[results.overallGrade] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Domain Report Card
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Grade your domain&apos;s health across DNS, SSL, HTTP headers, WHOIS, status & response time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-xl gap-3">
        <Input ref={inputRefCallback} type="text" placeholder="example.com" value={domain} onChange={e => setDomain(e.target.value)} className="flex-1 text-center text-lg" />
        <Button type="submit" size="lg" disabled={loading || !domain.trim()}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Checking
            </span>
          ) : "Check Domain"}
        </Button>
      </form>

      {error && <div className="mx-auto mt-6 max-w-xl rounded-lg bg-red-50 p-4 text-center text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}

      {loading && (
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="mt-3 h-8 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="mt-2 h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
      )}

      {results && !loading && (
        <div className="mt-14 space-y-10">
          {/* ── Report Card Header ── */}
          <div className={cn("relative overflow-hidden rounded-2xl border bg-white p-8 text-center shadow-lg dark:bg-zinc-900/50", gm?.border)}>
            <div className={cn("absolute inset-0 opacity-[0.04]", gm?.text)} style={{ background: `linear-gradient(135deg, currentColor 0%, transparent 100%)` }} />
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Overall Grade</p>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className={cn("relative flex size-32 items-center justify-center rounded-2xl border-[3px] bg-white text-7xl font-black shadow-xl dark:bg-zinc-900", gm?.border, gm?.text, `shadow-lg ${gm?.glow}`)}>
                {results.overallGrade}
              </div>
              <p className={cn("text-lg font-bold", gm?.text)}>{gm?.desc}</p>
            </div>
            <p className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">{results.domain}</p>
            <p className="mt-1 text-sm text-zinc-500">Score: {results.overallScore}% · {new Date(results.timestamp).toLocaleDateString()}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="secondary" size="sm" onClick={handleShare}>
                {copied ? (
                  <><svg className="mr-1.5 size-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5" /></svg>Copied!</>
                ) : (
                  <><svg className="mr-1.5 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>Share Report Card</>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setResults(null); setDomain(""); setSearchedDomain(""); window.history.replaceState({}, "", "/domain-report"); }}>
                Check Another
              </Button>
            </div>
          </div>

          {/* ── Category Cards ── */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.categories.map((cat, i) => (
              <div key={cat.key} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50" style={{ animation: `fade-slide-up 0.4s ease-out ${i * 0.08}s both` }}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{cat.icon}</span>
                  <StatusBadge status={cat.status} label={cat.statusLabel} />
                </div>
                <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{cat.label}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Score</span>
                    <span className={cn("font-bold", cat.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : cat.score >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>{cat.score}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className={cn("h-full rounded-full transition-all duration-700", cat.score >= 80 ? "bg-emerald-500" : cat.score >= 40 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${cat.score}%` }} />
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">{cat.detail}</p>
              </div>
            ))}
          </div>

          {/* ── Recommendations ── */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
              <svg className="size-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              Recommendations
            </h2>
            <ul className="mt-4 space-y-2">
              {results.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className={cn("mt-0.5 size-1.5 shrink-0 rounded-full", results.overallGrade === "S" || results.overallGrade === "A" ? "bg-emerald-500" : "bg-blue-500")} />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
