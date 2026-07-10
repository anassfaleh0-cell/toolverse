export function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  return (
    <div className={`min-h-[90px] w-full ${className}`} data-ad-slot={slot}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
