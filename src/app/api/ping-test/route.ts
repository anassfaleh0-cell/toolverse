import { NextResponse } from "next/server";
import net from "net";

export const dynamic = "force-dynamic";

function tcpPing(host: string, port: number, timeout: number): Promise<number | null> {
  return new Promise((resolve) => {
    const start = performance.now();
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on("connect", () => {
      const duration = performance.now() - start;
      socket.destroy();
      resolve(Math.round(duration));
    });

    socket.on("error", () => {
      socket.destroy();
      resolve(null);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });

    socket.connect(port, host);
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let host = searchParams.get("host")?.trim().toLowerCase();

    if (!host) {
      return NextResponse.json({ error: "Hostname is required" }, { status: 400 });
    }

    if (host.startsWith("https://")) host = host.slice(8);
    if (host.startsWith("http://")) host = host.slice(7);
    host = host.split("/")[0].split(":")[0];

    const hostRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!hostRegex.test(host) && host !== "localhost") {
      return NextResponse.json({ error: "Enter a valid hostname or IP address" }, { status: 400 });
    }

    const port = 80;
    const attempts = 4;
    const timeouts: number[] = [];
    let lossCount = 0;

    for (let i = 0; i < attempts; i++) {
      const time = await tcpPing(host, port, 5000);
      if (time !== null) {
        timeouts.push(time);
      } else {
        lossCount++;
      }
    }

    const packetLoss = Math.round((lossCount / attempts) * 100);
    const min = timeouts.length > 0 ? Math.min(...timeouts) : 0;
    const max = timeouts.length > 0 ? Math.max(...timeouts) : 0;
    const avg = timeouts.length > 0 ? Math.round(timeouts.reduce((a, b) => a + b, 0) / timeouts.length) : 0;

    return NextResponse.json({
      host,
      attempts,
      successful: timeouts.length,
      lossCount,
      packetLoss,
      min,
      max,
      avg,
      times: timeouts,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ping test failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
