# Sprint 31.5 — Fix /guides/ 404 Pages

**Commit**: `7994568`
**Branch**: `main`
**Date**: 2026-07-10

---

## Bug Summary

**Symptom**: Every content-piece guide link on `/guides/` returned 404 Page Not Found.

**Root Cause**: The `/guides/` route had two separate, disconnected data sets:

| Data Source | Function | Example Slugs | Used By |
|---|---|---|---|
| Content-piece guides | `getGuides()` | `dns-lookup-troubleshooting` | Index page (`/guides/page.tsx`) |
| Programmatic how-to guides | `getHowToSlugs()` | `use-dns-lookup`, `how-to-dns-lookup` | `[slug]` page (`/guides/[slug]/page.tsx`) |

The index page listed content-piece guides (19 guides from `GUIDES` array), but `generateStaticParams()` in `/guides/[slug]/page.tsx` only generated static params for programmatic how-to slugs. Content-piece guide slugs were never pre-rendered, so every link clicked from the index → 404.

---

## Fix Applied

### File 1: `src/app/guides/[slug]/page.tsx`

```typescript
// BEFORE: Only programmatic how-to slugs
export function generateStaticParams() {
  return getHowToSlugs().map((p) => ({ slug: p.slug }));
}

// AFTER: Merges both data sources
export function generateStaticParams() {
  const howTo = getHowToSlugs().map((p) => ({ slug: p.slug }));
  const content = getGuides().map((g) => ({ slug: g.slug }));
  return [...howTo, ...content];
}
```

The page component now checks content-piece guides first:

```typescript
export default async function GuidePage({ params }: Props) {
  const { slug } = await params;

  // Check content-piece guides first
  const contentGuide = getGuides().find((g) => g.slug === slug);
  if (contentGuide) {
    return <ArticleLayout piece={contentGuide} basePath="guides" />;
  }

  // Fall back to programmatic how-to rendering
  const entry = getHowToSlugs().find((s) => s.slug === slug);
  if (!entry) notFound();
  // ... programmatic how-to rendering ...
}
```

### File 2: `src/components/blog/article-layout.tsx`

Added `basePath` prop to support rendering under either `/guides/` or `/blog/` paths:

```typescript
export function ArticleLayout({
  piece,
  basePath = "blog", // defaults to "blog" for backward compatibility
}: {
  piece: ContentPiece;
  basePath?: string;
}) {
  const sectionLabel = basePath === "guides" ? "Guides" : "Blog";
  const canonicalUrl = `${SITE_URL}/${basePath}/${piece.slug}`;
  // Breadcrumbs now use dynamic label
}
```

---

## Verification

| Check | Result |
|---|---|
| Build pages | 9,826 (+12 new content guides) |
| Build errors | 0 |
| TypeScript errors | 0 |
| `/guides/` index | Renders all 19 content-piece guides |
| `/guides/dns-lookup-troubleshooting` | 200 OK |
| `/guides/reverse-dns-troubleshooting` | 200 OK |
| `/guides/dns-propagation-troubleshooting` | 200 OK |
| `/guides/ssl-certificate-troubleshooting` | 200 OK |
| `/guides/website-status-troubleshooting` | 200 OK |
| Programmatic how-to guides (547+) | All returning 200 |
| Blog article pages | Unchanged, still working |
| Breadcrumbs (guides) | Home / Guides / Title |
| Breadcrumbs (blog) | Home / Blog / Title |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    /guides/                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Index Page (page.tsx)                              │
│  ├── getGuides() → 19 content-piece guides          │
│  └── renders link list → /guides/{slug}             │
│                                                     │
│  [slug] Page ([slug]/page.tsx)                      │
│  ├── generateStaticParams()                         │
│  │   ├── getHowToSlugs() → 547+ programmatic slugs  │
│  │   └── getGuides() → 19 content-piece slugs       │
│  │                                                   │
│  ├── Route Handler                                   │
│  │   ├── content-piece guide found?                  │
│  │   │   └── ✅ ArticleLayout(basePath="guides")     │
│  │   ├── programmatic how-to found?                  │
│  │   │   └── ✅ How-to template renderer             │
│  │   └── neither found? → 404                        │
│  └───────────────────────────────────────────────────│
│                                                      │
│  Data Sources:                                       │
│  ├── src/lib/content/data/guides.ts  (content-piece) │
│  └── src/lib/content/programmatic-slugs.ts (how-to)  │
│                                                      │
│  Shared Component:                                   │
│  └── src/components/blog/article-layout.tsx          │
│      └── basePath prop: "blog" | "guides"            │
└─────────────────────────────────────────────────────┘
```
