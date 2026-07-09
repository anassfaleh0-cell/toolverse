import { NextResponse } from "next/server";
import dns from "dns/promises";
import net from "net";

export const dynamic = "force-dynamic";

interface LookupRequest {
  type: "spf" | "dkim" | "dmarc" | "bimi" | "mx" | "deliverability";
  domain: string;
  selector?: string;
  domain2?: string;
}

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

const COMMON_DKIM_SELECTORS = [
  "google", "selector1", "selector2", "default", "s1", "s2",
  "dkim", "mail", "mx", "zoho", "mandrill", "sparkpostmail",
  "sendgrid", "senseitg", "pm", "outbound", "marketing", "em",
  "smtp", "20230601", "20230101",
];

async function resolveTxt(hostname: string): Promise<string[]> {
  try {
    const records = await dns.resolveTxt(hostname);
    return records.map((r) => r.join(""));
  } catch {
    return [];
  }
}

async function resolveMx(hostname: string): Promise<{ priority: number; exchange: string }[]> {
  try {
    const records = await dns.resolveMx(hostname);
    return records.sort((a, b) => a.priority - b.priority);
  } catch {
    return [];
  }
}

async function resolveA(hostname: string): Promise<string[]> {
  try {
    const records = await dns.resolve4(hostname);
    return records;
  } catch {
    return [];
  }
}

async function resolvePtr(ip: string): Promise<string[]> {
  try {
    const hostname = ip.split(".").reverse().join(".") + ".in-addr.arpa";
    const records = await dns.resolvePtr(hostname);
    return records;
  } catch {
    try {
      const records = await dns.resolvePtr(ip);
      return records;
    } catch {
      return [];
    }
  }
}

async function fetchUrl(url: string): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : "Request failed" };
  }
}

function calculateSPFScore(records: string[]): SPFScore | null {
  if (records.length === 0) return null;
  const record = records[0];
  let score = 0;
  const breakdown: { reason: string; points: number }[] = [];

  score += 20;
  breakdown.push({ reason: "Valid SPF record exists", points: 20 });

  if (record.includes("-all")) {
    score += 20;
    breakdown.push({ reason: "Hard fail (-all) policy", points: 20 });
  } else if (record.includes("~all")) {
    score += 10;
    breakdown.push({ reason: "Soft fail (~all) policy", points: 10 });
  } else if (record.includes("?all")) {
    score += 5;
    breakdown.push({ reason: "Neutral (?all) policy", points: 5 });
  } else if (record.includes("+all")) {
    score -= 20;
    breakdown.push({ reason: "Pass all (+all) — insecure, allows any server to send as you", points: -20 });
  }

  const includes = (record.match(/\binclude:/g) || []).length;
  if (includes > 8) {
    score -= 20;
    breakdown.push({ reason: `>8 include statements (${includes}) — exceeds DNS lookup limit`, points: -20 });
  } else if (includes > 5) {
    score -= 10;
    breakdown.push({ reason: `>5 include statements (${includes}) — approaching DNS lookup limit`, points: -10 });
  }

  const validMechanisms = record.match(/\b(ip4:|ip6:|include:|a:|mx:)/g);
  if (validMechanisms && validMechanisms.length > 0) {
    score += 10;
    breakdown.push({ reason: `Well-formed mechanisms present (${validMechanisms.length} found)`, points: 10 });
  }

  return { score: Math.max(0, Math.min(100, score)), breakdown };
}

