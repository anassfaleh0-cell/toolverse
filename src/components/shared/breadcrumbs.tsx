import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
      <ol className="flex items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="inline-flex items-center">
              {i > 0 && <span className="mr-1.5" aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "text-zinc-900 dark:text-zinc-50"
                      : undefined
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
