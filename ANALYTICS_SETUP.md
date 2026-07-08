# Google Analytics 4 Setup — ToolVerse

## Create GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Start Measuring** (or Admin → Create Property)
3. Property name: `ToolVerse`
4. Reporting time zone: Your local timezone
5. Currency: USD
6. Click **Create**

## Configure Data Stream

1. In GA4 Admin → **Data Streams**
2. Click **Add Stream** → **Web**
3. Website URL: `https://toolverse.dev`
4. Stream name: `ToolVerse Web`
5. Click **Create Stream**

## Copy Measurement ID

1. In the stream details, find **Measurement ID** (format: `G-XXXXXXXXXX`)
2. Set as `NEXT_PUBLIC_GA4_ID` in Vercel environment variables
3. Redeploy the project

## Verify Tracking

1. Open your deployed site
2. Open browser DevTools → **Network** tab
3. Filter by `google-analytics`
4. Verify `collect` requests fire on page load
5. Check GA4 Realtime report for active users

## Configure Events

The following events are automatically tracked:
- `page_view` — every page load
- `tool_open` — when a tool page is visited
- `tool_run` — when a tool is executed
- `tool_complete` — when a tool returns results
- `search` — when a user searches
- `export` — when results are exported
- `share` — when content is shared
- `bookmark` — when a tool is bookmarked
- `workflow_complete` — when a workflow finishes
- `web_vital` — Core Web Vitals (CLS, FCP, LCP, TTFB)

## Privacy

- Analytics only loads after cookie consent
- No PII (personally identifiable information) is collected
- IP addresses are anonymized
- Data retention: 2 months (set in GA4 Admin → Data Settings → Data Retention)
