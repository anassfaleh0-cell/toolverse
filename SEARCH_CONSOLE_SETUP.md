# Google Search Console Setup — ToolVerse

## Add Property

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Start Now**
3. Select **URL prefix** method
4. Enter: `https://toolverse.dev`

## Verify Ownership

### Option A: DNS TXT Record (Recommended)
1. In Search Console, copy the TXT verification record
2. Add to your DNS provider:
   ```
   Type:  TXT
   Name:  @
   Value: google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXX
   TTL:   3600
   ```
3. Click **Verify**

### Option B: HTML Meta Tag
1. In Search Console, copy the meta tag content
2. Set as `NEXT_PUBLIC_GOOGLE_VERIFICATION` in Vercel environment variables
3. Redeploy
4. Click **Verify**

## Submit Sitemap

1. In Search Console → **Sitemaps**
2. Enter sitemap URL: `https://toolverse.dev/sitemap.xml`
3. Click **Submit**
4. Verify all 4 sub-sitemaps are discovered:
   - `sitemap-tools.xml`
   - `sitemap-content.xml`
   - `sitemap-landing.xml`
   - `sitemap-static.xml`

## Monitor Performance

- **Performance**: Track clicks, impressions, CTR, position
- **Index Coverage**: Monitor which pages are indexed vs. excluded
- **Core Web Vitals**: LCP, INP, CLS scores
- **Enhancements**: Check structured data (FAQ, HowTo, BreadcrumbList, SoftwareApplication)

## Post-Submission

- Request indexing for high-priority pages via **URL Inspection**
- Monitor for crawl errors in first week
- Check for manual actions
- Verify mobile usability

---

## Bing Webmaster Tools

1. Go to [bing.com/webmasters](https://bing.com/webmasters)
2. Sign in with Microsoft account
3. Add site: `https://toolverse.dev`
4. Import from Google Search Console (quickest setup)
5. Submit sitemap: `https://toolverse.dev/sitemap.xml`

## IndexNow (Bing)

See README_DEPLOY.md for IndexNow setup instructions.
