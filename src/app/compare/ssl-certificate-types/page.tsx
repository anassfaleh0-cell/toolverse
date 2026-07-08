import type { Metadata } from "next";
import Link from "next/link";
import {
  ComparisonMatrix,
  Breadcrumbs,
  SocialShare,
  JsonLd,
} from "@/components/shared";
import {
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "compare/ssl-certificate-types";
const pageTitle = "SSL Certificate Types Compared — DV vs OV vs EV";
const pageDescription =
  "Compare Domain Validation (DV), Organization Validation (OV), and Extended Validation (EV) SSL certificates. Understand validation levels, issuance times, costs, and browser UI indicators to choose the right certificate for your website.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Comparisons", href: `${SITE_URL}/compare` },
  { label: "SSL Certificate Types" },
];

export default function SslCertificateTypesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                SSL Certificate Types Compared
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {pageDescription}
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Certificate Type Comparison
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            SSL certificates are categorized by validation level. Higher validation levels provide greater trust signals in the browser but require more rigorous verification.
          </p>
          <div className="mt-8">
            <ComparisonMatrix
              title="DV vs OV vs EV Certificates"
              headers={["DV (Domain Validation)", "OV (Organization Validation)", "EV (Extended Validation)"]}
              rows={[
                { feature: "Validation Level", values: ["Basic", "Medium", "High"] },
                { feature: "Issuance Time", values: ["Minutes", "1–3 Business Days", "3–7 Business Days"] },
                { feature: "Cost Range (per year)", values: ["$0 – $10", "$50 – $200", "$100 – $500"] },
                { feature: "Browser UI Indicator", values: ["Padlock only", "Padlock + Org Name", "Green bar / Org Name"] },
                { feature: "Organization Verification", values: ["No", "Yes", "Yes (rigorous)"] },
                { feature: "Domain Verification", values: ["Yes", "Yes", "Yes"] },
                { feature: "Best For", values: ["Blogs, personal sites, internal tools", "Business websites, SaaS platforms", "E-commerce, banking, enterprise"] },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Wildcard &amp; Multi-Domain Certificates
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Wildcard Certificates</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                A wildcard certificate (<code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">*.example.com</code>) secures an unlimited number of single-level subdomains under the same base domain. Only DV and OV validation are available for wildcards — EV wildcards do not exist. Wildcards are cost-effective for sites with many subdomains (blog.example.com, shop.example.com, api.example.com) but cannot secure the bare domain unless explicitly listed as a SAN.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Multi-Domain (SAN / UCC) Certificates</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Multi-domain certificates (also called Subject Alternative Name or Unified Communications Certificates) secure multiple distinct domain names under one certificate. A single SAN certificate can cover example.com, example.org, api.example.com, and shop.example.net. SAN certs support DV, OV, and EV validation levels. They simplify certificate management when you have multiple domains but require all domains to be renewed at the same time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            When to Choose Each Certificate Type
          </h2>
          <div className="mt-8 space-y-10">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">DV Certificates — When Speed Matters Most</h3>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Domain Validation certificates are the fastest and cheapest option. Issuance is fully automated — you prove control of the domain by responding to an email, adding a DNS TXT record, or uploading a file to your web server. DV certificates provide the same encryption strength (TLS handshake, 2048-bit RSA or ECDSA keys) as higher-tier certificates. The difference is identity: no organization information is verified or displayed.
                </p>
                <p>
                  Choose DV for personal blogs, informational sites, staging environments, internal tools, and any scenario where low cost and rapid deployment outweigh the need for visible organizational trust. Services like Let&apos;s Encrypt have made DV certificates free and ubiquitous. Use our <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> to verify your DV certificate is correctly installed and includes the full certificate chain.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">OV Certificates — Balancing Trust and Cost</h3>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Organization Validation certificates verify the legal identity of the entity behind the website. The Certificate Authority checks business registration records, DUNS numbers, or equivalent documentation before issuing. This adds 1–3 days to issuance but places the organization name in the certificate, visible to users who click the padlock.
                </p>
                <p>
                  OV is the standard choice for business websites, SaaS platforms, and any site where users expect to see a verifiable company identity. It is also required by many payment gateways and API providers. Run the <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> after installation to confirm the organization field is populated correctly.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">EV Certificates — Maximum Trust for High-Stakes Sites</h3>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Extended Validation certificates require the most rigorous vetting process. The CA must verify the organization&apos;s legal existence, physical address, and operational presence through phone calls, database cross-references, and official documentation. EV certificates historically triggered a green address bar in browsers, though modern browsers have simplified this to showing the organization name in the identity area.
                </p>
                <p>
                  EV is the gold standard for e-commerce, banking, government, healthcare, and any site handling sensitive user data or financial transactions. The higher cost and longer issuance timeline are justified by the maximum level of user trust. Verify EV certificate details with our <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> — check that the policy field contains the EV policy OID and the organization name displays correctly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Recommendations by Use Case
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Personal Blog</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">DV — Free via Let&apos;s Encrypt, automated renewal, full encryption.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Small Business</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">OV — Shows company name, affordable, builds customer confidence.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">E-commerce Store</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">EV — Maximum trust at checkout, required by many payment processors.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">SaaS Platform</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">OV or EV — OV for most, EV for enterprise-tier or finance features.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Multi-Subdomain Site</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Wildcard DV — One certificate covers all subdomains at minimal cost.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Multiple Domains</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Multi-Domain OV — One cert for different domains, simpler management.</p>
            </div>
          </div>
          <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
            After deploying any certificate, always run the <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> to validate the installation, check the certificate chain, and confirm the certificate is trusted by all major browsers and clients.
          </p>
        </div>
      </section>
    </>
  );
}
