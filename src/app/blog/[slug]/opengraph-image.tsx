import { ImageResponse } from "next/og";
import { ARTICLES } from "@/lib/content/data/articles";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = ARTICLES.find((a) => a.slug === slug);
  const title = piece?.title ?? SITE_NAME;
  const description = piece?.description ?? "Free Online Tools";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6366f1",
        padding: "40px",
      }}
    >
      <div
        style={{
          fontSize: 60,
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
          fontSize: 30,
          color: "#e0e7ff",
          textAlign: "center",
          marginTop: "20px",
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
          fontSize: 24,
          color: "#c7d2fe",
        }}
      >
        nuvora.tools
      </div>
    </div>,
    size,
  );
}
