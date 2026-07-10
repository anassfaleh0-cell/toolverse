import { getAllTools } from "@/lib/registry";
import { ARTICLES } from "@/lib/content/data/articles";

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "tool" | "article" | "guide";
  url: string;
  icon?: string;
  keywords: string[];
}

export function buildSearchIndex(): SearchEntry[] {
  const tools = getAllTools();
  const toolEntries: SearchEntry[] = tools.map(t => ({
    id: t.id,
    title: t.name,
    description: t.description,
    category: t.category ?? "General",
    type: "tool",
    url: t.url,
    icon: undefined,
    keywords: [t.name, ...t.name.split(" "), t.category ?? ""].filter(Boolean),
  }));

  const articleEntries: SearchEntry[] = ARTICLES.map(a => ({
    id: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    type: a.type === "guide" ? "guide" : "article",
    url: `/${a.type === "guide" ? "guides" : "blog"}/${a.slug}`,
    keywords: [a.title, ...a.title.split(" "), a.category].filter(Boolean),
  }));

  return [...toolEntries, ...articleEntries];
}

export const SEARCH_INDEX = buildSearchIndex();
