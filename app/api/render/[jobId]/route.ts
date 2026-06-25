import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const renderServiceUrl = process.env.RENDER_SERVICE_URL;

  if (!renderServiceUrl) {
    return NextResponse.json({
      jobId,
      status: "queued",
      message: "Render service is not configured. Set RENDER_SERVICE_URL to enable status polling.",
      outputUrl: null
    });
  }

  try {
    const response = await fetch(`${renderServiceUrl.replace(/\/$/, "")}/render/${jobId}`, {
      cache: "no-store"
    });
    const payload = (await response.json().catch(() => null)) as { outputUrl?: string } | null;
    if (payload?.outputUrl?.startsWith("/")) {
      payload.outputUrl = `${renderServiceUrl.replace(/\/$/, "")}${payload.outputUrl}`;
    }
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        jobId,
        status: "failed",
        message: "Render service is not reachable.",
        error: error instanceof Error ? error.message : "Unknown render service error."
      },
      { status: 502 }
    );
  }
}
