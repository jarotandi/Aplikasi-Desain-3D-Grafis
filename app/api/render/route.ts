import { NextResponse } from "next/server";
import { createId } from "@/lib/utils/id";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    projectId?: string;
    sceneData?: unknown;
    cameraData?: unknown;
    renderSettings?: unknown;
  } | null;

  if (!body?.projectId || !body.sceneData) {
    return NextResponse.json({ status: "failed", message: "projectId and sceneData are required." }, { status: 400 });
  }

  const renderServiceUrl = process.env.RENDER_SERVICE_URL;
  if (renderServiceUrl) {
    try {
      const response = await fetch(`${renderServiceUrl.replace(/\/$/, "")}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const payload = (await response.json().catch(() => null)) as { outputUrl?: string } | null;
      if (payload?.outputUrl?.startsWith("/")) {
        payload.outputUrl = `${renderServiceUrl.replace(/\/$/, "")}${payload.outputUrl}`;
      }
      return NextResponse.json(payload, { status: response.status });
    } catch (error) {
      return NextResponse.json(
        {
          status: "failed",
          message: "Render service is not reachable.",
          error: error instanceof Error ? error.message : "Unknown render service error."
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    status: "queued",
    jobId: createId("render-job"),
    message: "Render job queued. This placeholder is ready to connect to a Blender headless worker.",
    received: {
      projectId: body.projectId,
      hasCameraData: Boolean(body.cameraData),
      hasRenderSettings: Boolean(body.renderSettings)
    }
  });
}
