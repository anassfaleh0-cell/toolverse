import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const length = Math.min(128, Math.max(4, parseInt(searchParams.get("length") || "16")));
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const all = upper + lower + digits + special;
    let password = "";
    for (let i = 0; i < length; i++) password += all[Math.floor(Math.random() * all.length)];
    return NextResponse.json({ password, length, entropy: Math.round(length * Math.log2(all.length)) });
  } catch {
    return NextResponse.json({ error: "Failed to generate password" }, { status: 500 });
  }
}
