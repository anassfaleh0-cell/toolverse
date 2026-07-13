import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { getCategories } from "@/lib/registry";

export function ToolCategories() {
  const categories = getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Find exactly what you need
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <span className="flex size-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Icon name={cat.icon} className="size-6 text-zinc-600 dark:text-zinc-400" />
              </span>
              <div>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {cat.label}
                </span>
                <span className="ml-2 text-sm text-zinc-400">
                  {cat.toolCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
