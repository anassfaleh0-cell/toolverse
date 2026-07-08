import type { Metadata } from "next";
import { PortChecker } from "@/components/port-checker/port-checker";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "port-checker";
const pageTitle = "Port Checker — Test if a Port is Open or Closed";
const pageDescription =
  "Check if a network port is open or closed from outside your network. Scan common ports or test a specific port for SSH, HTTP, SMTP, and more. Free port checker tool.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "Port Checker" },
];

const faqItems: FaqItem[] = [
  {
    question: "What are the three possible port states in a scan?",
    answer:
      "Open means the port accepts connections. Closed means the port is reachable but no service is listening. Filtered means a firewall or network policy dropped the probe without response, making the state indeterminate.",
  },
  {
    question: "Why would a port show as filtered instead of open or closed?",
    answer:
      "Filtered usually means a firewall rule silently drops packets to that port instead of sending a reject (RST). Many cloud providers and enterprise networks implement default-drop rulesets that return no response to unauthorized ports.",
  },
  {
    question: "Does an open port mean a security vulnerability?",
    answer:
      "Not inherently. An open port is necessary for running network services. The vulnerability depends on the service listening on that port. An open SSH port (22) with weak credentials is a risk, while an open HTTPS port (443) is expected.",
  },
  {
    question: "What ports should I close for a secure web server?",
    answer:
      "Close Telnet (23), FTP (21), SMTP (25), and RDP (3389) unless specifically required. These are common attack targets. Also close database ports like MySQL (3306) and PostgreSQL (5432) from public access. Restrict SSH (22) to specific IPs.",
  },
  {
    question: "Why does a port scan from inside my network differ from an external scan?",
    answer:
      "Internal scans bypass the firewall, NAT, and port forwarding rules. An internal scan shows every service running on your servers. An external scan shows only the services exposed through your perimeter security. The difference reveals firewall effectiveness.",
  },
  {
    question: "What is the difference between TCP and UDP port scanning?",
    answer:
      "TCP scans complete a three-way handshake (open) or receive a RST (closed). UDP scans receive no response for filtered ports or an ICMP unreachable for closed ports. UDP scanning is inherently slower and less reliable due to connectionless behavior.",
  },
  {
    question: "Can a port checker detect if a service is vulnerable?",
    answer:
      "No. Port checking only confirms whether a port accepts connections. Detecting vulnerabilities requires banner grabbing and version detection (like Nmap -sV), which falls into active reconnaissance territory beyond simple connectivity checks.",
  },
  {
    question: "Why do some common ports (like 443) show closed on my scan?",
    answer:
      "The port may be closed by a firewall rule, or the service may not be running. Another possibility is that the service listens on a different interface (e.g., localhost only) that is not exposed to the external network where the check originates.",
  },
  {
    question: "Do cloud security groups affect port checker results?",
    answer:
      "Yes. AWS security groups, Azure NSGs, and GCP firewall rules filter at the hypervisor level before traffic reaches the instance. A port must be open in both the cloud firewall and the server's OS firewall to show as open.",
  },
  {
    question: "What is the most commonly open port on the internet?",
    answer:
      "Port 80 (HTTP) and 443 (HTTPS) are the most commonly open ports globally. Port 22 (SSH) follows, with hundreds of millions of exposed instances, making it the most attacked non-web port.",
  },
  {
    question: "How many ports should I scan in a security audit?",
    answer:
      "Start with the top 20 most targeted ports (21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 1433, 1521, 3306, 3389, 5432, 5900, 6379, 8080). Then scan all 65535 ports with a SYN scan for a comprehensive audit.",
  },
  {
    question: "Does a port scan violate terms of service?",
    answer:
      "Scanning your own infrastructure is legal and recommended. Scanning third-party networks without permission may violate the Computer Fraud and Abuse Act in the US and similar laws in other jurisdictions. Always obtain written authorization.",
  },
];

export default function PortCheckerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Port Checker"
            description="Check if a network port is open or closed from outside your network. Scan common ports or test a specific port."
            breadcrumbs={breadcrumbs}
          >
            <PortChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Port States and Firewall Behavior
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every TCP port has a state determined by whether a service is listening and whether the firewall allows the connection. An open port responds to the initial SYN packet with a SYN-ACK, completing a connection. A closed port responds with a RST packet, indicating reachable but unused. A filtered port drops the SYN packet silently, sending no response. The filtered state is the most common result in cloud environments where security groups enforce a deny-by-default posture. This tool attempts a TCP connection to the specified port and reports the observed state.
            </p>
            <p>
              Use this <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Port Checker</Link> to verify that your firewall rules are working as designed. After configuring a new service (web server on port 443, SSH on port 22, database on port 5432), confirm the port is open from an external perspective. For services that should be hidden, confirm they show as filtered or closed. Pair this with the <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> to verify the host is reachable before interpreting port states. If the host does not respond to ping, the firewall may be dropping all ICMP traffic while still allowing TCP connections.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Port Exposure and Attack Surface Management
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every open port expands your attack surface. Attackers scan the entire IPv4 space continuously, cataloguing open ports on every public IP. If you expose an SSH port with password authentication, credential-based attacks begin within minutes of the port becoming reachable. Database ports should never be exposed to the public internet; application servers should connect via internal networks or VPNs. The port checker tells you exactly which services are visible to someone probing from the internet. Use it to verify that only ports 80 and 443 are open on your web server, and that administrative ports are locked down.
            </p>
            <p>
              When auditing a new server or after a firewall configuration change, run a scan of common ports first. If any expected open port shows as filtered, check your security group rules and OS firewall. If any expected closed port shows as open, investigate immediately. The <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> confirms the web service on port 80 or 443 is operational. The <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> validates TLS configuration on 443 when applicable. Together, these tools provide a complete perimeter security assessment.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Port Security Mistakes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most frequent mistake is assuming a cloud firewall alone secures a port while forgetting the OS-level firewall. A server can have port 3306 open in the OS firewall while the cloud security group purports to block it, or vice versa. Another error is exposing administrative interfaces like phpMyAdmin or cPanel on non-standard ports under the assumption that obscurity provides security. Attackers scan all 65535 ports, so moving SSH to port 2222 does not prevent discovery. Never expose database ports, Redis ports, or message queue ports to the public internet under any configuration.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Check Port Status
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Check port status immediately after deploying a new server, after changing firewall rules, or when a service fails to start. Run a port check when users report connection refused errors. Security teams should scan their own IP ranges weekly to detect unauthorized services. Before a penetration test, confirm your firewall rules are correctly blocking ports meant to be hidden. Also use the port checker during incident response to confirm whether a compromised server has unexpected listening services.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Port Checker Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "Ping Test", description: "Measure network latency and packet loss to any server", href: "/ping-test" },
              { icon: "🔍", title: "Website Status Checker", description: "Check if a website is online and measure response time", href: "/website-status-checker" },
              { icon: "🔍", title: "SSL Certificate Checker", description: "Verify TLS certificates and expiration dates", href: "/ssl-certificate-checker" },
              { icon: "🔍", title: "User Agent Parser", description: "Parse any user agent string for browser and device details", href: "/user-agent-parser" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="port-checker" />
    </>
  );
}
