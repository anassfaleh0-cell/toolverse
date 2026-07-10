import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getAllTools, getToolBySlug, generateToolMetadata } from "@/lib/registry";

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (tool) return generateToolMetadata(tool);
  return {};
}

export default async function ToolSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) permanentRedirect(`/${slug}`);
  permanentRedirect(`/${slug}`);
}
