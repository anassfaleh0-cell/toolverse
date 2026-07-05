import type { ContentPiece, ContentType } from "./types";
import { GUIDES } from "./data/guides";
import { ARTICLES } from "./data/articles";
import { COMPARISONS } from "./data/comparisons";
import { TOPIC_CLUSTERS } from "./clusters";

const ALL_CONTENT: ContentPiece[] = [...GUIDES, ...ARTICLES, ...COMPARISONS];

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
    tutorial: 0,
    article: ARTICLES.length,
    learn: ALL_CONTENT.filter((c) => c.type === "learn").length,
    comparison: COMPARISONS.length,
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

export function getSitemapPaths(): string[] {
  const contentPaths = ALL_CONTENT.map(
    (c) => `/${c.type}/${c.slug}`,
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
