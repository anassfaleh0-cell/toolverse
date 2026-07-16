# Domain Launch Checklist

To be executed AFTER purchasing the custom domain and BEFORE submitting to Search Console.

## Phase 1: Vercel & DNS Setup

- [ ] 1. **Set `NEXT_PUBLIC_SITE_URL` in Vercel env vars**
  - Go to Vercel → Project → Settings → Environment Variables
  - Add `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
  - Re-deploy production (this fixes sitemap.xml, OG tags, canonical URLs)

- [ ] 2. **Add custom domain in Vercel**
  - Vercel → Project → Settings → Domains → Add `yourdomain.com`
  - Note the DNS target/resolver values Vercel provides

- [ ] 3. **Update DNS records at registrar**
  - Add CNAME/ALIAS record for root domain pointing to `cname.vercel-dns.com`
  - Add CNAME record for `www` pointing to `cname.vercel-dns.com`

- [ ] 4. **Re-deploy production**

## Phase 2: Post-Deploy Verification

- [ ] 5. **Verify site loads on new domain**
  - https://yourdomain.com (root)
  - https://yourdomain.com/dns-lookup (sub-page)

- [ ] 6. **Verify HTTPS is active** (Vercel provisions SSL automatically)

- [ ] 7. **Re-run this full audit against the new domain URL**
  - Lighthouse (mobile + desktop) — 3 pages × 2 devices
  - Functional smoke test — 13 tools
  - Content spot-check — 8 random pages
  - Icon audit
  - Debug code sweep

## Phase 3: Search Console

- [ ] 8. **Verify domain ownership in Google Search Console**
  - Method: DNS TXT record (recommended, covers all subdomains)
  - Or: HTML file upload (specific URL only)

- [ ] 9. **Submit sitemap**
  - URL: `https://yourdomain.com/sitemap.xml`
  - In Search Console → Sitemaps → Enter URL

- [ ] 10. **Request indexing for key pages**
  - Homepage
  - Key tool pages (dns-lookup, ssl-checker, password-generator, etc.)
  - Blog listing
  - Use URL Inspection tool in Search Console

## Phase 4: Monitoring

- [ ] 11. **Check sitemap is exposing the correct domain**
  - Fetch `https://yourdomain.com/sitemap.xml`
  - All `<loc>` URLs should use the new domain

- [ ] 12. **Verify OG tags and canonical URLs use new domain**
  - Check `<meta property="og:url" content="https://yourdomain.com/...">`
  - Check `<link rel="canonical" href="https://yourdomain.com/...">`

- [ ] 13. **Fix missing og:image on tool pages**
  - `/dns-lookup` has no `og:image` tag — confirm it inherits default or add per-page OG image
  - Spot-check 5 random tool pages for same issue
