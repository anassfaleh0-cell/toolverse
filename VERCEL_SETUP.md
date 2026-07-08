# Vercel Setup — ToolVerse

## Prerequisites
- GitHub/GitLab account with repository pushed
- Vercel account (free tier sufficient)

## Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `./` (or `./toolverse` if monorepo)

## Build Settings

| Setting | Value |
|---------|-------|
| Build Command | `next build` (default) |
| Output Directory | `.next` (default) |
| Install Command | `npm install` (default) |
| Node.js Version | 20.x (Vercel default) |

## Environment Variables

Add these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Name | Required | Example |
|------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://toolverse.dev` |
| `NEXT_PUBLIC_GA4_ID` | No | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_CLARITY_ID` | No | `xxxxxxxxxxxx` |
| `NEXT_PUBLIC_ADSENSE_ID` | No | `ca-pub-xxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | No | Google Search Console HTML verification string |
| `INDEXNOW_KEY` | No | 32-char hex string for Bing IndexNow |

## Post-Deploy Verification

- [ ] Visit `https://toolverse.vercel.app` — loads correctly
- [ ] Run `curl https://toolverse.vercel.app/robots.txt` — returns valid robots
- [ ] Run `curl https://toolverse.vercel.app/sitemap.xml` — returns valid sitemap index
- [ ] Navigate to a few tool pages — no errors
- [ ] Check browser console — no errors

## Custom Domain

1. Go to **Project → Domains**
2. Add your domain (e.g., `toolverse.dev`)
3. Configure DNS as instructed (see DOMAIN_SETUP.md)
4. Wait for SSL certificate provisioning (automatic)

## Production Checks

- [ ] HTTPS is active
- [ ] www redirects to non-www (or vice versa)
- [ ] No 404 errors on any page
- [ ] Response times < 200ms
- [ ] Lighthouse scores ≥ 90
