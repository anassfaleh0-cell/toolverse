import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: `${SITE_NAME}'s commitment to web accessibility. Learn about our efforts to make our free online tools accessible to everyone, including people with disabilities.`,
  openGraph: { title: "Accessibility Statement", description: `${SITE_NAME}'s commitment to web accessibility.`, url: `${SITE_URL}/accessibility` },
  twitter: { card: "summary_large_image", title: "Accessibility Statement", description: `${SITE_NAME}'s commitment to web accessibility.` },
  alternates: { canonical: `${SITE_URL}/accessibility` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Accessibility Statement" },
];

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Accessibility Statement — ${SITE_NAME}`, description: `${SITE_NAME}'s commitment to web accessibility.`, url: `${SITE_URL}/accessibility`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Accessibility Statement</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: July 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section>
              <p className="mt-2">
                {SITE_NAME} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to make our free online tools as inclusive as possible.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Conformance Status</h2>
              <p className="mt-2">
                We aim for conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines define requirements for making web content more accessible to people with a wide range of disabilities, including blindness and low vision, hearing loss, limited movement, speech disabilities, photosensitivity, and cognitive limitations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Accessibility Features</h2>
              <p className="mt-2">The following features are implemented across {SITE_NAME} to support accessibility:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>Skip to main content link</strong> — available as the first focusable element on every page.</li>
                <li><strong>Semantic HTML structure</strong> — landmarks (<code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">header</code>, <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">nav</code>, <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">main</code>, <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">footer</code>) and properly nested heading hierarchy.</li>
                <li><strong>Keyboard navigation support</strong> — all interactive elements are reachable via keyboard with visible <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">focus-visible</code> indicators.</li>
                <li><strong>Screen reader friendly labels</strong> — descriptive <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">aria-label</code> attributes on all interactive elements.</li>
                <li><strong>Reduced motion support</strong> — animations respect the <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">prefers-reduced-motion</code> media query.</li>
                <li><strong>Dark mode support</strong> — full dark theme available to reduce eye strain in low-light environments.</li>
                <li><strong>Adequate color contrast ratios</strong> — all text and UI elements meet WCAG AA contrast requirements.</li>
                <li><strong>44px minimum tap targets</strong> — all interactive elements on mobile have touch targets of at least 44x44 CSS pixels.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Limitations</h2>
              <p className="mt-2">
                While we strive to make every aspect of {SITE_NAME} accessible, some third-party tool integrations — such as ffmpeg.wasm for media processing — may have limited screen reader support due to the nature of their browser-based execution. We are actively working with upstream projects to improve accessibility for these components.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Feedback</h2>
              <p className="mt-2">
                We welcome your feedback on the accessibility of {SITE_NAME}. If you encounter any accessibility barriers while using our tools, please contact us at <a href={`mailto:${BRAND.email}`} className="text-blue-600 hover:underline dark:text-blue-400">{BRAND.email}</a>. We will do our best to respond within 2 business days.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
