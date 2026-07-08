"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";

export function HomeHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(59,130,246,0.03)_0%,transparent_50%)] dark:bg-[linear-gradient(145deg,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            45+ free tools — no signup required
          </div>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            The Professional&apos;s{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              Toolkit
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Analyze websites, check SSL certificates, look up DNS records,
            inspect HTTP headers, and more. Free, private, and built for
            professionals.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 shadow-lg shadow-zinc-200/50 transition-all focus-within:border-blue-400 focus-within:shadow-blue-200/50 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/20 dark:focus-within:border-blue-500 dark:focus-within:shadow-blue-900/30"
            role="search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-5 shrink-0 text-zinc-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any tool..."
              className="flex-1 bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
              aria-label="Search tools"
            />
          </form>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/website-status-checker"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4" aria-hidden="true">
                <path d="M3 3v18h18" /><path d="m7 16 4-8 4 4 4-6" />
              </svg>
              Analyze Any Website
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Explore All Tools
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4" aria-hidden="true">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
