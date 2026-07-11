import { JsonLd } from "@/components/shared";
import { breadcrumbSchema as buildBreadcrumbSchema } from "@/lib/seo";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbs = items.map((item) => ({
    label: item.name,
    href: item.url,
  }));
  return <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />;
}
