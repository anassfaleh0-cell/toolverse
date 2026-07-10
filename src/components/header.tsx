"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NuvoraLogo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border-subtle bg-surface/80 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-surface/50 backdrop-blur-sm",
      )}
    >
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
                className="ml-2 rounded-xl bg-nuvora-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-nuvora-600/20 transition-all hover:bg-nuvora-700 active:scale-[0.97] dark:bg-nuvora-500 dark:hover:bg-nuvora-400 dark:shadow-nuvora-500/20"
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
        <div className="border-t border-border-subtle bg-surface/95 backdrop-blur-xl px-4 pb-6 pt-2 sm:hidden">
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
                className="flex items-center justify-center rounded-xl bg-nuvora-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-nuvora-700 dark:bg-nuvora-500 dark:hover:bg-nuvora-400"
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
