import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const format = (formData.get("format") as string) || "text";
    if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 });
    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = file.type;
    return NextResponse.json({ fileName, fileSize, mimeType, format, message: `PDF conversion to ${format} queued for processing. Your file "${fileName}" (${(fileSize / 1024).toFixed(1)} KB) has been received.` });
  } catch {
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST with a file upload" }, { status: 405 });
}
