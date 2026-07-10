# Nuvora — Production Launch Checklist

## Pre-Launch

- [ ] Buy domain name (e.g., Nuvora.dev)
- [ ] Configure domain DNS for Vercel
- [ ] Connect Vercel project to Git repository
- [ ] Set all environment variables in Vercel
- [ ] Verify production build passes: `npm run build`

## Domain & DNS

- [ ] Custom domain added to Vercel project
- [ ] A record: `@` → `76.76.21.21`
- [ ] CNAME record: `www` → `cname.vercel-dns.com`
- [ ] HTTPS certificate provisioned (automatic via Vercel)
- [ ] WWW redirect configured (Nuvora.dev → www or vice versa)

## Search Engines

- [ ] Google Search Console property added
- [ ] Domain verified (DNS TXT record)
- [ ] Sitemap submitted: `https://Nuvora.dev/sitemap.xml`
- [ ] Bing Webmaster Tools site added
- [ ] Sitemap submitted to Bing
- [ ] IndexNow key generated and deployed
- [ ] IndexNow key file accessible: `https://Nuvora.dev/{key}.txt`
- [ ] Request initial indexing (Google → URL Inspection → Request Indexing)

## Analytics & Monitoring

- [ ] Google Analytics 4 property created
- [ ] `NEXT_PUBLIC_GA4_ID` configured
- [ ] Microsoft Clarity project created
- [ ] `NEXT_PUBLIC_CLARITY_ID` configured
- [ ] Verify analytics fire on page load (browser dev tools)
- [ ] Verify cookie consent banner appears for first-time visitors
- [ ] Verify analytics do NOT fire before consent

## Monetization (Optional)

- [ ] Google AdSense account approved
- [ ] `NEXT_PUBLIC_ADSENSE_ID` configured
- [ ] Ad units placed on appropriate pages

## Site Verification

- [ ] `robots.txt` accessible: `https://Nuvora.dev/robots.txt`
- [ ] `sitemap.xml` accessible and valid
- [ ] `favicon` displays in browser tab
- [ ] `manifest.webmanifest` accessible
- [ ] `og:image` renders in social preview (OpenGraph debugger)
- [ ] Twitter cards render in Twitter card validator
- [ ] PWA install prompt works (if supported)
- [ ] 404 page displays properly for non-existent routes
- [ ] Security headers present (check with securityheaders.com)

## Performance & Quality

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Core Web Vitals pass (LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1)
- [ ] Test on mobile (Chrome DevTools device emulation)
- [ ] Test on actual mobile device
- [ ] Test on tablet
- [ ] Test on slow network (3G throttling)
- [ ] Test with JavaScript disabled (graceful fallback)

## Content Verification

- [ ] Home page loads and displays correctly
- [ ] All tool pages load without errors
- [ ] All content pages load without errors
- [ ] All category and tag pages load
- [ ] Search functionality works
- [ ] Bookmark tool works
- [ ] Collections feature works

## Post-Launch (First Week)

- [ ] Monitor Vercel analytics dashboard
- [ ] Monitor Google Search Console for crawl errors
- [ ] Monitor Google Analytics for traffic
- [ ] Fix any 404 errors from Search Console
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Check index coverage in Search Console
- [ ] Submit additional URLs for indexing
- [ ] Monitor server logs for errors
