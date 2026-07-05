/**
 * Revenue slot components for ToolVerse.
 *
 * These are structural placeholders that prepare the layout for revenue
 * integrations without inserting actual ad or affiliate code.
 *
 * AdSense: inject via environment variable NEXT_PUBLIC_ADSENSE_ID
 * Affiliate: configure in affiliate-config.ts
 * Premium: gated behind user auth / subscription status
 */

interface SlotProps {
  className?: string;
  id?: string;
}

export function AdSenseSlot({ className = "", id }: SlotProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_ID || "";
  if (!adClient) return null;
  return (
    <div
      id={id}
      className={`min-h-[90px] w-full ${className}`}
      data-ad-client={adClient}
      aria-label="Advertisement"
    />
  );
}

export function AffiliateSlot({ className = "", id }: SlotProps) {
  return (
    <div
      id={id}
      className={`rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 ${className}`}
      role="complementary"
      aria-label="Sponsored content"
    >
      <p className="text-xs text-amber-600 dark:text-amber-400">
        Affiliate links may be present. We may earn a commission on purchases.
      </p>
    </div>
  );
}

export function PremiumSlot({ className = "" }: SlotProps) {
  return (
    <div
      className={`rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20 ${className}`}
      role="complementary"
      aria-label="Premium feature"
    >
      <p className="text-xs text-purple-600 dark:text-purple-400">
        Premium feature — upgrade to unlock advanced functionality.
      </p>
    </div>
  );
}
