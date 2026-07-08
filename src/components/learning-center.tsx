import Link from "next/link";
import { getLatestContent, getBeginnerGuides } from "@/lib/content/registry";

export function LearningCenter() {
  const latest = getLatestContent(3);
  const beginnerGuides = getBeginnerGuides();

  if (latest.length === 0 && beginnerGuides.length === 0) return null;

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Learning Center
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Master network tools, DNS, SSL, and web security
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beginnerGuides.slice(0, 3).map((item) => (
            <Link
              key={item.slug}
              href={`/learn/${item.slug}`}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {item.difficulty === "beginner" ? "Beginner Guide" : "Guide"}
              </span>
              <h3 className="mt-2 font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {item.description}
              </p>
              <span className="mt-3 block text-xs text-zinc-400">
                {item.readingTimeMinutes} min read
              </span>
            </Link>
          ))}
          {latest.filter((c) => c.type === "article").slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Article
              </span>
              <h3 className="mt-2 font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {item.description}
              </p>
              <span className="mt-3 block text-xs text-zinc-400">
                {item.readingTimeMinutes} min read
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all guides
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
