# Adding Content-Piece Guides

Content-piece guides are hand-authored, structured guides stored in `src/lib/content/data/guides.ts`. Unlike programmatic how-to guides (auto-generated from tool slugs), these are written for specific troubleshooting scenarios.

---

## How to Add a New Guide

### 1. Add the data entry

Open `src/lib/content/data/guides.ts` and append a new entry to the `GUIDES` array:

```typescript
{
  slug: "your-guide-slug",
  type: "guide",
  title: "Your Guide Title: Descriptive Subtitle",
  description: "One-paragraph description for SEO and listing cards.",
  difficulty: "beginner",       // "beginner" | "intermediate" | "advanced"
  category: "network-internet",  // see ContentPiece type for valid categories
  toolSlugs: ["dns-lookup"],     // tool slug this guide relates to
  relatedContent: [              // slugs of related content pieces
    "dns-lookup-troubleshooting",
    "dns-lookup-beginners",
  ],
  readingTimeMinutes: 12,
  publishedAt: "2026-07-10",
  updatedAt: "2026-07-10",
  sections: [
    {
      heading: "First Section Heading",
      body: "Section body text. Supports inline `code` syntax, > blockquotes, ### subheadings, tip: / warning: / note: callouts, and - list items.",
    },
    {
      heading: "Second Section Heading",
      body: "More content here.",
    },
  ],
}
```

### 2. Verify the guide appears

```bash
npm run dev
```

Visit:
- `http://localhost:3000/guides` — your guide should appear in the listing
- `http://localhost:3000/guides/your-guide-slug` — page should render with proper layout

### 3. Build and confirm

```bash
npm run build
```

Check the build output for:
- Total page count increased (should be 9,826+)
- `/guides/your-guide-slug` listed under the `● (SSG)` section
- 0 errors

---

## Validation Checklist

- [ ] `slug` is unique across all `GUIDES` entries
- [ ] `type` is `"guide"` (not `"article"` or `"tutorial"`)
- [ ] `toolSlugs` references an existing tool (verify via `getAllTools()`)
- [ ] `relatedContent` slugs match existing content pieces
- [ ] `readingTimeMinutes` accurately reflects content length
- [ ] `publishedAt` and `updatedAt` are valid ISO dates
- [ ] Sections have both `heading` and `body` fields
- [ ] `npm run build` passes with 0 errors
