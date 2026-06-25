import { NextResponse } from "next/server";
import { calculateDummyQuotation } from "@/lib/pricing/pricing-engine";

export async function GET() {
  return NextResponse.json({
    quotationNumber: "QTN-MDS-0001",
    status: "draft",
    result: calculateDummyQuotation()
  });
}
