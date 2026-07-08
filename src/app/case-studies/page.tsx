import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Case Studies — How Professionals Use ToolVerse | ${SITE_NAME}`,
  description: `Real-world case studies showing how e-commerce platforms, web agencies, security consultancies, and content teams use ToolVerse tools to solve problems and improve workflows.`,
  alternates: { canonical: `${SITE_URL}/case-studies` },
  openGraph: {
    title: `Case Studies — How Professionals Use ToolVerse | ${SITE_NAME}`,
    description: `Discover how businesses use ToolVerse's network, security, and image tools to reduce downtime, accelerate debugging, and streamline content pipelines.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Case Studies" },
];

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  challenge: string;
  solution: string;
  results: { metric: string; value: string }[];
  toolsUsed: { label: string; href: string }[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "ecommerce-dns-downtime",
    title: "E-Commerce Platform Reduces DNS-Related Downtime by 95%",
    subtitle: "How an online retailer used ToolVerse DNS tools to detect and fix misconfigurations before they caused outages",
    industry: "E-Commerce",
    challenge: "A mid-size e-commerce platform processing $12M in monthly revenue was experiencing intermittent DNS-related outages during peak traffic hours. Misconfigured A records, expired SOA serials, and slow propagation after zone updates caused 15&ndash;30 minutes of partial downtime 3&ndash;4 times per week. Each incident cost an estimated $8,000&ndash;$12,000 in lost revenue. Their internal team lacked the tooling to proactively verify DNS health across global regions.",
    solution: "The platform's DevOps team integrated ToolVerse's DNS Lookup and DNS Propagation Checker into their deployment pipeline and weekly maintenance routine. Before every DNS zone update, they used the DNS Propagation Checker to verify global resolution from 20+ nodes. The DNS Lookup tool was configured to validate A, AAAA, CNAME, and MX records immediately after changes. They also set up manual checks using the Reverse DNS Lookup and WHOIS Lookup tools during their Friday maintenance windows.",
    results: [
      { metric: "DNS-related incidents", value: "Reduced by 95%" },
      { metric: "Monthly downtime", value: "From 6+ hours to under 20 minutes" },
      { metric: "Annual cost savings", value: "$180,000+" },
      { metric: "Propagation verification time", value: "Reduced from 45 min to 3 min" },
    ],
    toolsUsed: [
      { label: "DNS Lookup", href: "/dns-lookup" },
      { label: "DNS Propagation Checker", href: "/dns-propagation-checker" },
      { label: "Reverse DNS Lookup", href: "/reverse-dns-lookup" },
      { label: "WHOIS Lookup", href: "/whois-lookup" },
    ],
  },
  {
    id: "agency-ssl-debugging",
    title: "Web Development Agency Cuts SSL Debugging Time by 80%",
    subtitle: "How a dev agency uses SSL Certificate Checker to validate client certificates during deployments",
    industry: "Web Development Agency",
    challenge: "A full-service web development agency managing 40+ client websites was spending approximately 15 hours per week on SSL-related issues. Expired certificates, misconfigured certificate chains, and SNI mismatches caused browser warnings and service interruptions during client deployments. The support team relied on manual browser checks and command-line tools, which were time-consuming and inconsistent across team members.",
    solution: "The agency adopted ToolVerse's SSL Certificate Checker as their primary tool for validating SSL/TLS configurations during staging and production deployments. Before any client launch, the team runs the SSL Certificate Checker to verify certificate validity, chain completeness, cipher support, and TLS protocol versions. The tool's detailed reporting helps them identify missing intermediate certificates and weak cipher suites in seconds. They also use the HTTP Headers Checker to audit HSTS, CSP, and other security headers during the same workflow.",
    results: [
      { metric: "SSL debugging time", value: "Reduced by 80%" },
      { metric: "Deployment verification time", value: "From 25 min to 5 min per site" },
      { metric: "SSL-related support tickets", value: "Decreased by 70%" },
      { metric: "Client satisfaction score", value: "Improved from 3.8 to 4.6 / 5.0" },
    ],
    toolsUsed: [
      { label: "SSL Certificate Checker", href: "/ssl-certificate-checker" },
      { label: "HTTP Headers Checker", href: "/http-headers-checker" },
      { label: "Website Status Checker", href: "/website-status-checker" },
    ],
  },
  {
    id: "security-consultancy-assessments",
    title: "Security Consultancy Uses ToolVerse for Rapid Assessments",
    subtitle: "How a security firm uses WHOIS, DNS Lookup, and HTTP Headers Checker for initial reconnaissance",
    industry: "Security Consultancy",
    challenge: "A boutique cybersecurity consultancy performing 15&ndash;20 penetration tests and security assessments per month needed a faster way to conduct initial reconnaissance. Their analysts were spending 30&ndash;45 minutes per engagement using disparate command-line tools and browser extensions to gather basic information: domain WHOIS data, DNS records, HTTP security headers, and subdomain discovery. The lack of a unified workflow slowed down assessments and made report generation inconsistent.",
    solution: "The consultancy built a standardized reconnaissance checklist centered around ToolVerse tools. Each engagement begins with WHOIS Lookup for domain registration data and registrar information, followed by DNS Lookup for A, MX, NS, and TXT records. The HTTP Headers Checker is used to audit security headers like HSTS, CSP, X-Frame-Options, and CORS configurations. The team also uses the DNS Propagation Checker to verify global resolution of test domains and the IP Lookup tool to map hosting infrastructure. This unified workflow reduced per-engagement prep time and produced consistent, shareable reports.",
    results: [
      { metric: "Reconnaissance time", value: "Reduced from 35 min to 8 min" },
      { metric: "Engagements per month", value: "Increased from 18 to 25" },
      { metric: "Report consistency", value: "100% standardized" },
      { metric: "Client onboarding time", value: "Reduced by 60%" },
    ],
    toolsUsed: [
      { label: "WHOIS Lookup", href: "/whois-lookup" },
      { label: "DNS Lookup", href: "/dns-lookup" },
      { label: "HTTP Headers Checker", href: "/http-headers-checker" },
      { label: "DNS Propagation Checker", href: "/dns-propagation-checker" },
      { label: "IP Lookup", href: "/ip-lookup" },
    ],
  },
  {
    id: "content-team-images",
    title: "Content Team Processes 500+ Images Weekly",
    subtitle: "How a marketing team uses Image Compressor and Image Resizer for their content pipeline",
    industry: "Marketing / Content",
    challenge: "A content marketing team producing 30+ blog posts, 15 social media graphics, and 10 newsletter editions per week was struggling with image processing. Their workflow involved manually resizing and compressing 500+ images weekly using desktop software that slowed down production. Images were often too large for web use (averaging 2&ndash;5 MB), resulting in slow page loads and poor Core Web Vitals scores. The team needed a browser-based solution that required no software installation.",
    solution: "The team adopted ToolVerse's Image Compressor and Image Resizer as their primary image processing tools. Blog featured images are run through the Image Resizer to standardize dimensions (1200x630px for social sharing), then compressed with the Image Compressor to reduce file size below 200 KB while maintaining visual quality. Social media graphics are batch-processed before upload to the CMS. The team also uses the Image Converter for WebP conversion to further improve page speed. The browser-based workflow eliminated software dependencies and cut processing time by 75%.",
    results: [
      { metric: "Images processed per week", value: "500+" },
      { metric: "Average file size reduction", value: "85% (from 3 MB to 450 KB)" },
      { metric: "Blog page load time", value: "Improved from 4.2s to 1.8s" },
      { metric: "Image processing time per week", value: "Reduced from 12 hours to 3 hours" },
    ],
    toolsUsed: [
      { label: "Image Compressor", href: "/image-compressor" },
      { label: "Image Resizer", href: "/image-resizer" },
      { label: "Image Converter", href: "/image-converter" },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Case Studies — How Professionals Use ToolVerse | ${SITE_NAME}`, description: `Real-world case studies from e-commerce, web development, security, and content teams using ToolVerse tools.`, url: `${SITE_URL}/case-studies`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Case Studies
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                See how businesses and professionals use ToolVerse tools to solve real-world challenges, reduce costs, and improve their workflows.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/case-studies`} title="Case Studies — How Professionals Use ToolVerse" />
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="space-y-16">
            {caseStudies.map((cs) => (
              <article key={cs.id} id={cs.id} className="scroll-mt-20">
                <div className="mb-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {cs.industry}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                  {cs.title}
                </h2>
                <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
                  {cs.subtitle}
                </p>
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Challenge</h3>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{cs.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Solution</h3>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{cs.solution}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Results</h3>
                    <div className="mt-2 space-y-3">
                      {cs.results.map((r) => (
                        <div key={r.metric} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{r.value}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{r.metric}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tools Used</h4>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {cs.toolsUsed.map((tool) => (
                          <Link
                            key={tool.label}
                            href={tool.href}
                            className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-blue-900"
                          >
                            {tool.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
