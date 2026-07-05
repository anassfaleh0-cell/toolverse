import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        404
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Sorry, we could not find the page you are looking for.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Go home
      </Link>
    </section>
  );
}
