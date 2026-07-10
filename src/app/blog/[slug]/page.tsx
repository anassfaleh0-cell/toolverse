import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent } from "@/lib/content/registry";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ArticleLayout } from "@/components/blog/article-layout";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllContent().filter((c) => c.type === "article").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "article") return {};
  return {
    title: piece.title,
    description: piece.description,
    openGraph: {
      title: piece.title,
      description: piece.description,
      url: `${SITE_URL}/blog/${slug}`,
      images: [`${SITE_URL}/og-image.svg`],
      type: "article",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: piece.title,
      description: piece.description,
    },
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "article") notFound();

  return <ArticleLayout piece={piece} />;
}
