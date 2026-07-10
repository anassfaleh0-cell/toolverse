import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE_NAME}`,
  description: `${SITE_NAME} Privacy Policy. Learn how we protect your data, what information we collect, and your rights regarding your personal information when using our free online tools.`,
  openGraph: { title: `Privacy Policy — ${SITE_NAME}`, description: `${SITE_NAME} Privacy Policy — data collection, usage, and protection.`, url: `${SITE_URL}/privacy` },
  twitter: { card: "summary_large_image", title: `Privacy Policy — ${SITE_NAME}`, description: `${SITE_NAME} Privacy Policy — data collection and protection.` },
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Privacy Policy" },
];

export default function Privacy() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Privacy Policy — ${SITE_NAME}`, description: `${SITE_NAME} Privacy Policy — data collection, usage, and protection.`, url: `${SITE_URL}/privacy`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">Last updated: July 9, 2026</p>
        <div className="mt-8 space-y-8 text-text-secondary leading-relaxed">
          <p>
            At {SITE_NAME}, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">1. Information We Collect</h2>
            <h3 className="mt-4 font-medium text-text-primary">Personal Data</h3>
            <p className="mt-1">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1 text-sm">
              <li>Contact us via email or our contact form (name, email address, message)</li>
              <li>Subscribe to our newsletter (email address)</li>
              <li>Report a bug or suggest a feature (name, email address, details)</li>
            </ul>
            <h3 className="mt-4 font-medium text-text-primary">Automatically Collected Information</h3>
            <p className="mt-1">
              When you visit our site, we may automatically collect certain information including:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1 text-sm">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring URL</li>
              <li>Pages visited and time spent on each page</li>
              <li>IP address (anonymized)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">2. How We Use Your Information</h2>
            <p className="mt-2">
              We use the information we collect to:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1 text-sm">
              <li>Provide, operate, and maintain our website and tools</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new tools and features</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Send you technical notices, updates, and administrative messages</li>
              <li>Detect, prevent, and address technical issues and abuse</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">3. Browser-Based Processing</h2>
            <p>
              Most of our tools process your data entirely in your browser. When you use our PDF tools, image editors, text utilities, and similar tools, your files and data never leave your device. There is no server-side processing for these tools.
            </p>
            <p className="mt-2">
              For network tools (DNS lookups, WHOIS queries, SSL checks), requests are routed through secure API endpoints. These requests are not logged or stored. We do not track which domains or IP addresses our users look up.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">4. Cookies and Tracking Technologies</h2>
            <p>
              We use essential cookies for site functionality, including:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1 text-sm">
              <li><strong>Theme preference:</strong> Stores your dark/light mode preference</li>
              <li><strong>Cookie consent:</strong> Records your cookie consent preferences</li>
            </ul>
            <p className="mt-2">
              We do not use tracking cookies for advertising or behavioral targeting. We use privacy-preserving analytics (Plausible or similar) that do not use cookies and do not collect personal data.
            </p>
            <p className="mt-2">
              You can control cookie settings through your browser preferences. Disabling essential cookies may affect site functionality.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">5. Third-Party Services</h2>
            <p>
              We use the following third-party services:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1 text-sm">
              <li><strong>Vercel:</strong> Website hosting and deployment</li>
              <li><strong>Plausible:</strong> Privacy-focused analytics (no cookies)</li>
            </ul>
            <p className="mt-2">
              We do not sell, trade, or rent your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your information. All data transmission occurs over HTTPS/TLS encrypted connections. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">7. Data Retention</h2>
            <p>
              We retain personal information only as long as necessary to fulfill the purposes described in this policy. Analytics data is retained in aggregate form only. Contact form submissions are retained for up to 12 months.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">8. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1 text-sm">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to the processing of your data</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at hello@Nuvora.dev.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text-primary">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@Nuvora.dev" className="text-nuvora-600 hover:underline dark:text-nuvora-400">hello@Nuvora.dev</a>{" "}
              or visit our <Link href="/contact" className="text-nuvora-600 hover:underline dark:text-nuvora-400">Contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
