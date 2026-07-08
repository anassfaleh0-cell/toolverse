import { NextResponse } from "next/server";
import net from "net";

export const dynamic = "force-dynamic";

interface PortResult {
  port: number;
  service: string;
  status: "open" | "closed" | "filtered";
  responseTime: number | null;
}

const COMMON_PORTS: Record<number, string> = {
  21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
  80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 465: "SMTPS",
  587: "SMTP Submission", 993: "IMAPS", 995: "POP3S", 1433: "MSSQL",
  1521: "Oracle DB", 2049: "NFS", 3306: "MySQL", 3389: "RDP",
  5432: "PostgreSQL", 5900: "VNC", 6379: "Redis", 8080: "HTTP-Alt",
  8443: "HTTPS-Alt", 27017: "MongoDB",
};

function getService(port: number): string {
  return COMMON_PORTS[port] || "Unknown";
}

function checkPort(host: string, port: number, timeout: number): Promise<PortResult> {
  return new Promise((resolve) => {
    const start = performance.now();
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on("connect", () => {
      const duration = Math.round(performance.now() - start);
      socket.destroy();
      resolve({ port, service: getService(port), status: "open", responseTime: duration });
    });

    socket.on("error", () => {
      socket.destroy();
      resolve({ port, service: getService(port), status: "closed", responseTime: null });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ port, service: getService(port), status: "filtered", responseTime: null });
    });

    socket.connect(port, host);
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let host = searchParams.get("host")?.trim().toLowerCase();
    const portStr = searchParams.get("port")?.trim();

    if (!host) {
      return NextResponse.json({ error: "Hostname is required" }, { status: 400 });
    }

    if (host.startsWith("https://")) host = host.slice(8);
    if (host.startsWith("http://")) host = host.slice(7);
    host = host.split("/")[0].split(":")[0];

    const hostRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!hostRegex.test(host) && host !== "localhost" && !ipv4Regex.test(host)) {
      return NextResponse.json({ error: "Enter a valid hostname or IP address" }, { status: 400 });
    }

    if (portStr) {
      const port = parseInt(portStr, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        return NextResponse.json({ error: "Port must be between 1 and 65535" }, { status: 400 });
      }
      const result = await checkPort(host, port, 5000);
      return NextResponse.json({ host, ports: [result] }, { headers: { "Cache-Control": "no-store" } });
    }

    const portsToCheck = [21, 22, 25, 53, 80, 110, 143, 443, 587, 993, 995, 1433, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017];
    const results = await Promise.all(
      portsToCheck.map((port) => checkPort(host, port, 3000)),
    );

    return NextResponse.json({ host, ports: results }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Port check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
