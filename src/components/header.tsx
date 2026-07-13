"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NuvoraLogo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function useFocusTrap(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open || !ref.current) return;

    const panel = ref.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return ref;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useFocusTrap(menuOpen, () => setMenuOpen(false));

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
                className="nuvora-button-primary rounded-xl px-4 py-2 text-sm"
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
        <div ref={mobileMenuRef} className="border-t border-border-subtle bg-surface/95 backdrop-blur-xl px-4 pb-6 pt-2 sm:hidden" role="dialog" aria-label="Navigation menu" aria-modal="true">
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
                className="nuvora-button-primary flex items-center justify-center rounded-xl px-4 py-2.5 text-sm"
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