function analyzeDMARCPolicy(records: string[]): DMARCAnalysis | null {
  if (records.length === 0) return null;
  const record = records[0];
  const tags: Record<string, string> = {};
  const tagRegex = /(\w+)=([^;]+)/g;
  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(record)) !== null) {
    tags[match[1]] = match[2].trim();
  }

  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (tags.p === "reject") {
    score += 30;
    strengths.push("DMARC policy is p=reject — maximum protection against spoofing");
  } else if (tags.p === "quarantine") {
    score += 20;
    strengths.push("DMARC policy is p=quarantine — suspicious email sent to spam");
  } else if (tags.p === "none") {
    score -= 10;
    weaknesses.push("DMARC policy is p=none — monitoring only, no enforcement applied");
  } else {
    weaknesses.push("No valid DMARC policy tag (p=) found");
  }

  if (tags.sp === "reject") {
    score += 10;
    strengths.push("Subdomain policy (sp=reject) configured for maximum subdomain protection");
  } else if (tags.sp === "quarantine") {
    score += 5;
    strengths.push("Subdomain policy (sp=quarantine) configured");
  }

  if (!tags.rua) {
    score -= 10;
    weaknesses.push("No rua tag — aggregate DMARC reports not configured, no visibility into email sources");
  } else {
    strengths.push(`Aggregate reports configured (rua=${tags.rua})`);
  }

  if (tags.ruf) {
    strengths.push("Forensic reports configured (ruf) for detailed failure analysis");
  }

  const pct = tags.pct ? parseInt(tags.pct) : 100;
  if (pct === 100) {
    score += 10;
    strengths.push("Policy applies to 100% of email (pct=100)");
  } else {
    weaknesses.push(`Policy only applies to ${pct}% of email — some unauthenticated email gets through`);
  }

  if (tags.adkim === "s") {
    strengths.push("Strict DKIM alignment mode (adkim=s) — highest DKIM alignment security");
  }

  if (tags.aspf === "s") {
    strengths.push("Strict SPF alignment mode (aspf=s) — highest SPF alignment security");
  }

  if (tags.fo) {
    strengths.push(`Failure reporting options configured (fo=${tags.fo})`);
  }

  return {
    tags,
    score: Math.max(-20, Math.min(100, score)),
    strengths,
    weaknesses,
  };
}

async function probeDKIMSelectors(domain: string): Promise<{
  selectors: DKIMSelectorResult[];
  score: DKIMScore;
}> {
  const results: DKIMSelectorResult[] = [];
  let totalScore = 0;
  const breakdown: { reason: string; points: number }[] = [];
  let foundCount = 0;

  for (const selector of COMMON_DKIM_SELECTORS) {
    const hostname = `${selector}._domainkey.${domain}`;
    const records = await resolveTxt(hostname);
    if (records.length > 0) {
      const record = records[0];
      let keyType = "rsa";
      let keySize: number | undefined;
      const kMatch = record.match(/\bk=(\w+)/);
      if (kMatch) keyType = kMatch[1];
      const pMatch = record.match(/\bp=([A-Za-z0-9+/=]+)/);
      if (pMatch && keyType === "rsa") {
        const base64Len = pMatch[1].length;
        keySize = Math.round(base64Len * 0.75 * 8);
      }
      results.push({ selector, found: true, record: records[0], keyType, keySize });
      foundCount++;
    } else {
      results.push({ selector, found: false });
    }
  }

  if (foundCount > 0) {
    totalScore += 20 + Math.min(foundCount * 10, 40);
    breakdown.push({ reason: `${foundCount} DKIM selector(s) found`, points: 20 + Math.min(foundCount * 10, 40) });
    const bestResult = results.find((r) => r.found && r.keySize);
    if (bestResult) {
      if (bestResult.keySize && bestResult.keySize >= 2048) {
        totalScore += 20;
        breakdown.push({ reason: `Strong key (${bestResult.keySize}-bit RSA)`, points: 20 });
      } else if (bestResult.keySize && bestResult.keySize >= 1024) {
        totalScore += 10;
        breakdown.push({ reason: `Adequate key (${bestResult.keySize}-bit RSA)`, points: 10 });
      } else {
        totalScore += 5;
        breakdown.push({ reason: "Key present, size could not be determined", points: 5 });
      }
    }
    if (results.some((r) => r.found && r.keyType === "ed25519")) {
      totalScore += 10;
      breakdown.push({ reason: "Modern Ed25519 key found", points: 10 });
    }
  } else {
    breakdown.push({ reason: "No DKIM selectors found", points: 0 });
  }

  return {
    selectors: results,
    score: { score: Math.min(100, totalScore), breakdown },
  };
}

