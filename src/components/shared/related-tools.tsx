import Link from "next/link";

interface RelatedTool {
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  title?: string;
}

export function RelatedTools({
  tools,
  title = "Related Tools",
}: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <span className="text-2xl">{tool.icon}</span>
            <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
              {tool.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
