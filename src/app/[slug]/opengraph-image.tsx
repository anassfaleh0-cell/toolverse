import { ImageResponse } from "next/og";
import { getToolBySlug, getCategories } from "@/lib/registry";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === tool?.category);
  const title = tool?.name ?? SITE_NAME;
  const description = tool?.description ?? "Free Online Tool";
  const categoryLabel = cat?.label ?? "";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        padding: "40px",
      }}
    >
      {categoryLabel && (
        <div
          style={{
            fontSize: 20,
            color: "#818cf8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "16px",
          }}
        >
          {categoryLabel}
        </div>
      )}
      <div
        style={{
          fontSize: 56,
          fontWeight: "bold",
          color: "white",
          textAlign: "center",
          maxWidth: "80%",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 24,
          color: "#94a3b8",
          textAlign: "center",
          marginTop: "16px",
          maxWidth: "70%",
          lineHeight: 1.3,
        }}
      >
        {description}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          fontSize: 20,
          color: "#475569",
        }}
      >
        nuvora.tools
      </div>
    </div>,
    size,
  );
}
