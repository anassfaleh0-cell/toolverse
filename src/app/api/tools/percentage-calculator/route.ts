import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "";
    const a = parseFloat(searchParams.get("a") || "0");
    const b = parseFloat(searchParams.get("b") || "0");
    if (mode === "what-percent") return NextResponse.json({ result: `${((a / b) * 100).toFixed(2)}%`, explanation: `${a} is ${((a / b) * 100).toFixed(2)}% of ${b}` });
    if (mode === "percent-of") return NextResponse.json({ result: ((a / 100) * b).toFixed(2), explanation: `${a}% of ${b} = ${((a / 100) * b).toFixed(2)}` });
    if (mode === "change") return NextResponse.json({ result: `${(((b - a) / a) * 100).toFixed(2)}%`, explanation: `Change from ${a} to ${b} = ${(((b - a) / a) * 100).toFixed(2)}%` });
    return NextResponse.json({ error: "Select a calculation mode" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to calculate" }, { status: 500 });
  }
}
