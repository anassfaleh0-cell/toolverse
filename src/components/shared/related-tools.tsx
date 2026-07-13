import Link from "next/link";
import { Icon } from "./icon";

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
      <h2 className="text-xl font-bold text-text-primary mb-1">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700"
          >
            <Icon name={tool.icon} className="size-6 text-nuvora-600 dark:text-nuvora-400" />
            <h3 className="mt-3 font-semibold text-text-primary">
              {tool.title}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
