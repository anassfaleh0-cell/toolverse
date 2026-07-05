export type ContentType =
  | "guide"
  | "tutorial"
  | "article"
  | "learn"
  | "comparison";

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
}

export interface TopicCluster {
  slug: string;
  name: string;
  description: string;
  pillarToolSlugs: string[];
  toolSlugs: string[];
  contentSlugs: string[];
}
