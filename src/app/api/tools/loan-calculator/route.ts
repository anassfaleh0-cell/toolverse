import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const p = parseFloat(searchParams.get("amount") || "0");
    const r = (parseFloat(searchParams.get("rate") || "0") / 100) / 12;
    const n = parseFloat(searchParams.get("term") || "0") * 12;
    if (!p || !r || !n) return NextResponse.json({ error: "Amount, rate, and term are required" }, { status: 400 });
    const monthly = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    return NextResponse.json({
      "Monthly Payment": `$${monthly.toFixed(2)}`,
      "Total Payment": `$${total.toFixed(2)}`,
      "Total Interest": `$${(total - p).toFixed(2)}`,
      "Loan Amount": `$${p.toFixed(2)}`,
      "Term": `${searchParams.get("term")} years`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to calculate loan" }, { status: 500 });
  }
}
