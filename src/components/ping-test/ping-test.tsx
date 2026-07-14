"use client";

import { useState, useTransition, useCallback } from "react";
import { Input, Button, Alert, Card, Skeleton } from "@/components/ui";
import { CopyButton, DashboardSummary, MiniBarChart, CompositeScore, ResultExport, ResultHistory, ToolMethodology } from "@/components/shared";
import { METHODOLOGY } from "@/lib/methodology";
import { saveResult } from "@/lib/user-storage";

interface PingResult {
  host: string;
  attempts: number;
  successful: number;
  lossCount: number;
  packetLoss: number;
  min: number;
  max: number;
  avg: number;
  jitter: number;
  times: number[];
}

function getLatencyQuality(avg: number, loss: number): { label: string; color: string; description: string } {
  if (loss >= 50) return { label: "Poor", color: "text-red-700 dark:text-red-400", description: "High packet loss indicates network congestion or a failing link." };
  if (avg > 200) return { label: "Poor", color: "text-red-700 dark:text-red-400", description: "High latency suitable only for asynchronous tasks like email." };
  if (avg > 100) return { label: "Fair", color: "text-amber-700 dark:text-amber-400", description: "Noticeable lag for real-time applications. Gaming and VoIP may suffer." };
  if (avg > 50) return { label: "Good", color: "text-emerald-700 dark:text-emerald-400", description: "Suitable for most applications including video calls and streaming." };
  return { label: "Excellent", color: "text-emerald-700 dark:text-emerald-400", description: "Ideal for competitive gaming, real-time collaboration, and VoIP." };
}

function getJitterQuality(jitter: number): string {
  if (jitter <= 10) return "Low jitter. Stable connection suitable for all real-time applications.";
  if (jitter <= 30) return "Moderate jitter. VoIP and video calls may have occasional artifacts.";
  return "High jitter. Real-time communication quality will be noticeably degraded.";
}

function getLatencyAdvice(avg: number, jitter: number, loss: number): string {
  if (loss > 0) return "Investigate packet loss first: check cables, Wi-Fi signal, and ISP congestion. Loss causes more disruption than latency.";
  if (avg > 150) return "Consider a wired connection, closer server, or better ISP plan. For gaming, try selecting a server closer to your location.";
  if (jitter > 20) return "High jitter often indicates Wi-Fi interference or network congestion. Try a wired Ethernet connection for more stability.";
  return "Your connection quality is healthy. Run periodic tests to track baseline drift over time.";
}

export function PingTest() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState<PingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = host.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/ping-test?host=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Ping test failed");
      } else {
        startTransition(() => { setResult(json); saveResult("ping-test", json); });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formatPingText = useCallback(() => {
    if (!result) return "";
    const lines = [
      `Ping Test Results for: ${result.host}`,
      `Generated: ${new Date().toISOString()}`,
      `Attempts: ${result.attempts} | Successful: ${result.successful} | Packet Loss: ${result.packetLoss}%`,
      `Min: ${result.min}ms | Avg: ${result.avg}ms | Max: ${result.max}ms | Jitter: ${result.jitter}ms`,
      "",
      ...result.times.map((t, i) => `Reply ${i + 1}: ${t}ms`),
    ];
    if (result.lossCount > 0) {
      for (let i = 0; i < result.lossCount; i++) lines.push(`Request ${result.times.length + i + 1}: Timeout`);
    }
    return lines.join("\n");
  }, [result]);

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="example.com"
          aria-label="Hostname or IP"
        />
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? "Pinging..." : "Ping"}
        </Button>
      </form>

      {error && (
        <Alert variant="error" className="mt-6">{error}</Alert>
      )}

      {loading && (
        <div className="mt-8">
          <Skeleton count={4} columns={1} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          {(() => {
            const latencyScore = Math.max(0, Math.min(100, Math.round(100 - result.avg / 2)));
            const stabilityScore = Math.max(0, Math.min(100, Math.round(100 - result.jitter * 3)));
            const lossScore = Math.max(0, Math.min(100, Math.round(100 - result.packetLoss * 2)));
            const qualityScore = Math.round((latencyScore + stabilityScore + lossScore) / 3);
            return (
              <DashboardSummary
                title={result.host}
                status={getLatencyQuality(result.avg, result.packetLoss).label === "Excellent" || getLatencyQuality(result.avg, result.packetLoss).label === "Good" ? "good" : getLatencyQuality(result.avg, result.packetLoss).label === "Fair" ? "warning" : "critical"}
                mainFinding={`Quality ${qualityScore}/100 â€” ${getLatencyQuality(result.avg, result.packetLoss).label}, ${result.packetLoss}% loss, ${result.avg}ms avg`}
                riskLevel={result.packetLoss > 0 || result.avg > 200 ? "high" : result.avg > 100 ? "medium" : "low"}
                riskLabel={`${qualityScore}/100`}
                nextAction={getLatencyAdvice(result.avg, result.jitter, result.packetLoss)}
              >
                <CompositeScore overall={qualityScore} subScores={[
                  { label: "Latency", score: latencyScore },
                  { label: "Stability", score: stabilityScore },
                  { label: "Loss", score: lossScore },
                ]} size={60} />
                <MiniBarChart values={result.times} lossCount={result.lossCount} height={40} className="col-span-full" />
              </DashboardSummary>
            );
          })()}

          <div className="flex flex-wrap gap-4">
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Packets</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.successful}/{result.attempts}
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Packet Loss</p>
              <p className={`mt-1 text-sm font-semibold ${
                result.packetLoss === 0 ? "text-green-700 dark:text-green-400" :
                result.packetLoss >= 50 ? "text-red-700 dark:text-red-400" :
                "text-amber-700 dark:text-amber-400"
              }`}>
                {result.packetLoss}%
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Min</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.min}ms
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Average</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.avg}ms
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Max</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.max}ms
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Jitter</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.jitter}ms
              </p>
            </Card>
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800 animate-fade-slide-up">
            <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">
              Connection Quality
            </p>
            <p className={`text-lg font-bold ${getLatencyQuality(result.avg, result.packetLoss).color}`}>
              {getLatencyQuality(result.avg, result.packetLoss).label}
            </p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {getLatencyQuality(result.avg, result.packetLoss).description}
            </p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {getJitterQuality(result.jitter)}
            </p>
            <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
              <strong>Recommendation:</strong> {getLatencyAdvice(result.avg, result.jitter, result.packetLoss)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <ResultHistory toolSlug="ping-test" onRestore={(d) => { setResult(d as PingResult); }} />
            <ResultExport rawData={result} fileName={`ping-test-${result.host}`} displayName="Ping Test" formatAsText={formatPingText} />
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Ping Results for {result.host}
              </p>
              <CopyButton text={JSON.stringify(result, null, 2)} label="Copy" />
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {result.times.map((time, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
                >
                  <span className="text-zinc-500 dark:text-zinc-400">Reply {i + 1}</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-50">
                    {time}ms
                  </span>
                </div>
              ))}
              {result.lossCount > 0 && Array.from({ length: result.lossCount }).map((_, i) => (
                <div
                  key={`loss-${i}`}
                  className="flex items-center justify-between px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
                >
                  <span className="text-zinc-500 dark:text-zinc-400">Request {result.times.length + i + 1}</span>
                  <span className="font-mono text-red-700 dark:text-red-400">Timeout</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {result && !loading && (
        <ToolMethodology sections={METHODOLOGY["ping-test"]} />
      )}
    </div>
  );
}
