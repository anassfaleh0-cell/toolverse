# Pull Request Template: Content Addition

## Description

<!-- Brief description of what content is being added -->

- **Type**: guide / article / comparison / tutorial
- **Related issue**: #

---

## Content Checklist

### Data Entry

- [ ] Entry added to the correct data file (`guides.ts`, `articles.ts`, etc.)
- [ ] `slug` is unique and kebab-case
- [ ] `type` matches the content type exactly (one of: `guide`, `article`, `tutorial`, `comparison`, `learn`, `examples`, `errors`, `reference`, `cheat-sheet`, `best-practices`, `commands`, `use-cases`)
- [ ] `title` is descriptive and within 70 characters
- [ ] `description` is 120–160 characters for SEO
- [ ] `difficulty` is `beginner`, `intermediate`, or `advanced`
- [ ] `toolSlugs` all reference existing tools (verify with `getAllTools()`)
- [ ] `relatedContent` slugs all reference existing content pieces
- [ ] `readingTimeMinutes` is accurate (word count / 200)
- [ ] `publishedAt` / `updatedAt` are valid ISO 8601 dates in 2026
- [ ] Each `section` has both `heading` and `body`
- [ ] Body text uses supported syntax only: `` `code` ``, `> blockquote`, `### subheading`, `tip:`/`warning:`/`note:` callouts, `- list items`

### Routing

- [ ] If adding a new content type, route file exists at `src/app/{route}/[slug]/page.tsx`
- [ ] `generateStaticParams()` in the route includes the new slug
- [ ] Route handles the content type correctly (type check in page component)

### Internal Links

- [ ] All internal links to the new content use correct paths (`/guides/`, `/blog/`, etc.)
- [ ] `related-content.tsx` type map includes the content type if new
- [ ] `sitemap-{type}.xml` route includes the new slugs
- [ ] `registry.ts` `TYPE_ROUTE_MAP` includes the content type if new

---

## Build Verification

- [ ] `npm run tsc --noEmit` passes with 0 errors
- [ ] `npm run build` completes with 0 errors
- [ ] New pages appear in build output (check total count)
- [ ] Spot-check 3 URLs from the new content return 200 at build

---

## Post-Deploy

- [ ] Verify live URLs return 200
- [ ] Verify internal links from related content pages work
- [ ] Check Lighthouse score is not regressed
- [ ] Confirm sitemap includes new URLs

---

## Screenshots (if applicable)

<!-- Before/after screenshots for UI changes -->
