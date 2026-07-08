import Link from "next/link";

interface TrustSignalProps {
  updatedAt?: string;
}

export function TrustSignal({ updatedAt = "July 7, 2026" }: TrustSignalProps) {
  return (
    <p className="text-xs text-zinc-400">
      Last updated: {updatedAt} &middot; Reviewed by the ToolVerse editorial team &middot;
      <Link href="/editorial-guidelines" className="underline hover:text-zinc-600 ml-1"> Editorial Guidelines</Link> &middot;
      <Link href="/how-we-test-tools" className="underline hover:text-zinc-600 ml-1"> How We Verify Data</Link>
    </p>
  );
}
