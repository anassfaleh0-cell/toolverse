Sprint 31.5: Fix /guides/ 404 — merge content-piece + how-to data sources

Problem: /guides/ index listed content-piece guides from getGuides()
(slugs: dns-lookup-troubleshooting, reverse-dns-troubleshooting, etc.)
but /guides/[slug]/page.tsx generateStaticParams() only returned
programmatic how-to slugs from getHowToSlugs() (use-dns-lookup, etc.).
Every content-piece guide link → 404.

Root cause: Two disconnected data sets for the same route. Index and [slug]
page operated on completely different sources with no overlap.

Fix:
  - guides/[slug]/page.tsx: generateStaticParams() now merges both
    getGuides() and getHowToSlugs(). Page checks content-piece guides
    first, renders via ArticleLayout with basePath="guides", falls back
    to programmatic how-to template, returns notFound() if neither matches.
  - components/blog/article-layout.tsx: added optional basePath prop
    (default "blog"). Breadcrumbs, canonical URL, and section labels
    dynamically adapt to "guides" vs "blog" paths.

Impact:
  - 9,826 pages generated (+12 new content guides, 547+ how-to guides)
  - 0 build errors, 0 TypeScript errors
  - All /guides/ URLs return 200 (verified: dns-lookup-troubleshooting,
    reverse-dns-troubleshooting, dns-propagation-troubleshooting,
    ssl-certificate-troubleshooting, website-status-troubleshooting)
  - Backward compatible: all blog articles unchanged, basePath defaults to "blog"
