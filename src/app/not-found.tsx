import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

const popularTools = [
  { href: "/dns-lookup", label: "DNS Lookup" },
  { href: "/ssl-certificate-checker", label: "SSL Checker" },
  { href: "/whois-lookup", label: "WHOIS Lookup" },
  { href: "/ip-lookup", label: "IP Lookup" },
  { href: "/password-generator", label: "Password Generator" },
  { href: "/what-is-my-ip", label: "What Is My IP" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Logo size="lg" />
      <h1 className="mt-8 text-6xl font-bold text-nuvora-600 dark:text-nuvora-400">404</h1>
      <p className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Page Not Found</p>
      <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
        This tool doesn't exist — but here are some popular ones:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {popularTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-nuvora-50 hover:border-nuvora-300 hover:text-nuvora-700 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-nuvora-950/50"
          >
            {tool.label}
          </Link>
        ))}
      </div>
      <div className="mt-10 flex gap-4">
        <Link
          href="/"
          className="rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-nuvora-700"
        >
          Back to Home
        </Link>
        <Link
          href="/tools"
          className="rounded-xl border border-border-subtle bg-surface px-6 py-3 text-sm font-semibold text-text-secondary transition-colors hover:border-nuvora-300 hover:text-nuvora-600"
        >
          All Tools
        </Link>
      </div>
    </div>
  );
}