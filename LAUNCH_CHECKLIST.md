## 🚀 Nuvora Pre-Launch Checklist

### Code Quality
- [ ] All `console.log` removed
- [ ] All "Toolverse" references replaced with "Nuvora"
- [ ] No hardcoded URLs — everything uses `NEXT_PUBLIC_SITE_URL` or `{DOMAIN}` placeholder
- [ ] `.env.example` created with `NEXT_PUBLIC_SITE_URL`
- [ ] No unused imports or dead code
- [ ] All `process.exit()` calls removed

### Domain & Environment
- [ ] Domain purchased: _______
- [ ] Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to your actual domain
- [ ] Remove `{DOMAIN}` placeholder — already handled by env var at runtime
- [ ] Data files still contain `{DOMAIN}` placeholder — resolved at render time via `resolveSchema()` in content-page.tsx
- [ ] `.env.local` excluded from git (already in `.gitignore`)

### SEO
- [ ] Root `layout.tsx` has proper metadata with `SITE_URL` env variable
- [ ] `sitemap.xml` generated dynamically at `/sitemap.xml`
- [ ] `robots.txt` configured at `/robots.txt`
- [ ] Structured data (JSON-LD) on all page types:
  - [ ] Homepage: Organization + WebSite schema
  - [ ] Tool pages: WebApplication schema
  - [ ] Content pages: Article schema + BreadcrumbList
  - [ ] FAQ sections: FAQPage schema
- [ ] `not-found.tsx` (404 page) styled with helpful links
- [ ] Semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>` in use
- [ ] Canonical URLs use `SITE_URL` on every page
- [ ] OG + Twitter card images at `/og-image.svg`

### Content
- [ ] Privacy Policy page ready
- [ ] Terms of Service page ready
- [ ] FAQ page ready
- [ ] About page ready
- [ ] All tool descriptions unique and SEO-optimized
- [ ] No lorem ipsum or placeholder text remaining
- [ ] 404 page has helpful navigation to popular tools

### Performance
- [ ] Images use `next/image` or proper sizing
- [ ] Font loading uses `font-display: swap` (Geist fonts)
- [ ] Bundle analysis run (`npm run analyze` or `ANALYZE=true next build`)
- [ ] Lazy loading for below-fold content
- [ ] Dark mode: zero flicker on load (`next-themes` with `attribute="class"`)
- [ ] Dark mode verified on ALL pages
- [ ] Core functionality works without JS (progressive enhancement)

### Launch Day
- [ ] Domain purchased: _______
- [ ] Update `NEXT_PUBLIC_SITE_URL` in production env (Vercel dashboard)
- [ ] Run `npm run build` — verify zero errors
- [ ] Run `npm run lint` — verify zero warnings
- [ ] Deploy to production (Vercel)
- [ ] Verify all 255+ tools load correctly
- [ ] Test dark mode on all pages (homepage, tool pages, content pages, 404)
- [ ] Test on mobile + desktop
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Test structured data with Google Rich Results Test
- [ ] Run Lighthouse audit (target 90+ all categories)
- [ ] Share on social media
