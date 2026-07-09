import { NextResponse } from "next/server";
import dns from "dns/promises";
import net from "net";

export const dynamic = "force-dynamic";

async function resolveTxt(name: string): Promise<string[]> {
  try { return (await dns.resolveTxt(name)).map((r) => r.join("")); } catch { return []; }
}

async function resolve4(name: string): Promise<string[]> {
  try { return await dns.resolve4(name); } catch { return []; }
}

// ── Existing DNS tools ─────────────────────────────────────────────

async function lookupDNSSEC(domain: string) {
  try {
    const dnskeys: any = await dns.resolve(domain, "DNSKEY").catch(() => []);
    const rrsigs: any = await dns.resolve(domain, "RRSIG").catch(() => []);
    const ds: any = await dns.resolve(domain, "DS").catch(() => []);
    return {
      type: "DNSSEC", domain,
      hasDNSKEY: Array.isArray(dnskeys) && dnskeys.length > 0,
      hasRRSIG: Array.isArray(rrsigs) && rrsigs.length > 0,
      hasDS: Array.isArray(ds) && ds.length > 0,
      signed: Array.isArray(dnskeys) && Array.isArray(rrsigs) && dnskeys.length > 0 && rrsigs.length > 0,
      dnskeys: Array.isArray(dnskeys) ? dnskeys.map((k: any) => `${k.flags} ${k.algorithm} ${k.key}`) : [],
      dsRecords: Array.isArray(ds) ? ds.map((d: any) => `${d.keyTag} ${d.algorithm} ${d.digestType} ${d.digest}`) : [],
    };
  } catch { return { type: "DNSSEC", domain, signed: false, error: "Unable to resolve DNSSEC records" }; }
}

async function lookupCAA(domain: string) {
  try {
    const records = await dns.resolveCaa(domain);
    return { type: "CAA", domain, records: Array.isArray(records) ? records.map((r: any) => `${r.flags} ${r.tag} "${r.value}"`) : [] };
  } catch { return { type: "CAA", domain, records: [] }; }
}

async function lookupNameservers(domain: string) {
  try {
    const ns = await dns.resolveNs(domain);
    const results = [];
    for (const nsHost of ns) {
      try {
        const ips = await dns.resolve4(nsHost);
        results.push({ hostname: nsHost, ips, reachable: ips.length > 0 });
      } catch {
        results.push({ hostname: nsHost, ips: [], reachable: false });
      }
    }
    return { type: "Nameserver", domain, nameservers: results };
  } catch { return { type: "Nameserver", domain, nameservers: [], error: "Unable to resolve nameservers" }; }
}

async function lookupZone(domain: string) {
  const types = ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA"];
  const results: Record<string, any> = {};
  for (const t of types) {
    try { const records = await dns.resolve(domain, t as any); results[t] = records; }
    catch { results[t] = null; }
  }
  const issues: string[] = [];
  if (!results.A && !results.AAAA) issues.push("No A or AAAA records found");
  if (results.MX === null) issues.push("No MX records found (may not need email)");
  if (results.SOA === null) issues.push("No SOA record found");
  if (results.NS === null) issues.push("No NS records found");
  return { type: "Zone Validation", domain, records: results, issues };
}

async function lookupEmailDeliverability(domain: string) {
  const spf = (await resolveTxt(domain)).filter((r) => r.startsWith("v=spf1"));
  const dmarc = (await resolveTxt(`_dmarc.${domain}`)).filter((r) => r.startsWith("v=DMARC1"));
  const mx = await (async () => {
    try { return (await dns.resolveMx(domain)).sort((a, b) => a.priority - b.priority).map((r) => `${r.priority} ${r.exchange}`); }
    catch { return []; }
  })();
  const dkimSelectors = ["google", "selector1", "selector2", "default", "s1", "s2"];
  const dkim: string[] = [];
  for (const sel of dkimSelectors) {
    const recs = await resolveTxt(`${sel}._domainkey.${domain}`);
    if (recs.length > 0) dkim.push(...recs.map((r) => `${sel}: ${r}`));
  }
  const ptr = await (async () => {
    try {
      const a = await dns.resolve4(domain);
      if (a.length > 0) {
        const rev = a[0].split(".").reverse().join(".") + ".in-addr.arpa";
        const ptrRecs = await resolveTxt(rev); return ptrRecs;
      }
    } catch { /* noop */ }
    return [];
  })();
  const issues: string[] = [];
  if (spf.length === 0) issues.push("No SPF record — domain is vulnerable to spoofing");
  if (dmarc.length === 0) issues.push("No DMARC record — no control over unauthenticated email");
  if (dmarc.length > 0 && dmarc[0].includes("p=none")) issues.push("DMARC is set to p=none (monitor only) — no enforcement");
  if (mx.length === 0) issues.push("No MX records — domain cannot receive email");
  if (dkim.length === 0) issues.push("No DKIM records found on common selectors");
  if (ptr.length === 0) issues.push("No PTR record for the domain's A record — may affect deliverability");
  return { type: "Email Deliverability", domain, spf, dkim, dmarc, mx, ptr, issues, score: Math.max(0, 100 - issues.length * 15) };
}

// ── New Sprint 25 tools ────────────────────────────────────────────

