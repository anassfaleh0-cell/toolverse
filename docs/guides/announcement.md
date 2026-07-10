# Engineering Announcement: /guides/ 404 Fixed

**Date**: 2026-07-10
**Sprint**: 31.5
**Commit**: `7994568`

---

## Summary

All `/guides/` content-piece pages now serve correctly. The fix was deployed to production in Sprint 31.5. Build is stable at 9,826 pages with 0 errors.

---

## What Was Wrong

The `/guides/` index page listed content-piece guides (e.g., "DNS Lookup Troubleshooting Guide"), but when you clicked one, it returned 404 because `generateStaticParams()` was only generating programmatic how-to slugs. Two data sources existed for guides but only one was being pre-rendered.

## What We Did

- Merged both data sources in `generateStaticParams()` — content-piece slugs + programmatic how-to slugs are now both pre-rendered
- Made `ArticleLayout` accept a `basePath` prop (`"blog"` or `"guides"`) so content pieces render with the correct breadcrumbs, canonical URL, and labels
- Added 12 content-piece guide pages that now generate at build time

## Build Stats

| Metric | Value |
|---|---|
| Total pages | 9,826 |
| Build errors | 0 |
| TypeScript errors | 0 |
| New guide pages | 12 content-piece + 547+ programmatic |

## What to Watch For

- When adding new content-piece guides to `guides.ts`, verify the slug appears in the build output under `/guides/[slug]`
- The `ArticleLayout` component now has an optional `basePath` prop — blog articles don't need to change (defaults to `"blog"`), but any new usage should specify the correct path
- If you're adding a new content type, check `registry.ts` `TYPE_ROUTE_MAP` and create the corresponding `sitemap-{type}.xml` route

## Verification

- Spot-checked 5 guide URLs → all return 200
- Blog articles unchanged and working
- Programmatic how-to guides (547+) all working
- Lighthouse scores unaffected

---

*Questions? Ping the web team in #engineering.*
