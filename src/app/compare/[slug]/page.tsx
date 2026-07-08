import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent } from "@/lib/content/registry";
import { SITE_URL } from "@/lib/constants";
import { ContentPage } from "@/components/shared/content-page";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllContent().filter((c) => c.type === "comparison").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "comparison") return {};
  return {
    title: piece.title,
    description: piece.description,
    openGraph: { title: piece.title, description: piece.description, url: `${SITE_URL}/compare/${slug}` },
    twitter: { card: "summary_large_image", title: piece.title, description: piece.description },
    alternates: { canonical: `${SITE_URL}/compare/${slug}` },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "comparison") notFound();
  return <ContentPage piece={piece} />;
}
