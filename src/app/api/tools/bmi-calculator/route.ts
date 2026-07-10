import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const height = parseFloat(searchParams.get("height") || "0") / 100;
    const weight = parseFloat(searchParams.get("weight") || "0");
    if (!height || !weight) return NextResponse.json({ error: "Height and weight are required" }, { status: 400 });
    const bmi = weight / (height * height);
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
    return NextResponse.json({ BMI: bmi.toFixed(1), Category: category, Height: `${searchParams.get("height")} cm`, Weight: `${searchParams.get("weight")} kg` });
  } catch {
    return NextResponse.json({ error: "Failed to calculate BMI" }, { status: 500 });
  }
}