const DNSBLS = [
  { name: "Spamhaus ZEN", host: "zen.spamhaus.org" },
  { name: "Spamhaus DBL", host: "dbl.spamhaus.org" },
  { name: "SpamCop", host: "bl.spamcop.net" },
  { name: "Barracuda", host: "b.barracudacentral.org" },
  { name: "SORBS", host: "dnsbl.sorbs.net" },
  { name: "NJABL", host: "dnsbl.njabl.org" },
  { name: "AHBL", host: "dnsbl.ahbl.org" },
  { name: "IX.DNSBL", host: "dnsbl.ix.dnsbl.manitu.net" },
  { name: "UCEPROTECT Level 1", host: "dnsbl-1.uceprotect.net" },
  { name: "URIBL", host: "uribl.spameatingmonkey.net" },
  { name: "CBL", host: "cbl.abuseat.org" },
  { name: "PSBL", host: "psbl.surriel.com" },
];

async function lookupBlacklist(ip: string) {
  const results: { name: string; host: string; listed: boolean }[] = [];
  const reversed = ip.split(".").reverse().join(".");
  for (const bl of DNSBLS) {
    try {
      await dns.resolve4(`${reversed}.${bl.host}`);
      results.push({ name: bl.name, host: bl.host, listed: true });
    } catch {
      results.push({ name: bl.name, host: bl.host, listed: false });
    }
  }
  const listed = results.filter((r) => r.listed);
  return { type: "Blacklist Check", ip, listedCount: listed.length, total: results.length, listed, results };
}

async function lookupMtaSts(domain: string) {
  const txt = await resolveTxt(`_mta-sts.${domain}`);
  const policyUrl = `https://mta-sts.${domain}/.well-known/mta-sts.txt`;
  let policy: string | null = null;
  try {
    const res = await fetch(policyUrl, { signal: AbortSignal.timeout(5000) });
    if (res.ok) policy = await res.text();
  } catch { policy = null; }
  const valid = txt.some((r) => r.startsWith("v=STSv1"));
  return { type: "MTA-STS", domain, records: txt, valid, policy, policyUrl };
}

async function lookupASN(ip: string) {
  try {
    const res = await fetch(`https://rdap.arin.net/registry/ip/${ip}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { type: "ASN", ip, error: "Unable to resolve ASN" };
    const data = await res.json();
    const asn = data?.entities?.find((e: any) => e.roles?.includes("registrant"));
    const asnNumber = data?.handle || "N/A";
    return { type: "ASN", ip, asn: asnNumber, name: asn?.vcardArray?.[1]?.[1]?.[3] || "Unknown", org: data?.name || "Unknown" };
  } catch {
    try {
      const res = await fetch(`https://ipinfo.io/${ip}/json`, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      return { type: "ASN", ip, asn: data.org || "N/A", name: data.org || "N/A", org: data.org || "Unknown" };
    } catch {
      return { type: "ASN", ip, error: "Unable to resolve ASN" };
    }
  }
}

async function lookupSRV(domain: string, service: string, protocol: string) {
  const name = `_${service}._${protocol}.${domain}`;
  try {
    const records = await dns.resolveSrv(name);
    return { type: "SRV", domain, service, protocol, records: records.map((r) => `${r.priority} ${r.weight} ${r.port} ${r.name}`) };
  } catch { return { type: "SRV", domain, service, protocol, records: [] }; }
}

async function lookupTlsrpt(domain: string) {
  const txt = await resolveTxt(`_smtp._tls.${domain}`);
  const valid = txt.some((r) => r.startsWith("v=TLSRPTv1"));
  return { type: "TLSRPT", domain, records: txt, valid };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const domain = searchParams.get("domain")?.trim().toLowerCase();
    const query = searchParams.get("query")?.trim().toLowerCase();
    const service = searchParams.get("service")?.trim() || "";
    const protocol = searchParams.get("protocol")?.trim() || "";

    const input = domain || query || "";

    if (!input) return NextResponse.json({ error: "Domain, query, or IP is required" }, { status: 400 });

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

    let result;
    switch (type) {
      // Existing tools
      case "dnssec":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        result = await lookupDNSSEC(input); break;
      case "caa":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        result = await lookupCAA(input); break;
      case "nameserver":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        result = await lookupNameservers(input); break;
      case "zone":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        result = await lookupZone(input); break;
      case "email-deliverability":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        result = await lookupEmailDeliverability(input); break;
      // New Sprint 25 tools
      case "blacklist":
        if (!ipRegex.test(input)) return NextResponse.json({ error: "Enter a valid IPv4 address" }, { status: 400 });
        result = await lookupBlacklist(input); break;
      case "mta-sts":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        result = await lookupMtaSts(input); break;
      case "asn":
        if (!ipRegex.test(input)) return NextResponse.json({ error: "Enter a valid IPv4 address" }, { status: 400 });
        result = await lookupASN(input); break;
      case "srv":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        if (!service || !protocol) return NextResponse.json({ error: "Service and protocol are required" }, { status: 400 });
        result = await lookupSRV(input, service, protocol); break;
      case "tlsrpt":
        if (!domainRegex.test(input)) return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
        result = await lookupTlsrpt(input); break;
      default: return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Lookup failed" }, { status: 500 });
  }
}
