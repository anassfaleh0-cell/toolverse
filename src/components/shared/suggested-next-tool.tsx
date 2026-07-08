import Link from "next/link";
import { getAllTools } from "@/lib/registry";
import type { Tool } from "@/lib/registry";

interface WorkflowEdge {
  from: string;
  to: string;
  reason: string;
}

const WORKFLOW_EDGES: WorkflowEdge[] = [
  { from: "ping", to: "traceroute", reason: "When ping shows packet loss, trace the route." },
  { from: "traceroute", to: "dns-lookup", reason: "Route fails? Confirm DNS resolution." },
  { from: "dns-lookup", to: "http-headers", reason: "DNS looks good? Check server response." },
  { from: "http-headers", to: "security-headers", reason: "Check security posture of headers." },
  { from: "speedtest", to: "bandwidth-calculator", reason: "Know your speed? Calculate bandwidth needs." },
  { from: "dns-lookup", to: "reverse-dns", reason: "Forward records found? Verify reverse." },
  { from: "ipv6-connectivity", to: "dns-lookup", reason: "IPv6 confirmed? Check AAAA records." },
  { from: "whats-my-ip", to: "ping", reason: "Know your IP? Test latency to remote hosts." },
  { from: "ping", to: "speedtest", reason: "Latency measured? Test throughput." },
  { from: "security-headers", to: "ssl-checker", reason: "Headers secure? Verify SSL certificate." },
];

export function SuggestedNextTool({ currentSlug }: { currentSlug: string }) {
  const edges = WORKFLOW_EDGES.filter((e) => e.from === currentSlug);
  if (edges.length === 0) return null;

  const allTools = getAllTools();
  const suggestions = edges
    .map((e) => {
      const tool = allTools.find((t) => t.slug === e.to);
      return tool ? { ...tool, reason: e.reason } : null;
    })
    .filter(Boolean) as (Tool & { reason: string })[];

  if (suggestions.length === 0) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Suggested Next Step
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Based on your current diagnostic path.
      </p>
      <div className="mt-4 space-y-3">
        {suggestions.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.url}
            className="flex items-center gap-3 rounded-xl bg-white p-4 transition-colors hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {tool.name}
              </p>
              <p className="text-xs text-zinc-500">{tool.reason}</p>
            </div>
            <span className="text-zinc-400">&rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
