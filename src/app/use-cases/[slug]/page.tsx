import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent } from "@/lib/content/registry";
import { SITE_URL } from "@/lib/constants";
import { ContentPage } from "@/components/shared/content-page";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllContent().filter((c) => c.type === "use-cases").slice(0, 500).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "use-cases") return {};
  return {
    title: piece.title,
    description: piece.description,
    openGraph: { title: piece.title, description: piece.description, url: `${SITE_URL}/use-cases/${slug}` },
    twitter: { card: "summary_large_image", title: piece.title, description: piece.description },
    alternates: { canonical: `${SITE_URL}/use-cases/${slug}` },
  };
}

export default async function UseCasesPage({ params }: Props) {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "use-cases") notFound();
  return <ContentPage piece={piece} />;
}
