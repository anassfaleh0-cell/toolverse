"use client";

import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-4 font-sans antialiased">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-6xl font-bold text-nuvora-600">500</h1>
          <h2 className="mt-4 text-xl font-semibold text-text-primary">Something went wrong</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            An unexpected error occurred. Our team has been notified.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={reset} className="rounded-lg bg-nuvora-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nuvora-700">
              Try again
            </button>
            <Link href="/" className="text-sm font-medium text-nuvora-600 hover:underline dark:text-nuvora-400">
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
