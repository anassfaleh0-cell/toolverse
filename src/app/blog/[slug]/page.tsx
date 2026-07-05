import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent } from "@/lib/content/registry";
import { SITE_URL } from "@/lib/constants";
import { ContentPage } from "@/components/shared/content-page";

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
    openGraph: { title: piece.title, description: piece.description, url: `${SITE_URL}/blog/${slug}` },
    twitter: { title: piece.title, description: piece.description },
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "article") notFound();
  return <ContentPage piece={piece} />;
}
