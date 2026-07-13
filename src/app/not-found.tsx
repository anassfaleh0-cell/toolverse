import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — Nuvora",
  description: "The page you're looking for doesn't exist. Browse 255+ free tools instead.",
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
      <div className="mb-6 flex items-center justify-center">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-16" aria-hidden="true">
          <defs>
            <linearGradient id="404-grad" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#6366f1" /><stop offset=".55" stopColor="#4f46e5" /><stop offset="1" stopColor="#4338ca" />
            </linearGradient>
          </defs>
          <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="url(#404-grad)" />
          <rect x="0.5" y="0.5" width="31" height="31" rx="8" stroke="white" strokeOpacity={0.15} strokeWidth="0.5" />
          <path d="M16 5 L26 11 L26 21 L16 27 L6 21 L6 11 Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" fill="white" fillOpacity={0.12} />
          <path d="M16.5 7 L11 16 L14.5 16 L11.5 24.5 L21 13 L17 13 Z" fill="white" />
        </svg>
      </div>
      <h1 className="text-7xl font-bold tracking-tight text-nuvora-600 dark:text-nuvora-400">404</h1>
      <p className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Wrong tunnel. Try another.</p>
      <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
        That page doesn't exist — but 255+ tools do. Pick one:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {popularTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="nuvora-card px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {tool.label}
          </Link>
        ))}
      </div>
      <div className="mt-10 flex gap-4">
        <Link
          href="/"
          className="nuvora-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
        >
          Back to Home
        </Link>
        <Link
          href="/tools"
          className="nuvora-card inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-text-secondary"
        >
          All Tools
        </Link>
      </div>
    </div>
  );
}