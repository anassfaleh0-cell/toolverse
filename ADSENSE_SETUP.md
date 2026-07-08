# Google AdSense Setup — ToolVerse

## Prerequisites
- Google account
- Website with sufficient content (1196 pages ✓)
- Privacy policy page (already exists at `/privacy`)
- Cookie consent banner (already implemented)

## Apply for AdSense

1. Go to [adsense.google.com](https://adsense.google.com)
2. Click **Sign Up Now**
3. Enter website URL: `https://toolverse.dev`
4. Select account type: **Individual** (or Business if applicable)
5. Complete the application form

## After Approval

1. Get your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)
2. Set as `NEXT_PUBLIC_ADSENSE_ID` in Vercel environment variables
3. Redeploy the project

## Ad Placement

The site uses <AdSenseSlot /> components in the revenue slots system:
- **Banner ads**: Below tool results, between content sections
- **In-article ads**: Within long-form content
- **Sidebar/rail**: On desktop pages (if applicable)

To enable/disable ads per page, use the `<AdSenseSlot enabled={true/false} />` prop.

## Auto Ads

Consider enabling **Auto Ads** in AdSense for additional placements:
1. AdSense Dashboard → **Auto ads**
2. Enable Auto ads
3. Select allowed ad formats

## Compliance

- Cookie consent must be granted before ad personalization
- Privacy policy must disclose third-party ad serving
- Ads must not exceed Google's content policies
