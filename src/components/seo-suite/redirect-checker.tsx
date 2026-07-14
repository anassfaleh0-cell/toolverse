"use client";

import { useState } from "react";
import { Input, Button, Alert } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

interface RedirectStep {
  url: string;
  status: number;
  statusText: string;
}

export function RedirectChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<RedirectStep[]>([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"live" | "simulate">("simulate");

  async function checkRedirect() {
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    setError("");
    setSteps([]);
    setLoading(true);

    if (mode === "live") {
      try {
        const response = await fetch(url, { method: "HEAD", redirect: "follow" });
        const chain: RedirectStep[] = [];
        if (response.redirected) {
          chain.push({ url, status: 302, statusText: "Found (redirected)" });
        }
        chain.push({
          url: response.url,
          status: response.status,
          statusText: response.statusText,
        });
        setSteps(chain);
      } catch {
        setSteps([
          { url, status: 0, statusText: "CORS/Network error â€” try simulation mode" },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      simulateRedirect(url);
      setLoading(false);
    }
  }

  function simulateRedirect(inputUrl: string) {
    const simSteps: RedirectStep[] = [];
    const urlObj = new URL(inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`);

    if (!inputUrl.match(/^https?:\/\//)) {
      simSteps.push({ url: urlObj.href, status: 301, statusText: "Moved Permanently (protocol added)" });
      urlObj.protocol = "https:";
    }

    const wwwPattern = /^https?:\/\/www\./;
    if (wwwPattern.test(urlObj.href)) {
      simSteps.push({ url: urlObj.href, status: 301, statusText: "Moved Permanently (www redirect)" });
      urlObj.host = urlObj.host.replace(/^www\./, "");
    }

    if (urlObj.pathname.endsWith("/") && urlObj.pathname.length > 1) {
      simSteps.push({ url: urlObj.href, status: 301, statusText: "Moved Permanently (trailing slash)" });
      urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
    }

    const httpPattern = /^http:\/\//;
    if (httpPattern.test(urlObj.href)) {
      simSteps.push({ url: urlObj.href, status: 301, statusText: "Moved Permanently (HTTPâ†’HTTPS)" });
      urlObj.protocol = "https:";
    }

    const finalUrl = urlObj.href;
    simSteps.push({ url: finalUrl, status: 200, statusText: "OK (final destination)" });
    setSteps(simSteps);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex gap-2">
        <Button type="button" variant={mode === "live" ? "primary" : "secondary"} size="sm" onClick={() => setMode("live")} aria-label="Live mode">
          Live
        </Button>
        <Button type="button" variant={mode === "simulate" ? "primary" : "secondary"} size="sm" onClick={() => setMode("simulate")} aria-label="Simulation mode">
          Simulation
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => e.key === "Enter" && checkRedirect()}
            aria-label="URL to check"
          />
        </div>
        <Button type="button" onClick={checkRedirect} disabled={loading} aria-label="Check redirect">
          {loading ? "Checking..." : "Check"}
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {mode === "live" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400" role="alert">
          Live redirect checking requires the target server to support CORS headers. Most servers do not. Use Simulation mode for a realistic analysis.
        </div>
      )}

      {steps.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Redirect Chain ({steps.length} {steps.length === 1 ? "step" : "steps"})
            </p>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{step.url}</p>
                  <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    step.status >= 200 && step.status < 300 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" :
                    step.status >= 300 && step.status < 400 ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" :
                    step.status === 0 ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {step.status} {step.statusText}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <Icon name="ArrowRight" className="size-5 shrink-0 text-zinc-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
