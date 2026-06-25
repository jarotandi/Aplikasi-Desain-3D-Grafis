# 3D Product Studio Render Worker

FastAPI service and Blender headless worker for queued PNG renders.

## Structure

```text
backend/render-worker/
  blender_worker.py
  render_scene.py
  requirements.txt
  jobs/
  output/
  templates/
    product_scene.blend
  scripts/
    apply_material.py
    apply_decal.py
    setup_camera.py
    setup_lighting.py
    render_output.py
```

## Install

Use Python 3.11+.

```bash
cd backend/render-worker
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Install Blender and make sure the `blender` command is available. If not, set `BLENDER_BIN`.

PowerShell example:

```powershell
$env:BLENDER_BIN="C:\Program Files\Blender Foundation\Blender 4.3\blender.exe"
```

## Template Scene

Create or copy this file:

```text
backend/render-worker/templates/product_scene.blend
```

The current implementation expects the file to exist. It can be a simple Blender scene with a camera; objects, material, lighting, and camera will be configured by Python scripts.

Generate a starter template:

```bash
blender -b --python create_template_blend.py
```

## Run Service

```bash
uvicorn blender_worker:app --host 127.0.0.1 --port 8010 --reload
```

Health check:

```bash
curl http://127.0.0.1:8010/health
```

## Create Render Job

```bash
curl -X POST http://127.0.0.1:8010/render ^
  -H "Content-Type: application/json" ^
  -d "{\"projectId\":\"demo-project\",\"sceneData\":{\"objects\":[{\"id\":\"cube-1\",\"name\":\"Blue Cube\",\"type\":\"cube\",\"visible\":true,\"transform\":{\"position\":[0,0.5,0],\"rotation\":[0,0,0],\"scale\":[1,1,1]},\"material\":{\"color\":\"#38bdf8\",\"roughness\":0.45,\"metalness\":0.1,\"opacity\":1}}]},\"cameraData\":{\"position\":[4.8,3.8,5.4],\"target\":[0,0.8,0]},\"renderSettings\":{\"width\":1200,\"height\":900,\"samples\":64}}"
```

Response:

```json
{
  "jobId": "render-...",
  "projectId": "demo-project",
  "status": "queued",
  "message": "Render job queued.",
  "outputUrl": null
}
```

## Check Render Job

```bash
curl http://127.0.0.1:8010/render/render-your-job-id
```

When complete:

```json
{
  "status": "completed",
  "outputUrl": "/output/render-your-job-id.png"
}
```

Open the PNG:

```text
http://127.0.0.1:8010/output/render-your-job-id.png
```

## Direct Blender Command

The worker executes:

```bash
blender -b templates/product_scene.blend -P render_scene.py -- jobs/job.scene.json output/job.png
```

You can run this manually for debugging after a `.scene.json` file exists in `jobs/`.

## Frontend Integration

The Next.js API can proxy `/api/render` to this service:

```ts
await fetch("http://127.0.0.1:8010/render", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ projectId, sceneData, cameraData, renderSettings })
});
```

For polling status:

```ts
await fetch(`http://127.0.0.1:8010/render/${jobId}`);
```

Recommended next step: update `app/api/render/route.ts` to call this service when `RENDER_SERVICE_URL` is set, and keep the current placeholder fallback when it is not set.
