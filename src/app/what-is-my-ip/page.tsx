import type { Metadata } from "next";
import { IpDisplay } from "@/components/ip-tool/ip-display";
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

const slug = "what-is-my-ip";
const pageTitle = "What Is My IP — Check Public IPv4, IPv6 & Privacy";
const pageDescription =
  "See your real public IPv4 and IPv6 addresses, ISP, and location. Detect WebRTC leaks, proxy and VPN exposure, and DNS privacy issues instantly.";

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
  { label: "Productivity", href: `${SITE_URL}/category/productivity` },
  { label: "What Is My IP" },
];

const faqItems: FaqItem[] = [
  {
    question: "Can my IP address reveal my exact physical location?",
    answer:
      "No. Public IP geolocation resolves to your ISP's regional hub or exchange point, not your street address. Consumer databases are accurate to the city or postal code level at best. Mobile IPs route through carrier-grade NAT gateways serving entire metro areas, making them even less precise.",
  },
  {
    question: "What is a WebRTC leak and how do I prevent it?",
    answer:
      "WebRTC is a browser API for peer-to-peer audio, video, and data channels. It can bypass your VPN tunnel by establishing direct UDP connections, revealing your real IP. Prevent it by using a browser extension that blocks WebRTC or disabling it in advanced settings.",
  },
  {
    question: "Why do I see both an IPv4 and an IPv6 address?",
    answer:
      "You are on a dual-stack network where your ISP routes both protocol versions. Your device receives an IPv4 address via DHCP and an IPv6 address via SLAAC or DHCPv6. Most modern OSes prefer IPv6 when available, so traffic to IPv6-capable destinations uses your IPv6 address while legacy destinations fall back to IPv4.",
  },
  {
    question: "Does a VPN hide my IP address from all websites?",
    answer:
      "A properly configured VPN hides your IP from visited sites by routing traffic through the VPN server. However, WebRTC leaks, IPv6 leaks, and DNS leaks can expose your real IP. Additionally, websites can still fingerprint your browser through canvas, font, and screen resolution fingerprinting even when your IP is masked.",
  },
  {
    question: "What is carrier-grade NAT and how does it affect my IP?",
    answer:
      "CGNAT allows ISPs to share a single public IPv4 address among multiple customers. Your router receives a private RFC 1918 address, and the ISP translates traffic at their gateway. You share your public IP with other subscribers, which can cause issues with port forwarding, online gaming, and IP reputation scoring.",
  },
  {
    question: "Can websites see my IPv6 address if I only check IPv4?",
    answer:
      "Absolutely. If your browser supports IPv6 and the server has an AAAA record, your connection uses IPv6 by default preference. Checking only IPv4 gives a false sense of security. You must verify both addresses independently to understand your full exposure.",
  },
  {
    question: "What does the ASN in my IP results mean?",
    answer:
      "An Autonomous System Number identifies the organization controlling your IP block, typically your ISP or a cloud provider. The ASN reveals your upstream carrier and indicates whether you are on a residential, business, or datacenter range, which is how some services detect VPNs and proxies.",
  },
  {
    question: "Why does my IP change when I restart my router?",
    answer:
      "Most ISPs use DHCP with lease timers. When your router reboots, it requests a new lease and may receive a different address from the ISP's pool. Some ISPs assign sticky IPs that rarely change; others rotate addresses every 24-48 hours depending on their lease policy.",
  },
  {
    question: "What is an IP leak and how do I detect one?",
    answer:
      "An IP leak occurs when traffic exits your network using your real IP instead of your VPN's IP. Common causes include IPv6 traffic bypassing the tunnel, DNS queries hitting your ISP's resolver, WebRTC connections, and VPN kill-switch failures. Use this tool before and after VPN activation to verify both stacks are masked.",
  },
  {
    question: "Can two devices share the same public IP address?",
    answer:
      "Yes. Through NAT on your router, all local devices share one public IP. On a larger scale, CGNAT puts hundreds of customers behind one address. This is why IP-based geolocation and reputation can be unreliable, because one user's abuse affects everyone behind that IP.",
  },
  {
    question: "How does my ISP assign my public IPv4 address?",
    answer:
      "ISPs use DHCP pools where addresses are leased to customer routers for a fixed duration, typically 30 minutes to 7 days. Some use PPPoE authentication where the IP is assigned at session start. Static IPs require a business plan with manual configuration and typically cost extra.",
  },
  {
    question: "What is the difference between my public IP and private IP?",
    answer:
      "Your public IP is globally routable and uniquely identifies your network on the internet. Your private IP (e.g., 192.168.x.x, 10.x.x.x) is only valid within your LAN and is translated through NAT by your router. Internet-facing servers never see your private IP, only your router's public address.",
  },
];

