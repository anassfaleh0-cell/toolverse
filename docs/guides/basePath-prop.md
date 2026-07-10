# ArticleLayout `basePath` Prop

## Overview

The `ArticleLayout` component renders content-piece articles and guides with a consistent layout including breadcrumbs, featured images, table of contents, FAQ, related content, and share buttons. It accepts a `basePath` prop to control URL generation for different content sections.

---

## Usage

```typescript
import { ArticleLayout } from "@/components/blog/article-layout";

// For blog articles (default):
<ArticleLayout piece={myArticle} />
// Breadcrumbs: Home / Blog / Title
// Canonical:  https://site.com/blog/my-slug

// For guides:
<ArticleLayout piece={myGuide} basePath="guides" />
// Breadcrumbs: Home / Guides / Title
// Canonical:  https://site.com/guides/my-slug
```

---

## Prop Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `piece` | `ContentPiece` | required | The content data object |
| `basePath` | `string` | `"blog"` | URL path segment for breadcrumbs and canonical URL |

---

## What Changes with `basePath`

| Property | `basePath="blog"` | `basePath="guides"` |
|---|---|---|
| Breadcrumb label | Blog | Guides |
| Breadcrumb link | `/blog` | `/guides` |
| Canonical URL | `/blog/{slug}` | `/guides/{slug}` |
| Section label badge | Blog | Guides |

---

## When to Use Each

### `basePath="blog"` (default)

For content pieces with `type === "article"` rendered under `/blog/[slug]`.

```typescript
// src/app/blog/[slug]/page.tsx
<ArticleLayout piece={piece} />
// No basePath needed — defaults to "blog"
```

### `basePath="guides"`

For content pieces with `type === "guide"` rendered under `/guides/[slug]`.

```typescript
// src/app/guides/[slug]/page.tsx
const contentGuide = getGuides().find((g) => g.slug === slug);
if (contentGuide) {
  return <ArticleLayout piece={contentGuide} basePath="guides" />;
}
```

---

## Backward Compatibility

The `basePath` prop is optional and defaults to `"blog"`. Existing blog article pages require no changes. All current `ArticleLayout` usage across the codebase continues to work without modification.

```typescript
// OLD — still works:
export function ArticleLayout({ piece }: { piece: ContentPiece })
// basePath defaults to "blog" internally

// NEW — for guides:
export function ArticleLayout({ piece, basePath = "blog" }: { piece: ContentPiece; basePath?: string })
```
