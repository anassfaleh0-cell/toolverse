import { getLatestTools } from "@/lib/registry";
import { ToolCard } from "@/components/tool-card";

export function LatestTools() {
  const latest = getLatestTools(6);

  if (latest.length === 0) return null;

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Latest Tools
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Recently added to the collection
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
