import Link from "next/link";
import { getContentForTool } from "@/lib/content/registry";

export function RelatedContent({ toolSlug }: { toolSlug: string }) {
  const content = getContentForTool(toolSlug);
  if (content.length === 0) return null;

  const grouped = {
    guide: content.filter((c) => c.type === "guide"),
    article: content.filter((c) => c.type === "article"),
    comparison: content.filter((c) => c.type === "comparison"),
    learn: content.filter((c) => c.type === "learn"),
  };

  const hasAny = Object.values(grouped).some((arr) => arr.length > 0);
  if (!hasAny) return null;

  return (
    <section className="border-t border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Related Resources
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          In-depth guides, tutorials, and comparisons for this tool.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {grouped.learn.slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              href={`/learn/${item.slug}`}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-green-300 dark:border-zinc-800 dark:hover:border-green-700"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-green-600 dark:text-green-400">Beginner Guide</span>
              <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.description}</p>
            </Link>
          ))}
          {grouped.guide.slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              href={`/guides/${item.slug}`}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">Troubleshooting Guide</span>
              <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.description}</p>
            </Link>
          ))}
          {grouped.article.slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-purple-300 dark:border-zinc-800 dark:hover:border-purple-700"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-purple-600 dark:text-purple-400">Article</span>
              <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.description}</p>
            </Link>
          ))}
          {grouped.comparison.slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-amber-300 dark:border-zinc-800 dark:hover:border-amber-700"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">Comparison</span>
              <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
