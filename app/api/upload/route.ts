import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "placeholder",
    message: "Supabase Storage upload endpoint siap disambungkan."
  });
}
