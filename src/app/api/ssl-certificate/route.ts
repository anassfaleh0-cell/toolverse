import { NextResponse } from "next/server";
import tls from "tls";

export const dynamic = "force-dynamic";

interface CertInfo {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  fingerprint: string;
  fingerprint256: string;
  serialNumber: string;
  subjectAltNames: string[];
  organization: string;
  country: string;
  commonName: string;
}

function parseCert(cert: tls.PeerCertificate): CertInfo {
  const now = new Date();
  const validFrom = new Date(cert.valid_from);
  const validTo = new Date(cert.valid_to);
  const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const subject = cert.subject || {};
  const issuer = cert.issuer || {};

  const sans: string[] = [];
  if (cert.subjectaltname) {
    cert.subjectaltname.split(", ").forEach((san) => {
      if (!sans.includes(san)) sans.push(san);
    });
  }

  return {
    subject: Object.fromEntries(Object.entries(subject).map(([k, v]) => [k, String(v)])),
    issuer: Object.fromEntries(Object.entries(issuer).map(([k, v]) => [k, String(v)])),
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysRemaining,
    fingerprint: cert.fingerprint || "",
    fingerprint256: cert.fingerprint256 || "",
    serialNumber: cert.serialNumber || "",
    subjectAltNames: sans,
    organization: String(subject.O || ""),
    country: String(subject.C || ""),
    commonName: String(subject.CN || ""),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let host = searchParams.get("host")?.trim().toLowerCase();
    const portStr = searchParams.get("port")?.trim() || "443";

    if (!host) {
      return NextResponse.json({ error: "Hostname is required" }, { status: 400 });
    }

    if (host.startsWith("https://")) host = host.slice(8);
    if (host.startsWith("http://")) host = host.slice(7);
    host = host.split("/")[0].split(":")[0];

    const hostRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!hostRegex.test(host)) {
      return NextResponse.json({ error: "Enter a valid hostname" }, { status: 400 });
    }

    const port = parseInt(portStr, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      return NextResponse.json({ error: "Port must be between 1 and 65535" }, { status: 400 });
    }

    const certInfo: CertInfo = await new Promise((resolve, reject) => {
      const socket = tls.connect(port, host, {
        servername: host,
        rejectUnauthorized: false,
        timeout: 10000,
      }, () => {
        try {
          const cert = socket.getPeerCertificate(true);
          if (!cert || Object.keys(cert).length === 0) {
            reject(new Error("No certificate returned"));
            return;
          }
          resolve(parseCert(cert));
        } catch (err) {
          reject(err);
        } finally {
          socket.end();
        }
      });

      socket.on("error", (err) => {
        reject(err);
      });

      socket.on("timeout", () => {
        socket.destroy();
        reject(new Error("Connection timed out"));
      });
    });

    return NextResponse.json({
      host,
      port,
      certificate: certInfo,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to check SSL certificate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
