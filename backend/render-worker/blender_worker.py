from __future__ import annotations

import json
import os
import queue
import subprocess
import threading
import uuid
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_BLEND = BASE_DIR / "templates" / "product_scene.blend"
RENDER_SCRIPT = BASE_DIR / "render_scene.py"
JOBS_DIR = BASE_DIR / "jobs"
OUTPUT_DIR = BASE_DIR / "output"

JOBS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class RenderStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class RenderRequest(BaseModel):
    projectId: str = Field(..., min_length=1)
    sceneData: dict[str, Any] | list[dict[str, Any]]
    cameraData: dict[str, Any] | None = None
    renderSettings: dict[str, Any] = Field(default_factory=dict)


class RenderJob(BaseModel):
    jobId: str
    projectId: str
    status: RenderStatus
    message: str
    createdAt: str
    updatedAt: str
    scenePath: str
    outputPath: str
    outputUrl: str | None = None
    error: str | None = None


app = FastAPI(title="3D Product Studio Render Worker", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("RENDER_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/output", StaticFiles(directory=OUTPUT_DIR), name="output")

jobs: dict[str, RenderJob] = {}
render_queue: queue.Queue[str] = queue.Queue()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def blender_executable() -> str:
    return os.getenv("BLENDER_BIN", "blender")


def persist_job(job: RenderJob) -> None:
    job_file = JOBS_DIR / f"{job.jobId}.job.json"
    job_file.write_text(job.model_dump_json(indent=2), encoding="utf-8")


def set_job_status(job_id: str, status: RenderStatus, message: str, error: str | None = None, output_url: str | None = None) -> None:
    job = jobs[job_id]
    jobs[job_id] = job.model_copy(
        update={
            "status": status,
            "message": message,
            "updatedAt": now_iso(),
            "error": error,
            "outputUrl": output_url if output_url is not None else job.outputUrl,
        }
    )
    persist_job(jobs[job_id])


def build_blender_command(scene_path: Path, output_path: Path) -> list[str]:
    return [
        blender_executable(),
        "-b",
        str(TEMPLATE_BLEND),
        "-P",
        str(RENDER_SCRIPT),
        "--",
        str(scene_path),
        str(output_path),
    ]


def process_job(job_id: str) -> None:
    job = jobs[job_id]
    set_job_status(job_id, RenderStatus.PROCESSING, "Blender render process started.")

    if not TEMPLATE_BLEND.exists():
        set_job_status(
            job_id,
            RenderStatus.FAILED,
            "Template blend file is missing.",
            error=f"Expected template at {TEMPLATE_BLEND}",
        )
        return

    command = build_blender_command(Path(job.scenePath), Path(job.outputPath))

    try:
        result = subprocess.run(command, cwd=BASE_DIR, capture_output=True, text=True, timeout=int(os.getenv("BLENDER_RENDER_TIMEOUT", "600")), check=False)
    except FileNotFoundError:
        set_job_status(job_id, RenderStatus.FAILED, "Blender executable was not found.", error="Set BLENDER_BIN to your blender executable path.")
        return
    except subprocess.TimeoutExpired as exc:
        set_job_status(job_id, RenderStatus.FAILED, "Blender render timed out.", error=str(exc))
        return

    if result.returncode != 0:
        error_log = "\n".join(part for part in [result.stderr.strip(), result.stdout.strip()] if part)
        set_job_status(job_id, RenderStatus.FAILED, "Blender render failed.", error=error_log[-4000:])
        return

    output_path = Path(job.outputPath)
    if not output_path.exists():
        set_job_status(job_id, RenderStatus.FAILED, "Render finished but output PNG was not created.", error=result.stdout[-4000:])
        return

    set_job_status(job_id, RenderStatus.COMPLETED, "Render completed.", output_url=f"/output/{output_path.name}")


def worker_loop() -> None:
    while True:
        job_id = render_queue.get()
        try:
            process_job(job_id)
        finally:
            render_queue.task_done()


@app.on_event("startup")
def start_worker() -> None:
    thread = threading.Thread(target=worker_loop, name="blender-render-worker", daemon=True)
    thread.start()


@app.post("/render", response_model=RenderJob)
def create_render_job(payload: RenderRequest) -> RenderJob:
    job_id = f"render-{uuid.uuid4()}"
    scene_path = JOBS_DIR / f"{job_id}.scene.json"
    output_path = OUTPUT_DIR / f"{job_id}.png"

    scene_payload = {
        "jobId": job_id,
        "projectId": payload.projectId,
        "sceneData": payload.sceneData,
        "cameraData": payload.cameraData or {},
        "renderSettings": payload.renderSettings,
    }
    scene_path.write_text(json.dumps(scene_payload, indent=2), encoding="utf-8")

    job = RenderJob(
        jobId=job_id,
        projectId=payload.projectId,
        status=RenderStatus.QUEUED,
        message="Render job queued.",
        createdAt=now_iso(),
        updatedAt=now_iso(),
        scenePath=str(scene_path),
        outputPath=str(output_path),
    )
    jobs[job_id] = job
    persist_job(job)
    render_queue.put(job_id)
    return job


@app.get("/render/{job_id}", response_model=RenderJob)
def get_render_job(job_id: str) -> RenderJob:
    job = jobs.get(job_id)
    if not job:
        job_file = JOBS_DIR / f"{job_id}.job.json"
        if job_file.exists():
            return RenderJob.model_validate_json(job_file.read_text(encoding="utf-8"))
        raise HTTPException(status_code=404, detail="Render job not found.")
    return job


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "blender": blender_executable()}
