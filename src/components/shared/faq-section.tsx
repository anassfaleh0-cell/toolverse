import type { FaqItem } from "@/lib/seo";
import { Icon } from "@/components/shared/icon";

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
      <h2 className="text-xl font-bold text-text-primary mb-1">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-text-secondary mb-6">{description}</p>
      )}
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group rounded-xl border border-border-subtle bg-surface transition-all hover:shadow-sm [&[open]]:shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-3.5 text-sm font-medium text-text-primary">
              {item.question}
              <Icon name="ChevronDown" className="size-4 shrink-0 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-border-subtle px-5 pb-3.5 pt-2.5">
              <p className="text-sm leading-relaxed text-text-secondary">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
