import { ImageResponse } from "next/og";
import { OG_TOOL_DATA } from "@/lib/og-tool-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = OG_TOOL_DATA[slug];
  const title = data?.n ?? SITE_NAME;
  const description = data?.d ?? "Free Online Tool";
  const categoryLabel = data?.cl ?? "";

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
        {new URL(SITE_URL).hostname}
      </div>
    </div>,
    size,
  );
}
