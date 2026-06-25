import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/pricing/pricing-engine";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(calculatePrice(input));
}
