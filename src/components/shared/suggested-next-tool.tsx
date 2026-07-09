import Link from "next/link";
import { getSuggestedNextTool } from "@/lib/seo/internal-links";

export function SuggestedNextTool({ currentSlug }: { currentSlug: string }) {
  const suggestion = getSuggestedNextTool(currentSlug);
  if (!suggestion) return null;

  const { tool, reason } = suggestion;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Next Recommended Tool
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        {reason}
      </p>
      <div className="mt-4">
        <Link
          href={tool.url}
          className="flex items-center gap-3 rounded-xl bg-white p-4 transition-colors hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {tool.name}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">{tool.description}</p>
          </div>
          <span className="whitespace-nowrap rounded-lg bg-nuvora-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-nuvora-700 dark:bg-nuvora-500 dark:hover:bg-nuvora-400">
            Try it &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
