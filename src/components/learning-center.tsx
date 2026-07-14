import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { getLatestContent, getBeginnerGuides } from "@/lib/content/registry";

export function LearningCenter() {
  const latest = getLatestContent(3);
  const beginnerGuides = getBeginnerGuides();

  if (latest.length === 0 && beginnerGuides.length === 0) return null;

  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Learning Center
          </h2>
          <p className="mt-4 text-text-secondary">
            Master network tools, DNS, SSL, and web security
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beginnerGuides.slice(0, 3).map((item) => (
            <Link
              key={item.slug}
              href={`/learn/${item.slug}`}
              className="group rounded-xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-aurora-700 dark:text-aurora-400">
                {item.difficulty === "beginner" ? "Beginner Guide" : "Guide"}
              </span>
              <h3 className="mt-2 font-semibold text-text-primary transition-colors group-hover:text-nuvora-600 dark:group-hover:text-nuvora-600">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                {item.description}
              </p>
              <span className="mt-3 block text-xs text-text-tertiary">
                {item.readingTimeMinutes} min read
              </span>
            </Link>
          ))}
          {latest.filter((c) => c.type === "article").slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group rounded-xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-nuvora-600 dark:text-nuvora-400">
                Article
              </span>
              <h3 className="mt-2 font-semibold text-text-primary transition-colors group-hover:text-nuvora-600 dark:group-hover:text-nuvora-600">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                {item.description}
              </p>
              <span className="mt-3 block text-xs text-text-tertiary">
                {item.readingTimeMinutes} min read
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-medium text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600"
          >
            View all guides
<Icon name="ArrowRight" className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