async function validateBIMI(
  records: string[],
  domain: string,
): Promise<BIMIValidation> {
  const result: BIMIValidation = {
    hasSVG: false,
    hasAuthority: false,
    dmarcEnforced: false,
    score: 0,
  };

  if (records.length === 0) return result;

  const record = records[0];
  const lMatch = record.match(/\bl=([^\s;]+)/);
  const aMatch = record.match(/\ba=([^\s;]+)/);

  if (lMatch) {
    result.hasSVG = true;
    result.svgUrl = lMatch[1];
    if (result.svgUrl.startsWith("https://")) {
      const svgCheck = await fetchUrl(result.svgUrl);
      result.svgAccessible = svgCheck.ok;
      if (!svgCheck.ok) {
        result.svgError = svgCheck.error || `HTTP ${svgCheck.status}`;
      }
    } else {
      result.svgError = "Logo URL must use HTTPS";
    }
  }

  if (aMatch) {
    result.hasAuthority = true;
    result.authorityUrl = aMatch[1];
    if (result.authorityUrl.startsWith("https://")) {
      const authCheck = await fetchUrl(result.authorityUrl);
      result.authorityValid = authCheck.ok;
      if (!authCheck.ok) {
        result.authorityError = authCheck.error || `HTTP ${authCheck.status}`;
      }
    } else {
      result.authorityError = "Authority URL must use HTTPS";
    }
  }

  const dmarcRecords = await resolveTxt(`_dmarc.${domain}`);
  const dmarcRecord = dmarcRecords.find((r) => r.startsWith("v=DMARC1"));
  if (dmarcRecord) {
    const policy = dmarcRecord.match(/\bp=(\w+)/);
    if (policy && (policy[1] === "quarantine" || policy[1] === "reject")) {
      result.dmarcEnforced = true;
    }
  }

  let score = 0;
  if (result.hasSVG) score += 20;
  if (result.svgAccessible) score += 20;
  if (result.hasAuthority) score += 15;
  if (result.authorityValid) score += 15;
  if (result.dmarcEnforced) score += 30;
  result.score = score;

  return result;
}

async function lookupPTR(domain: string): Promise<{ records: string[]; score: number }> {
  try {
    const ips = await resolveA(domain);
    const ptrResults: string[] = [];
    for (const ip of ips) {
      const ptrs = await resolvePtr(ip);
      for (const ptr of ptrs) {
        ptrResults.push(`${ip} → ${ptr}`);
      }
    }
    const score = ptrResults.length > 0 ? Math.min(ptrResults.length * 50, 100) : 0;
    return { records: ptrResults, score };
  } catch {
    return { records: [], score: 0 };
  }
}

async function lookupSPF(domain: string): Promise<LookupResult> {
  const records = await resolveTxt(domain);
  const spfRecords = records.filter((r) => r.startsWith("v=spf1"));
  const result: LookupResult = { type: "SPF", domain, records: spfRecords, raw: records };
  const spfScore = calculateSPFScore(spfRecords);
  if (spfScore) result.spfScore = spfScore;
  return result;
}

async function lookupDKIM(domain: string, selector?: string): Promise<LookupResult> {
  if (selector && selector !== "auto") {
    const hostname = `${selector}._domainkey.${domain}`;
    const records = await resolveTxt(hostname);
    const result: LookupResult = {
      type: "DKIM",
      domain,
      records,
      raw: records,
      selector,
    };
    const dkimProbe = await probeDKIMSelectors(domain);
    result.dkimSelectors = dkimProbe.selectors;
    result.dkimScore = dkimProbe.score;
    return result;
  }
  const dkimProbe = await probeDKIMSelectors(domain);
  const foundSelectors = dkimProbe.selectors.filter((s) => s.found);
  const result: LookupResult = {
    type: "DKIM",
    domain,
    records: foundSelectors.map((s) => s.record || "").filter(Boolean),
    dkimSelectors: dkimProbe.selectors,
    dkimScore: dkimProbe.score,
    selector: "auto",
  };
  if (foundSelectors.length > 0) {
    result.selector = foundSelectors[0].selector;
  }
  return result;
}

async function lookupDMARC(domain: string): Promise<LookupResult> {
  const hostname = `_dmarc.${domain}`;
  const records = await resolveTxt(hostname);
  const dmarcRecords = records.filter((r) => r.startsWith("v=DMARC1"));
  const result: LookupResult = {
    type: "DMARC",
    domain,
    records: dmarcRecords,
    raw: records,
  };
  const analysis = analyzeDMARCPolicy(dmarcRecords);
  if (analysis) result.dmarcAnalysis = analysis;
  return result;
}

