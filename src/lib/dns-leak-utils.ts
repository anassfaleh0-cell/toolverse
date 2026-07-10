export interface DnsResolverResult {
  name: string;
  ip: string;
  latencyMs: number | null;
  error: string | null;
}

export interface WebRtcResult {
  detectedIp: string | null;
  leakDetected: boolean;
  error: string | null;
}

export interface DnsLeakResult {
  resolvers: DnsResolverResult[];
  webRtc: WebRtcResult;
  publicIp: string;
  leakedIps: string[];
  hasLeak: boolean;
}

const DOH_PROVIDERS = [
  { name: "Cloudflare", url: "https://cloudflare-dns.com/dns-query" },
  { name: "Google", url: "https://dns.google/resolve" },
  { name: "Quad9", url: "https://dns.quad9.net/dns-query" },
];

async function queryDoh(
  provider: { name: string; url: string },
): Promise<DnsResolverResult> {
  const start = performance.now();
  try {
    const resp = await fetch(
      `${provider.url}?name=example.com&type=A`,
      { headers: { Accept: "application/dns-json" }, signal: AbortSignal.timeout(5000) },
    );
    const elapsed = Math.round(performance.now() - start);
    if (!resp.ok) return { name: provider.name, ip: "", latencyMs: null, error: `HTTP ${resp.status}` };
    const data = await resp.json();
    const ip = data?.Answer?.[0]?.data || data?.answer?.[0]?.data || "";
    return { name: provider.name, ip, latencyMs: elapsed, error: null };
  } catch {
    return { name: provider.name, ip: "", latencyMs: null, error: "Timeout or unreachable" };
  }
}

async function detectWebRtcIp(): Promise<WebRtcResult> {
  try {
    const ip = await new Promise<string>((resolve, reject) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pc.createDataChannel("");
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(reject);
      let resolved = false;
      pc.onicecandidate = (ev) => {
        if (resolved) return;
        if (!ev.candidate) {
          resolved = true;
          reject(new Error("No candidate found"));
          return;
        }
        const match = /([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(ev.candidate.candidate);
        if (match) {
          resolved = true;
          resolve(match[0]);
        }
      };
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error("Timeout"));
        }
      }, 5000);
    });
    return { detectedIp: ip, leakDetected: true, error: null };
  } catch {
    return { detectedIp: null, leakDetected: false, error: "WebRTC unavailable or blocked" };
  }
}

export async function runDnsLeakCheck(publicIp: string): Promise<DnsLeakResult> {
  const resolverResults = await Promise.all(DOH_PROVIDERS.map((p) => queryDoh(p)));

  const webRtc = await detectWebRtcIp();

  const leakedIps: string[] = [];
  if (webRtc.detectedIp && webRtc.detectedIp !== publicIp) {
    leakedIps.push(webRtc.detectedIp);
  }

  const hasLeak = leakedIps.length > 0;

  return {
    resolvers: resolverResults,
    webRtc,
    publicIp,
    leakedIps,
    hasLeak,
  };
}
