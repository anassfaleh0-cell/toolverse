export type ContentType =
  | "guide"
  | "tutorial"
  | "article"
  | "learn"
  | "comparison"
  | "examples"
  | "errors"
  | "reference"
  | "cheat-sheet"
  | "best-practices"
  | "commands"
  | "use-cases";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ContentSection {
  heading: string;
  body: string;
}

export interface ContentPiece {
  slug: string;
  type: ContentType;
  title: string;
  description: string;
  sections: ContentSection[];
  toolSlugs: string[];
  relatedContent: string[];
  difficulty: Difficulty;
  category: string;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  author?: { name: string; url?: string };
  schema?: Record<string, unknown>;
  noindex?: boolean;
  needsReview?: boolean;
}

export interface TopicCluster {
  slug: string;
  name: string;
  description: string;
  pillarToolSlugs: string[];
  toolSlugs: string[];
  contentSlugs: string[];
}
