"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

function NuvoraLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-nuvora-500 to-nuvora-700 shadow-sm ring-1 ring-nuvora-500/20 transition-shadow group-hover:shadow-md group-hover:ring-nuvora-500/40 dark:from-nuvora-400 dark:to-nuvora-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="size-5" aria-hidden="true">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {SITE_NAME}
      </span>
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NuvoraLogo />

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <ul className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-all hover:bg-surface-secondary hover:text-text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tools"
                className="ml-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-nuvora-700 active:scale-[0.97]"
              >
                All Tools
              </Link>
            </li>
          </ul>

          <ThemeToggle />

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-surface-secondary sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5" aria-hidden="true">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5" aria-hidden="true">
                <path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-border-subtle bg-surface px-4 pb-6 pt-2 sm:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href="/tools"
                className="flex items-center justify-center rounded-lg bg-nuvora-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nuvora-700"
                onClick={() => setMenuOpen(false)}
              >
                All Tools
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
