# ToolVerse — Production Deployment Guide

## Vercel Deployment

### 1. Connect Repository
- Push the project to GitHub/GitLab
- Go to [vercel.com](https://vercel.com) and import the repository
- Framework preset: **Next.js**
- Root directory: `./toolverse` (if monorepo)

### 2. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Production URL (e.g., `https://toolverse.dev`) |
| `NEXT_PUBLIC_GA4_ID` | No | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_CLARITY_ID` | No | Microsoft Clarity project ID |
| `NEXT_PUBLIC_ADSENSE_ID` | No | Google AdSense publisher ID |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | No | Google Search Console HTML verification string |
| `INDEXNOW_KEY` | No | Bing IndexNow API key |

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**.

### 3. Build Configuration
- Build command: `next build`
- Output directory: `.next`
- Node.js version: 20.x (Vercel default)
- Framework: Next.js (auto-detected)

### 4. Custom Domain
1. Go to **Vercel Dashboard → Project → Domains**
2. Add your domain (e.g., `toolverse.dev`)
3. Follow Vercel's DNS configuration instructions
4. Ensure the domain has:
   - A record pointing to `76.76.21.21` (Vercel proxy IP)
   - CNAME record for `www` pointing to `cname.vercel-dns.com`

### 5. Analytics Setup

#### Google Analytics 4
1. Create a GA4 property in [analytics.google.com](https://analytics.google.com)
2. Copy the Measurement ID (format: `G-XXXXXXXXXX`)
3. Set `NEXT_PUBLIC_GA4_ID` in Vercel environment variables

#### Microsoft Clarity
1. Create a project in [clarity.microsoft.com](https://clarity.microsoft.com)
2. Copy the Project ID
3. Set `NEXT_PUBLIC_CLARITY_ID` in Vercel environment variables

### 6. Search Console

#### Google Search Console
1. Add property in [search.google.com/search-console](https://search.google.com/search-console)
2. Choose **URL prefix** with `https://toolverse.dev`
3. Verify ownership via DNS TXT record or HTML file
4. For HTML verification: set `NEXT_PUBLIC_GOOGLE_VERIFICATION` env var
5. Submit sitemap: `https://toolverse.dev/sitemap.xml`

#### Bing Webmaster
1. Add site in [bing.com/webmasters](https://bing.com/webmasters)
2. Verify ownership (same method as Google)
3. Import from Google Search Console for quick setup
4. Submit sitemap

### 7. IndexNow
1. Generate an API key (any random 32-char hex string)
2. Save as `INDEXNOW_KEY` environment variable
3. Verify key is accessible at `https://toolverse.dev/{key}.txt`
4. Submit URLs: `https://api.indexnow.org/indexnow?url=https://toolverse.dev/sitemap.xml&key={key}`

### 8. Post-Deploy Verification
- [ ] Visit `https://toolverse.dev` — loads correctly
- [ ] Check `https://toolverse.dev/robots.txt`
- [ ] Check `https://toolverse.dev/sitemap.xml`
- [ ] Check `https://toolverse.dev/sitemap-tools.xml`
- [ ] Test a tool page (e.g., `/dns-lookup`)
- [ ] Test a content page (e.g., `/guides/dns-introduction`)
- [ ] Verify HTTPS (auto by Vercel)
- [ ] Run Lighthouse audit
- [ ] Verify Google Analytics is firing (if configured)
- [ ] Verify Search Console receives sitemap
- [ ] Test on mobile device
