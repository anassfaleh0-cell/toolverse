import { ImageResponse } from "next/og";
import { OG_ARTICLE_DATA } from "@/lib/og-article-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = OG_ARTICLE_DATA[slug];

  if (article) {
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
            fontSize: 20,
            color: "#c7d2fe",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "16px",
          }}
        >
          Nuvora · Article
        </div>
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
          {article.t}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#c7d2fe",
            textAlign: "center",
            marginTop: "16px",
            maxWidth: "70%",
            lineHeight: 1.3,
          }}
        >
          {article.d}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            fontSize: 24,
            color: "#a5b4fc",
          }}
        >
          {new URL(SITE_URL).hostname}
        </div>
      </div>,
      size,
    );
  }

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
        {SITE_NAME}
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
        Free Online Tools & Guides
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
        {new URL(SITE_URL).hostname}
      </div>
    </div>,
    size,
  );
}