async function lookupBIMI(domain: string): Promise<LookupResult> {
  const hostname = `default._bimi.${domain}`;
  const records = await resolveTxt(hostname);
  const bimiRecords = records.filter((r) => r.startsWith("v=BIMI1"));
  const result: LookupResult = {
    type: "BIMI",
    domain,
    records: bimiRecords,
    raw: records,
  };
  result.bimiValidation = await validateBIMI(bimiRecords, domain);
  return result;
}

async function lookupMX(domain: string): Promise<LookupResult> {
  const mxRecords = await resolveMx(domain);
  const records = mxRecords.map((r) => `${r.priority} ${r.exchange}`);
  const result: LookupResult = { type: "MX", domain, records };
  return result;
}

async function calculateDeliverabilityScore(domain: string): Promise<{
  overall: number;
  categories: Record<string, CategoryScore>;
  details: Record<string, any>;
}> {
  const [spf, dmarc, mxData, bimi, dkimProbe, ptrData] = await Promise.all([
    lookupSPF(domain),
    lookupDMARC(domain),
    lookupMX(domain),
    lookupBIMI(domain),
    probeDKIMSelectors(domain),
    lookupPTR(domain),
  ]);

  const spfScore = spf.spfScore?.score ?? (spf.records.length > 0 ? 50 : 0);
  const dkimScore = dkimProbe.score.score;
  const dmarcScore = dmarc.dmarcAnalysis?.score ?? (dmarc.records.length > 0 ? 30 : 0);
  const ptrScore = ptrData.score;

  let mxScore = 0;
  if (mxData.records.length > 0) {
    mxScore += 40;
    if (mxData.records.length >= 2) mxScore += 30;
    const priorities = mxData.records
      .map((r) => parseInt(r.split(" ")[0]))
      .sort((a, b) => a - b);
    if (priorities.length > 1 && priorities[1] > priorities[0]) mxScore += 30;
    else if (priorities.length > 0) mxScore += 15;
  }

  const bimiScore = bimi.bimiValidation?.score ?? 0;

  const categories: Record<string, CategoryScore> = {
    spf: { score: spfScore, max: 100, weight: 0.25, label: "SPF" },
    dkim: { score: dkimScore, max: 100, weight: 0.25, label: "DKIM" },
    dmarc: { score: dmarcScore, max: 100, weight: 0.25, label: "DMARC" },
    mx: { score: mxScore, max: 100, weight: 0.1, label: "MX Configuration" },
    ptr: { score: ptrScore, max: 100, weight: 0.1, label: "PTR/Reverse DNS" },
    bimi: { score: bimiScore, max: 100, weight: 0.05, label: "BIMI" },
  };

  const overall = Math.round(
    Object.values(categories).reduce(
      (sum, c) => sum + (c.score / c.max) * c.weight * 100,
      0,
    ),
  );

  return {
    overall,
    categories,
    details: {
      spf: { records: spf.records, score: spfScore },
      dkim: { selectorsFound: dkimProbe.selectors.filter((s) => s.found).length, score: dkimScore },
      dmarc: { records: dmarc.records, analysis: dmarc.dmarcAnalysis, score: dmarcScore },
      mx: { records: mxData.records, score: mxScore },
      ptr: { records: ptrData.records, score: ptrScore },
      bimi: { validation: bimi.bimiValidation, score: bimiScore },
    },
  };
}

async function handleDeliverability(domain: string): Promise<LookupResult> {
  const deliverability = await calculateDeliverabilityScore(domain);
  const [spf, dkim, dmarc, bimi, mxData] = await Promise.all([
    lookupSPF(domain),
    lookupDKIM(domain, "auto"),
    lookupDMARC(domain),
    lookupBIMI(domain),
    lookupMX(domain),
  ]);

  const result: LookupResult = {
    type: "DELIVERABILITY",
    domain,
    records: [],
    deliverabilityScore: deliverability,
    spfScore: spf.spfScore ?? undefined,
    dkimScore: dkim.dkimScore,
    dkimSelectors: dkim.dkimSelectors,
    dmarcAnalysis: dmarc.dmarcAnalysis ?? undefined,
    bimiValidation: bimi.bimiValidation,
  };
  return result;
}

