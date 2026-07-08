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
    contentSlugs: [
      "dns-lookup-troubleshooting",
      "reverse-dns-troubleshooting",
      "dns-propagation-troubleshooting",
      "whois-troubleshooting",
      "dns-lookup-beginners",
      "reverse-dns-beginners",
      "what-is-dns-propagation",
      "whois-beginners",
      "dns-lookup-vs-whois",
      "dns-propagation-vs-dns-lookup",
      "reverse-dns-vs-forward-dns",
      "whois-vs-rdap",
      "understanding-dns-record-types",
      "how-to-reduce-dns-lookup-time",
      "dns-security-best-practices",
      "email-deliverability-dns",
      "dns-migration-guide",
    ],
  },
  {
    slug: "ip-geolocation",
    name: "IP Address & Geolocation",
    description:
      "Understand IP addressing, geolocation data, ISP identification, and privacy implications. Tools for checking and tracing IP addresses.",
    pillarToolSlugs: ["what-is-my-ip"],
    toolSlugs: ["what-is-my-ip", "ip-lookup"],
    contentSlugs: [
      "what-is-my-ip-troubleshooting",
      "ip-lookup-troubleshooting",
      "what-is-my-ip-beginners",
      "ip-lookup-beginners",
      "what-is-my-ip-vs-ip-lookup",
      "ip-lookup-vs-geolocation",
      "what-is-my-ip-privacy-guide",
      "ip-geolocation-accuracy",
      "ip-threat-intelligence",
      "what-is-my-ip-vpn-guide",
    ],
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
    contentSlugs: [
      "ssl-certificate-troubleshooting",
      "http-headers-troubleshooting",
      "website-status-troubleshooting",
      "ssl-certificate-beginners",
      "http-headers-beginners",
      "website-status-beginners",
      "ssl-vs-tls",
      "http-headers-vs-security",
      "website-status-vs-ping",
      "ssl-certificate-types-comparison",
      "automating-ssl-renewal",
      "http-security-headers-guide",
      "cdn-optimization-guide",
      "http2-performance-benefits",
      "website-performance-monitoring",
      "website-security-checklist",
      "understanding-http-status-codes",
    ],
  },
  {
    slug: "network-connectivity",
    name: "Network Connectivity & Diagnostics",
    description:
      "Test network latency, check open ports, and diagnose connectivity issues. Essential tools for network engineers and sysadmins.",
    pillarToolSlugs: ["ping-test"],
    toolSlugs: ["ping-test", "port-checker"],
    contentSlugs: [
      "ping-test-troubleshooting",
      "port-checker-troubleshooting",
      "ping-test-beginners",
      "port-checker-beginners",
      "ping-vs-port-scan",
      "port-checker-vs-firewall",
      "network-latency-troubleshooting",
      "port-security-audit",
    ],
  },
  {
    slug: "browser-client-tools",
    name: "Browser & Client Information",
    description:
      "Parse user agent strings, detect browser capabilities, and analyze client-side information for debugging and analytics.",
    pillarToolSlugs: ["user-agent-parser"],
    toolSlugs: ["user-agent-parser"],
    contentSlugs: [
      "user-agent-troubleshooting",
      "user-agent-beginners",
      "user-agent-vs-fingerprinting",
      "user-agent-analytics-guide",
    ],
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
