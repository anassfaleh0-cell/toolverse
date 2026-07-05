import type { TopicCluster } from "./types";

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    slug: "dns-domain-management",
    name: "DNS & Domain Management",
    description:
      "Everything about DNS records, domain registration, propagation, and reverse DNS. Master the domain name system from lookup to troubleshooting.",
    pillarToolSlugs: ["dns-lookup"],
    toolSlugs: [
      "dns-lookup",
      "reverse-dns-lookup",
      "dns-propagation-checker",
      "whois-lookup",
    ],
    contentSlugs: [],
  },
  {
    slug: "ip-geolocation",
    name: "IP Address & Geolocation",
    description:
      "Understand IP addressing, geolocation data, ISP identification, and privacy implications. Tools for checking and tracing IP addresses.",
    pillarToolSlugs: ["what-is-my-ip"],
    toolSlugs: ["what-is-my-ip", "ip-lookup"],
    contentSlugs: [],
  },
  {
    slug: "website-security-performance",
    name: "Website Security & Performance",
    description:
      "Audit SSL/TLS certificates, inspect HTTP security headers, monitor website uptime and performance. Keep your websites secure and fast.",
    pillarToolSlugs: ["ssl-certificate-checker"],
    toolSlugs: [
      "ssl-certificate-checker",
      "http-headers-checker",
      "website-status-checker",
    ],
    contentSlugs: [],
  },
  {
    slug: "network-connectivity",
    name: "Network Connectivity & Diagnostics",
    description:
      "Test network latency, check open ports, and diagnose connectivity issues. Essential tools for network engineers and sysadmins.",
    pillarToolSlugs: ["ping-test"],
    toolSlugs: ["ping-test", "port-checker"],
    contentSlugs: [],
  },
  {
    slug: "browser-client-tools",
    name: "Browser & Client Information",
    description:
      "Parse user agent strings, detect browser capabilities, and analyze client-side information for debugging and analytics.",
    pillarToolSlugs: ["user-agent-parser"],
    toolSlugs: ["user-agent-parser"],
    contentSlugs: [],
  },
];

export function getClusterBySlug(
  slug: string,
): TopicCluster | undefined {
  return TOPIC_CLUSTERS.find((c) => c.slug === slug);
}

export function getClusterForTool(toolSlug: string): TopicCluster | undefined {
  return TOPIC_CLUSTERS.find((c) => c.toolSlugs.includes(toolSlug));
}

export function getClusterContent(clusterSlug: string): TopicCluster | undefined {
  const cluster = getClusterBySlug(clusterSlug);
  if (!cluster) return undefined;
  return cluster;
}
