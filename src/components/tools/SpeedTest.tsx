"use client";

import { useState, useCallback, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";

interface SpeedTestResult {
  ping: number;
  jitter: number;
  downloadSpeed: number;
  downloadUnit: string;
  dataSize: string;
  timestamp: string;
}

export function SpeedTest() {
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");
  const [progress, setProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const measurePing = useCallback(async (): Promise<{ ping: number; jitter: number }> => {
    const times: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      const res = await fetch("/api/tools/speed-test?action=ping");
      await res.json();
      times.push(performance.now() - start);
    }
    const sorted = [...times].sort((a, b) => a - b);
    const mid = sorted.slice(1, -1);
    const avg = mid.reduce((a, b) => a + b, 0) / mid.length;
    const jitter = Math.max(...mid) - Math.min(...mid);
    return { ping: Math.round(avg), jitter: Math.round(jitter) };
  }, []);

  const measureDownload = useCallback(async (size: string, label: string): Promise<number> => {
    setPhase(`Downloading ${label}...`);
    const controller = new AbortController();
    abortRef.current = controller;
    const start = performance.now();
    const res = await fetch(`/api/tools/speed-test?action=download&size=${size}`, {
      signal: controller.signal,
    });
    const blob = await res.blob();
    const duration = (performance.now() - start) / 1000;
    const bits = blob.size * 8;
    return bits / duration / 1_000_000;
  }, []);

  async function handleStart() {
    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    try {
      setPhase("Measuring ping...");
      setProgress(10);
      const { ping, jitter } = await measurePing();
      setProgress(40);

      setPhase("Testing download speed (100 KB)...");
      const speedSmall = await measureDownload("small", "100 KB");
      setProgress(60);

      setPhase("Testing download speed (1 MB)...");
      const speedMedium = await measureDownload("medium", "1 MB");
      setProgress(80);

      const avgSpeed = (speedSmall + speedMedium + speedMedium) / 3;
      const downloadSpeed = Math.round(avgSpeed * 100) / 100;
      const unit = downloadSpeed >= 1000 ? "Gbps" : "Mbps";
      const displaySpeed = downloadSpeed >= 1000
        ? Math.round((downloadSpeed / 1000) * 100) / 100
        : downloadSpeed;

      setProgress(100);
      setPhase("Complete");
      setResult({
        ping,
        jitter,
        downloadSpeed: displaySpeed,
        downloadUnit: unit,
        dataSize: "1.1 MB",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Speed test failed. Please try again.");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function speedColor(mbps: number) {
    if (mbps > 100) return "text-green-600 dark:text-green-400";
    if (mbps > 25) return "text-emerald-600 dark:text-emerald-400";
    if (mbps > 10) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  }

  function pingColor(ms: number) {
    if (ms < 30) return "text-green-600 dark:text-green-400";
    if (ms < 80) return "text-emerald-600 dark:text-emerald-400";
    if (ms < 150) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  }

  function speedLabel(mbps: number) {
    if (mbps > 100) return "Excellent";
    if (mbps > 50) return "Very Fast";
    if (mbps > 25) return "Fast";
    if (mbps > 10) return "Average";
    return "Slow";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Test your connection speed to our server. Measures ping, jitter, and download speed.
        </p>
        <Button onClick={handleStart} disabled={loading} variant={loading ? "secondary" : "primary"} size="lg">
          {loading ? "Testing..." : "Start Speed Test"}
        </Button>
      </div>

      {loading && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">{phase}</span>
            <span className="text-zinc-500 dark:text-zinc-400">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-nuvora-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <Skeleton count={3} columns={1} />
        </div>
      )}

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card variant="default" className="p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Download Speed
              </p>
              <p className={`mt-2 text-3xl font-bold ${speedColor(result.downloadSpeed)}`}>
                {result.downloadSpeed}
                <span className="ml-1 text-lg font-normal">{result.downloadUnit}</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {speedLabel(result.downloadSpeed)}
              </p>
            </Card>
            <Card variant="default" className="p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Ping (Latency)
              </p>
              <p className={`mt-2 text-3xl font-bold ${pingColor(result.ping)}`}>
                {result.ping}
                <span className="ml-1 text-lg font-normal">ms</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {result.ping < 30 ? "Excellent" : result.ping < 80 ? "Good" : result.ping < 150 ? "Fair" : "Poor"}
              </p>
            </Card>
            <Card variant="default" className="p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Jitter
              </p>
              <p className={`mt-2 text-3xl font-bold ${pingColor(result.jitter)}`}>
                {result.jitter}
                <span className="ml-1 text-lg font-normal">ms</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {result.jitter < 10 ? "Stable" : result.jitter < 30 ? "Moderate" : "Unstable"}
              </p>
            </Card>
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
            <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Connection Summary</p>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Download:</strong> {result.downloadSpeed} {result.downloadUnit} —{" "}
                {speedLabel(result.downloadSpeed)} for browsing, streaming, and downloads.
              </li>
              <li>
                <strong>Ping:</strong> {result.ping}ms —{" "}
                {result.ping < 30
                  ? "Ideal for gaming, video calls, and real-time applications."
                  : result.ping < 80
                    ? "Good for most applications including streaming and video calls."
                    : result.ping < 150
                      ? "Adequate for browsing but noticeable lag in real-time apps."
                      : "High latency will impact real-time applications."}
              </li>
              <li>
                <strong>Jitter:</strong> {result.jitter}ms —{" "}
                {result.jitter < 10
                  ? "Connection is stable with minimal variation."
                  : result.jitter < 30
                    ? "Moderate variation may cause occasional glitches in real-time apps."
                    : "High variation will degrade real-time communication quality."}
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Data used: {result.dataSize}</span>
              <span>{new Date(result.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