export default function WhatIsMyIp() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="What Is My IP?"
            description="See your real public IPv4 and IPv6 addresses, ISP, and location. Detect WebRTC leaks, proxy exposure, and DNS privacy issues instantly."
            breadcrumbs={breadcrumbs}
          >
            <IpDisplay pageUrl={`${SITE_URL}/${slug}`} />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How Your Public IP Becomes a Privacy Fingerprint
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every device connected to the internet is assigned a public IP address, a unique identifier that functions like a digital return address. When you visit any website, stream content, or send a message, your IP is logged by every server you touch. Ad networks, CDNs, and malicious actors can correlate your IP across sessions to infer browsing habits, approximate location, and identity markers.
            </p>
            <p>
              What most users miss is how many vectors expose your real IP even when you think you are hidden. WebRTC leaks can bypass VPN tunnels entirely, revealing your real address through the browser&apos;s native real-time communication protocol. DNS queries also often escape the VPN tunnel if not properly configured, leaking your ISP-assigned IP through the resolver. Running an <Link href="/ip-lookup" className="text-blue-600 hover:underline dark:text-blue-400">IP Lookup</Link> on your own address reveals what your ISP and upstream carriers broadcast about you, often more than you would expect. This tool provides a complete snapshot of your public-facing IP profile, including both protocol versions, ASN information, and privacy leak indicators.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            IPv4 vs IPv6: Why Dual-Stack Awareness Matters
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              We are firmly in a dual-stack era where most devices and networks run both IPv4 and IPv6 simultaneously. Your ISP may assign one IPv4 address (possibly shared via CGNAT) and one or more IPv6 addresses. The problem is that most IP check tools only query IPv4, leaving users completely blind to IPv6 exposure. IPv6 addressing introduces unique privacy risks. Stateless Address Autoconfiguration (SLAAC) can embed your device&apos;s MAC address directly into the interface identifier portion of the IPv6 address, creating a globally trackable hardware fingerprint that follows you across every network.
            </p>
            <p>
              Modern OSes use Privacy Extensions (RFC 4941) to generate temporary random addresses, but not all devices enable this by default. When you check your IP here, we display both protocol versions side-by-side so you can verify your IPv6 privacy configuration is working. Pair this with a <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> to confirm both stacks route properly, or use <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Port Checker</Link> to verify your firewall is not exposing services on either protocol without your knowledge.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Mistakes When Checking Your IP
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most common mistake is using a search engine&apos;s built-in IP display feature, which only shows IPv4 and provides no leak detection. Users also assume that if a VPN client shows &quot;connected,&quot; all traffic is tunneled, but never verify the public IP actually changed. Another critical oversight is ignoring WebRTC leaks: many browsers expose your real IP through JavaScript even with an active VPN. Always test IPv6 separately, as many VPNs do not route IPv6 traffic through the tunnel, leaving your real IPv6 address fully exposed.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Check Your Public IP Address
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Run this check immediately after connecting to a VPN to confirm your IP changed on both IPv4 and IPv6. Test it before and after changing DNS settings to verify no leakage occurs. Use it after router firmware updates, ISP changes, or when configuring a new firewall to confirm your public-facing address is what you expect. It is also the first step in diagnosing asymmetric routing issues or suspected IP blacklisting on forums and services.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About IP Addresses" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "IP Lookup", description: "Trace any IP address location and ISP details", href: "/ip-lookup" },
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "Search", title: "Ping Test", description: "Measure network latency and packet loss", href: "/ping-test" },
              { icon: "Search", title: "Port Checker", description: "Test if a network port is open or filtered", href: "/port-checker" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="what-is-my-ip" />
    </>
  );
}
