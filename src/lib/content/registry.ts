import type { ContentPiece, ContentType } from "./types";
import { GUIDES, BEGINNER_GUIDES } from "./data/guides";
import { ARTICLES } from "./data/articles";
import { COMPARISONS } from "./data/comparisons";
import { EXAMPLES } from "./data/examples";
import { ERROR_PAGES } from "./data/error-pages";
import { REFERENCE_PAGES } from "./data/reference-pages";
import { TOPIC_CLUSTERS } from "./clusters";
import { generateAllKnowledgePieces } from "@/lib/knowledge/generator";

const KNOWLEDGE_PIECES = generateAllKnowledgePieces();
const ALL_CONTENT: ContentPiece[] = [...GUIDES, ...BEGINNER_GUIDES, ...ARTICLES, ...COMPARISONS, ...EXAMPLES, ...ERROR_PAGES, ...REFERENCE_PAGES, ...KNOWLEDGE_PIECES];

export function getAllContent(): ContentPiece[] {
  return ALL_CONTENT;
}

export function getContentByType(type: ContentType): ContentPiece[] {
  return ALL_CONTENT.filter((c) => c.type === type);
}

export function getContentBySlug(slug: string): ContentPiece | undefined {
  return ALL_CONTENT.find((c) => c.slug === slug);
}

export function getContentForTool(toolSlug: string): ContentPiece[] {
  return ALL_CONTENT.filter((c) => c.toolSlugs.includes(toolSlug));
}

export function getGuides(): ContentPiece[] {
  return GUIDES;
}

export function getArticles(): ContentPiece[] {
  return ARTICLES;
}

export function getComparisons(): ContentPiece[] {
  return COMPARISONS;
}

export function getBeginnerGuides(): ContentPiece[] {
  return ALL_CONTENT.filter((c) => c.type === "learn" && c.difficulty === "beginner");
}

export function getContentByDifficulty(difficulty: string): ContentPiece[] {
  return ALL_CONTENT.filter((c) => c.difficulty === difficulty);
}

export function getRelatedContent(
  piece: ContentPiece,
  count = 4,
): ContentPiece[] {
  const related = ALL_CONTENT.filter(
    (c) =>
      c.slug !== piece.slug &&
      (c.toolSlugs.some((ts) => piece.toolSlugs.includes(ts)) ||
        c.category === piece.category),
  );
  return related.slice(0, count);
}

export function getContentByCategory(category: string): ContentPiece[] {
  return ALL_CONTENT.filter((c) => c.category === category);
}

export function getClusterContent(clusterSlug: string): ContentPiece[] {
  const cluster = TOPIC_CLUSTERS.find((c) => c.slug === clusterSlug);
  if (!cluster) return [];
  return ALL_CONTENT.filter(
    (c) =>
      c.toolSlugs.some((ts) => cluster.toolSlugs.includes(ts)) ||
      c.category === clusterSlug,
  );
}

export function getContentCountByType(): Record<ContentType, number> {
  return {
    guide: GUIDES.length,
    tutorial: ALL_CONTENT.filter((c) => c.type === "tutorial").length,
    article: ALL_CONTENT.filter((c) => c.type === "article").length,
    learn: ALL_CONTENT.filter((c) => c.type === "learn").length,
    comparison: COMPARISONS.length,
    examples: ALL_CONTENT.filter((c) => c.type === "examples").length,
    errors: ALL_CONTENT.filter((c) => c.type === "errors").length,
    reference: ALL_CONTENT.filter((c) => c.type === "reference").length,
    "cheat-sheet": ALL_CONTENT.filter((c) => c.type === "cheat-sheet").length,
    "best-practices": ALL_CONTENT.filter((c) => c.type === "best-practices").length,
    commands: ALL_CONTENT.filter((c) => c.type === "commands").length,
    "use-cases": ALL_CONTENT.filter((c) => c.type === "use-cases").length,
  };
}

export function getLatestContent(count = 10): ContentPiece[] {
  return ALL_CONTENT.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  ).slice(0, count);
}

export function getAllContentSlugs(): string[] {
  return ALL_CONTENT.map((c) => c.slug);
}

const TYPE_ROUTE_MAP: Record<string, string> = {
  guide: "guides",
  article: "blog",
  comparison: "compare",
  learn: "learn",
  tutorial: "learn",
  examples: "examples",
  errors: "errors",
  reference: "reference",
  "cheat-sheet": "cheat-sheets",
  "best-practices": "best-practices",
  commands: "commands",
  "use-cases": "use-cases",
};

export function getSitemapPaths(): string[] {
  const contentPaths = ALL_CONTENT.map(
    (c) => `/${TYPE_ROUTE_MAP[c.type] ?? c.type}/${c.slug}`,
  );
  return [
    ...new Set([
      ...contentPaths,
      "/guides",
      "/learn",
      "/blog",
      "/compare",
      "/resources",
    ]),
  ];
}