async function handleComparison(
  type: string,
  domain1: string,
  domain2: string,
): Promise<ComparisonData> {
  async function runForDomain(d: string) {
    switch (type) {
      case "spf": return lookupSPF(d);
      case "dkim": return lookupDKIM(d, "auto");
      case "dmarc": return lookupDMARC(d);
      case "bimi": return lookupBIMI(d);
      case "mx": return lookupMX(d);
      case "deliverability": return handleDeliverability(d);
      default: return lookupSPF(d);
    }
  }

  const [r1, r2] = await Promise.all([runForDomain(domain1), runForDomain(domain2)]);

  const comparisons: Record<string, any> = {};
  if (type === "deliverability") {
    const d1 = r1 as LookupResult;
    const d2 = r2 as LookupResult;
    comparisons.deliverability = {
      domain1: d1.deliverabilityScore,
      domain2: d2.deliverabilityScore,
      winner:
        (d1.deliverabilityScore?.overall ?? 0) >= (d2.deliverabilityScore?.overall ?? 0)
          ? domain1
          : domain2,
    };
    comparisons.spf = {
      domain1: { records: d1.spfScore },
      domain2: { records: d2.spfScore },
      winner:
        (d1.spfScore?.score ?? 0) >= (d2.spfScore?.score ?? 0) ? domain1 : domain2,
    };
    comparisons.dkim = {
      domain1: { records: d1.dkimScore },
      domain2: { records: d2.dkimScore },
      winner:
        (d1.dkimScore?.score ?? 0) >= (d2.dkimScore?.score ?? 0) ? domain1 : domain2,
    };
    comparisons.dmarc = {
      domain1: { records: d1.dmarcAnalysis },
      domain2: { records: d2.dmarcAnalysis },
      winner:
        (d1.dmarcAnalysis?.score ?? 0) >= (d2.dmarcAnalysis?.score ?? 0) ? domain1 : domain2,
    };
  } else {
    const r1r = r1 as LookupResult;
    const r2r = r2 as LookupResult;
    const score1 = r1r.spfScore?.score ?? r1r.dmarcAnalysis?.score ?? r1r.dkimScore?.score ?? 0;
    const score2 = r2r.spfScore?.score ?? r2r.dmarcAnalysis?.score ?? r2r.dkimScore?.score ?? 0;
    comparisons[type] = {
      domain1: r1r,
      domain2: r2r,
      winner: score1 >= score2 ? domain1 : domain2,
    };
  }

  const d1 = await calculateDeliverabilityScore(domain1);
  const d2 = await calculateDeliverabilityScore(domain2);

  return {
    domain1,
    domain2,
    comparisons,
    overall: {
      domain1: d1,
      domain2: d2,
      winner: d1.overall >= d2.overall ? domain1 : domain2,
    },
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as LookupRequest["type"];
    const domain = searchParams.get("domain")?.trim().toLowerCase();
    const selector = searchParams.get("selector")?.trim() || undefined;
    const domain2 = searchParams.get("domain2")?.trim().toLowerCase();

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: "Enter a valid domain name" }, { status: 400 });
    }
    if (domain2 && !domainRegex.test(domain2)) {
      return NextResponse.json({ error: "Enter a valid second domain name" }, { status: 400 });
    }

    if (domain2 && type !== "deliverability") {
      const comparison = await handleComparison(type, domain, domain2);
      return NextResponse.json(
        {
          type: "COMPARISON",
          domain1: domain,
          domain2,
          comparison,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        },
      );
    }

    if (domain2 && type === "deliverability") {
      const comparison = await handleComparison("deliverability", domain, domain2);
      return NextResponse.json(
        {
          type: "COMPARISON",
          domain1: domain,
          domain2,
          comparison,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        },
      );
    }

    let result: LookupResult;

    switch (type) {
      case "spf":
        result = await lookupSPF(domain);
        break;
      case "dkim":
        result = await lookupDKIM(domain, selector);
        break;
      case "dmarc":
        result = await lookupDMARC(domain);
        break;
      case "bimi":
        result = await lookupBIMI(domain);
        break;
      case "mx":
        result = await lookupMX(domain);
        break;
      case "deliverability":
        result = await handleDeliverability(domain);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid lookup type. Use: spf, dkim, dmarc, bimi, mx, deliverability" },
          { status: 400 },
        );
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lookup failed" },
      { status: 500 },
    );
  }
}
