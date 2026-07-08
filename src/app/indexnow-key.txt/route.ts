import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.INDEXNOW_KEY || "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
  return new NextResponse(key, {
    headers: { "Content-Type": "text/plain" },
  });
}