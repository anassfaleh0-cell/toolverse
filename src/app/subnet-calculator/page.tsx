import type { Metadata } from "next";
import { SubnetCalculator } from "@/components/subnet-calculator/subnet-calculator";
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

const slug = "subnet-calculator";
const pageTitle = "Subnet Calculator - IPv4 CIDR Subnetting Tool Online";
const pageDescription =
  "Calculate IPv4 subnet details from an IP address and CIDR prefix. Get network address, broadcast address, usable host range, subnet mask, and total hosts instantly.";

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
  { label: "Subnet Calculator" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is a subnet and why is subnetting used?",
    answer:
      "A subnet (short for subnetwork) is a logical subdivision of an IP network. Subnetting divides a larger network into smaller, manageable segments to improve performance, enhance security, reduce broadcast domains, and conserve IPv4 address space. Each subnet has its own network address, broadcast address, and range of usable host addresses determined by the subnet mask.",
  },
  {
    question: "What does CIDR notation mean?",
    answer:
      "CIDR (Classless Inter-Domain Routing) notation represents an IP address and its subnet mask using a forward slash followed by a number (e.g., 192.168.1.0/24). The number after the slash indicates how many bits are used for the network portion of the address. A /24 means 24 bits are for the network and 8 bits for hosts, allowing 254 usable addresses.",
  },
  {
    question: "How do I calculate the subnet mask from a CIDR prefix?",
    answer:
      "The subnet mask is derived by setting the first N bits (where N is the CIDR prefix) to 1 and the remaining bits to 0. For example, /24 in binary is 11111111.11111111.11111111.00000000, which converts to 255.255.255.0 in decimal. The calculator handles this conversion automatically and displays the mask in both decimal and binary formats.",
  },
  {
    question: "What is the difference between total hosts and usable hosts?",
    answer:
      "Total hosts is the total number of IP addresses in the subnet (2^(32-CIDR)). Usable hosts excludes the network address (first address) and the broadcast address (last address), which are reserved. For a /24 subnet, total hosts is 256, while usable hosts is 254. For /31 subnets (point-to-point links), both addresses are usable since there is no broadcast.",
  },
  {
    question: "What is the wildcard mask used for?",
    answer:
      "The wildcard mask is the bitwise inverse of the subnet mask. It is commonly used in access control lists (ACLs) and routing protocols to specify which bits of an IP address should be matched (0 bits) or ignored (1 bits). For example, a subnet mask of 255.255.255.0 has a wildcard mask of 0.0.0.255.",
  },
  {
    question: "Can this calculator handle supernetting (prefixes smaller than /24)?",
    answer:
      "Yes. The calculator works with any CIDR prefix from 0 to 32. Prefixes smaller than /24 (like /16 or /8) represent larger networks with more hosts. For example, a /16 network contains 65,534 usable hosts. This is useful for planning large-scale network deployments and understanding IP allocation strategies.",
  },
  {
    question: "What is the broadcast address and why is it reserved?",
    answer:
      "The broadcast address is the last address in a subnet range. It is used to send data packets to all devices on the subnet simultaneously. It is reserved because any traffic sent to this address is broadcast to every host on the network segment. For example, in 192.168.1.0/24, the broadcast address is 192.168.1.255.",
  },
  {
    question: "How does subnetting relate to network security?",
    answer:
      "Subnetting improves network security by isolating traffic between different segments. You can place servers on one subnet, workstations on another, and guest Wi-Fi on a third, with firewall rules controlling traffic between them. This limits the blast radius of security breaches and makes network monitoring more effective. For checking which IP addresses are active on your network, use the <Link href=\"/ping-test\" className=\"text-blue-600 hover:underline dark:text-blue-400\">Ping Test</Link> tool.",
  },
];

export default function SubnetCalculatorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Subnet Calculator"
            description="Enter an IPv4 address and CIDR prefix length to calculate the network address, broadcast address, usable host range, subnet mask, total hosts, and wildcard mask. Perfect for network engineers, administrators, and students learning subnetting."
            breadcrumbs={breadcrumbs}
          >
            <SubnetCalculator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Subnetting Matters in Modern Networking
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Subnetting is a fundamental skill for network administrators, DevOps engineers, and cloud architects. It enables efficient use of IPv4 address space, which is a finite and increasingly scarce resource. Without subnetting, organizations would waste thousands of IP addresses by assigning entire class-based networks (Class A, B, or C) regardless of actual need. With CIDR and subnetting, you can allocate exactly the number of addresses each segment requires — a /30 for a point-to-point link (2 usable addresses), a /29 for a small office (6 usable), or a /24 for a department (254 usable).
            </p>
            <p>
              Cloud networking makes subnetting even more critical. Virtual Private Clouds (VPCs) in AWS, Azure, and Google Cloud all require CIDR blocks for their subnets. Choosing the wrong CIDR range can lead to IP exhaustion, routing conflicts, or inability to peer networks later. This calculator helps you verify that your planned subnet will fit within your VPC range and provide enough host addresses for your instances. For understanding which IP addresses are associated with your network interfaces, the <Link href="/ip-lookup" className="text-blue-600 hover:underline dark:text-blue-400">IP Lookup</Link> tool can reveal geolocation and ISP details for any address within your subnet.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Network Addresses, Broadcasts, and Host Ranges
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every subnet has three critical addresses. The network address is the first address in the range, where all host bits are set to 0. It identifies the subnet itself and cannot be assigned to any device. The broadcast address is the last address, where all host bits are set to 1. Traffic sent to this address reaches every host in the subnet. Between these two reserved addresses lies the usable host range, which includes every address that can be assigned to devices like computers, servers, routers, and printers.
            </p>
            <p>
              The subnet mask determines exactly where the boundary between the network portion and the host portion of the address falls. In binary, the subnet mask has consecutive 1s for the network bits followed by 0s for the host bits. The number of host bits determines the size of the subnet: with N host bits, you get 2^N total addresses minus 2 for the network and broadcast. For /31 subnets used in point-to-point links, the total hosts is 2 and both are usable since there is no broadcast domain. Use the <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> tool to map domain names to the IP addresses within your subnets.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Subnetting" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🌐", title: "IP Lookup", description: "Look up any IPv4 or IPv6 address with geolocation and ISP details", href: "/ip-lookup" },
              { icon: "📡", title: "DNS Lookup", description: "Look up DNS records for any domain name", href: "/dns-lookup" },
              { icon: "📶", title: "Ping Test", description: "Test network latency and packet loss to any host", href: "/ping-test" },
              { icon: "🔍", title: "WHOIS Lookup", description: "Look up domain registration and ownership information", href: "/whois-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="subnet-calculator" />
    </>
  );
}
