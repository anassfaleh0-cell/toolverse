import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/constants";
import { BRAND } from "@/lib/nuvora/brand";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-nuvora-500 to-nuvora-700 shadow-sm dark:from-nuvora-400 dark:to-nuvora-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="size-5" aria-hidden="true">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{SITE_NAME}</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary max-w-xs">
              {BRAND.tagline}. {BRAND.description}
            </p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                {group.heading}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-border-subtle pt-8 text-center">
          <p className="text-sm text-text-tertiary">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Built with privacy at its core.
          </p>
        </div>
      </div>
    </footer>
  );
}
