import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.24, INR: 83.1, BRL: 4.97,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get("amount") || "0");
    const from = (searchParams.get("from") || "USD").toUpperCase();
    const to = (searchParams.get("to") || "EUR").toUpperCase();
    if (!amount) return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    if (!RATES[from]) return NextResponse.json({ error: `Unknown currency: ${from}` }, { status: 400 });
    if (!RATES[to]) return NextResponse.json({ error: `Unknown currency: ${to}` }, { status: 400 });
    const usdAmount = amount / RATES[from];
    const result = usdAmount * RATES[to];
    return NextResponse.json({
      from: `${amount} ${from}`,
      to: `${result.toFixed(2)} ${to}`,
      rate: `${RATES[to] / RATES[from]}`,
      result: result.toFixed(2),
    });
  } catch {
    return NextResponse.json({ error: "Failed to convert currency" }, { status: 500 });
  }
}
