import Link from "next/link";
import { getToolInternalLinks, getContentInternalLinks, getContextualLinks, type InternalLink, type ContextualLink } from "@/lib/seo/internal-links";

const TYPE_STYLES: Record<string, string> = {
  tool: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900",
  category: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900",
  guide: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300 dark:hover:bg-violet-900",
  article: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900",
  comparison: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900",
  learn: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900",
  ultimateguide: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900",
  glossary: "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800",
  troubleshooting: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900",
  reference: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-900",
};

const TYPE_LABELS: Record<string, string> = {
  tool: "Tool",
  category: "Category",
  guide: "Guide",
  article: "Article",
  comparison: "Comparison",
  learn: "Beginner",
  ultimateguide: "Ultimate Guide",
  glossary: "Glossary",
  troubleshooting: "Troubleshooting",
  reference: "Reference",
};

function LinkBadge({ link }: { link: ContextualLink | InternalLink }) {
  return (
    <Link
      href={link.href}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${TYPE_STYLES[link.type] ?? TYPE_STYLES.tool}`}
    >
      {link.label}
      <span className="opacity-60">({TYPE_LABELS[link.type] ?? link.type})</span>
    </Link>
  );
}

function GroupSection({ title, links }: { title: string; links: (ContextualLink | InternalLink)[] }) {
  if (links.length === 0) return null;
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <LinkBadge key={link.href} link={link} />
        ))}
      </div>
    </div>
  );
}

export function CrossLinks({ toolSlug, contentSlug }: { toolSlug?: string; contentSlug?: string }) {
  if (toolSlug) {
    const contextual = getContextualLinks(toolSlug);
    if (contextual.length === 0) return null;

    const relatedTools = contextual.filter((l) => l.type === "tool");
    const learnMore = contextual.filter((l) => l.type === "guide" || l.type === "comparison" || l.type === "learn" || l.type === "reference");
    const troubleshooting = contextual.filter((l) => l.type === "troubleshooting");

    return (
      <section className="mt-8 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Explore Related Resources
        </h3>
        <GroupSection title="Related Tools" links={relatedTools} />
        <GroupSection title="Learn More" links={learnMore} />
        <GroupSection title="Troubleshooting" links={troubleshooting} />
      </section>
    );
  }

  if (contentSlug) {
    const links = getContentInternalLinks(contentSlug);
    if (links.length === 0) return null;
    return (
      <section className="mt-8">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Explore Related Resources
        </h3>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <LinkBadge key={link.href} link={link} />
          ))}
        </div>
      </section>
    );
  }

  return null;
}
