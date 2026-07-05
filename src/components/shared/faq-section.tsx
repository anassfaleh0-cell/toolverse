import type { FaqItem } from "@/lib/seo";

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  description?: string;
}

export function FaqSection({
  items,
  title = "Frequently Asked Questions",
  description,
}: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      <dl className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item, i) => (
          <div key={i} className="py-6 first:pt-0 last:pb-0">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {item.question}
            </dt>
            <dd className="mt-2 text-zinc-600 dark:text-zinc-400">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
