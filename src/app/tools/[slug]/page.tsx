import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { getAllTools, getToolBySlug, generateToolMetadata } from "@/lib/registry";
import { ToolLayout, JsonLd } from "@/components/shared";
import { webPageSchema, breadcrumbSchema, softwareAppSchema } from "@/lib/seo";
import { getToolComponent } from "@/lib/tools-registry";
import { ToolComponent } from "@/components/tools/ToolComponent";

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
  if (!tool) notFound();

  const ToolComponentInstance = getToolComponent(slug);

  return (
    <>
      <JsonLd data={webPageSchema({ name: tool.name, description: tool.description, url: `${SITE_URL}/tools/${tool.slug}`, breadcrumbs: [{ label: "Home", href: SITE_URL }, { label: "Tools", href: `${SITE_URL}/tools` }, { label: tool.name }] })} />
      <JsonLd data={softwareAppSchema({ name: tool.name, description: tool.description, url: `${SITE_URL}/tools/${tool.slug}` })} />
      <ToolLayout toolSlug={slug}>
        {ToolComponentInstance ? <ToolComponentInstance /> : <ToolComponent slug={slug} />}
      </ToolLayout>
    </>
  );
}
