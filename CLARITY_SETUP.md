# Microsoft Clarity Setup — ToolVerse

## Create Project

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Sign in with Microsoft account
3. Click **Create Project**
4. Project name: `ToolVerse`
5. Website URL: `https://toolverse.dev`
6. Click **Create**

## Get Project ID

1. After creating the project, find the **Project ID** (formax: `xxxxxxxxxxxx`)
2. Set as `NEXT_PUBLIC_CLARITY_ID` in Vercel environment variables
3. Redeploy the project

## Verify Tracking

1. Open your deployed site
2. Open browser DevTools → **Network** tab
3. Filter by `clarity`
4. Verify requests to `clarity.ms` fire on page load
5. Check Clarity dashboard for recordings

## Key Features

- **Session Recordings**: Watch real user sessions to understand behavior
- **Heatmaps**: See where users click, move, and scroll
- **Dashboards**: Track engagement metrics by page
- **Rage Clicks**: Identify frustrated users clicking repeatedly

## Privacy

- Clarity only loads after cookie consent
- No PII is collected by default
- IP addresses are automatically anonymized by Clarity
- Can exclude specific pages from recording
