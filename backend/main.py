"""
RideRight Backend — FastAPI
Run: uvicorn main:app --reload --port 8000
"""

import os
import sys
import uuid
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")

# Allow importing from models/ folder
sys.path.insert(0, str(Path(__file__).parent.parent / "models"))

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import groq_llm
import fairness
import database

app = FastAPI(title="RideRight API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await database.init_db()


# ── Models ────────────────────────────────────────────────────────────────────

class JobIn(BaseModel):
    platform: str
    fare: float
    distance: float = Field(gt=0)
    minutes: float = Field(gt=0)
    date: str = ""

class ChatIn(BaseModel):
    message: str
    job_id: str | None = None
    lang: str = "en"

class ComplaintIn(BaseModel):
    job_id: str

class FatigueIn(BaseModel):
    hours_worked: float
    threshold: float = 10.0


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok"}


# ── Jobs ──────────────────────────────────────────────────────────────────────

@app.post("/api/jobs", status_code=201)
async def log_job(body: JobIn):
    result = fairness.assess(body.platform, body.distance, body.minutes, body.fare)

    job_id = f"RR-{str(uuid.uuid4())[:4].upper()}"
    date_str = body.date or datetime.now().strftime("%d %b · %I:%M %p")

    job = {
        "id": job_id,
        "platform": body.platform.capitalize(),
        "fare": body.fare,
        "distance": body.distance,
        "minutes": body.minutes,
        "date": date_str,
        "status": result["label"],
        "expected": result["expected_fare"],
        "fairness_pct": result["fairness_percent"],
    }
    await database.insert_job(job)

    return {
        "job": job,
        "fairness": result,
    }


@app.get("/api/jobs")
async def list_jobs(limit: int = 50):
    jobs = await database.get_jobs(limit)
    return {"jobs": jobs}


# ── Screenshot OCR ────────────────────────────────────────────────────────────

@app.post("/api/jobs/scan")
async def scan_screenshot(file: UploadFile = File(...)):
    """
    Returns a preview URL for the uploaded screenshot so the user
    can confirm/correct values before saving via POST /api/jobs.
    """
    import base64, io
    from PIL import Image

    image_bytes = await file.read()
    # Resize to thumbnail for fast preview in frontend
    img = Image.open(io.BytesIO(image_bytes))
    img.thumbnail((600, 1200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    b64 = base64.b64encode(buf.getvalue()).decode()
    mime = "image/jpeg"

    return {
        "preview": f"data:{mime};base64,{b64}",
        "filename": file.filename,
    }


# ── Dashboard ─────────────────────────────────────────────────────────────────

@app.get("/api/dashboard")
async def dashboard():
    data = await database.get_dashboard_stats()
    return data


# ── AI Insights ───────────────────────────────────────────────────────────────

@app.get("/api/insights")
async def insights():
    jobs = await database.get_jobs(limit=100)
    if not jobs:
        return {"summary": "No jobs logged yet. Start by logging your first gig!", "insights": []}

    total_earned = sum(j["fare"] for j in jobs)
    total_jobs = len(jobs)
    flagged = [j for j in jobs if j["status"] != "fair"]
    total_hours = round(sum(j["minutes"] for j in jobs) / 60, 1)

    # find worst day by avg fairness
    from collections import defaultdict
    day_fairs: dict[str, list] = defaultdict(list)
    for j in jobs:
        try:
            dt = datetime.fromisoformat(j["created_at"])
            day_fairs[dt.strftime("%Y-%m-%d")].append(j["fairness_pct"])
        except Exception:
            pass

    worst_day = ""
    worst_ratio = 100.0
    for day, vals in day_fairs.items():
        avg = sum(vals) / len(vals)
        if avg < worst_ratio:
            worst_ratio = avg
            worst_day = day

    week_data = {
        "total_earned": total_earned,
        "flagged_count": len(flagged),
        "total_jobs": total_jobs,
        "total_hours": total_hours,
        "worst_day": worst_day or "N/A",
        "worst_day_ratio": round(worst_ratio, 1),
    }

    summary = groq_llm.weekly_insight_summary(week_data)
    return {"summary": summary, "week_data": week_data}


# ── Chat / Copilot ────────────────────────────────────────────────────────────

@app.post("/api/chat")
async def chat(body: ChatIn):
    jobs = await database.get_jobs(limit=100)

    # Build context: find the referenced job or use the most recent flagged one
    job_data = None
    if body.job_id:
        job_data = next((j for j in jobs if j["id"] == body.job_id), None)
    if not job_data and jobs:
        flagged = [j for j in jobs if j["status"] != "fair"]
        job_data = flagged[0] if flagged else jobs[0]

    if job_data:
        groq_job = {
            "platform_type": fairness.platform_type(job_data["platform"]),
            "distance_km": job_data["distance"],
            "time_min": job_data["minutes"],
            "actual_payout": job_data["fare"],
            "expected_fare": job_data["expected"],
            "fairness_percent": job_data["fairness_pct"],
            "label": job_data["status"],
        }
        reply = groq_llm.fairness_qa(body.message, groq_job, lang_code=body.lang)
    else:
        # No jobs yet — answer generically
        reply = groq_llm._call_groq(
            "You are a helpful financial advisor for gig workers in India. Keep answers under 80 words.",
            body.message,
            max_tokens=150,
        )

    return {"reply": reply}


# ── Complaint Draft ───────────────────────────────────────────────────────────

@app.post("/api/complaint")
async def complaint(body: ComplaintIn):
    jobs = await database.get_jobs()
    job = next((j for j in jobs if j["id"] == body.job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    groq_job = {
        "platform_type": fairness.platform_type(job["platform"]),
        "distance_km": job["distance"],
        "time_min": job["minutes"],
        "actual_payout": job["fare"],
        "expected_fare": job["expected"],
    }
    draft = groq_llm.complaint_draft(groq_job)
    return {"draft": draft, "job_id": body.job_id}


# ── Fatigue Check ─────────────────────────────────────────────────────────────

@app.post("/api/fatigue")
async def fatigue(body: FatigueIn):
    nudge = groq_llm.fatigue_nudge(body.hours_worked, body.threshold)
    return {"nudge": nudge}


# ── Profile ───────────────────────────────────────────────────────────────────

@app.get("/api/profile")
async def profile():
    jobs = await database.get_jobs(limit=1000)
    if not jobs:
        return {
            "total_jobs": 0,
            "avg_fairness": 0.0,
            "total_earnings": 0.0,
            "platforms": [],
            "today_earnings": 0.0,
            "most_flagged_job": None,
        }

    total_jobs = len(jobs)
    avg_fairness = round(sum(j["fairness_pct"] for j in jobs) / total_jobs, 1)
    total_earnings = round(sum(j["fare"] for j in jobs), 2)

    # platforms ranked by avg fairness
    from collections import defaultdict
    plat_fair: dict[str, list] = defaultdict(list)
    plat_earn: dict[str, float] = defaultdict(float)
    for j in jobs:
        plat_fair[j["platform"]].append(j["fairness_pct"])
        plat_earn[j["platform"]] += j["fare"]

    platforms = sorted(
        [
            {
                "platform": p,
                "avg_fairness": round(sum(v) / len(v), 1),
                "total_earnings": round(plat_earn[p], 2),
                "job_count": len(v),
            }
            for p, v in plat_fair.items()
        ],
        key=lambda x: x["avg_fairness"],
        reverse=True,
    )

    # today's earnings
    today = datetime.now().strftime("%Y-%m-%d")
    today_earnings = round(
        sum(j["fare"] for j in jobs if j.get("created_at", "").startswith(today)), 2
    )

    # most underpaid job
    underpaid = [j for j in jobs if j["status"] == "underpaid"]
    most_flagged = None
    if underpaid:
        worst = min(underpaid, key=lambda j: j["fairness_pct"])
        most_flagged = {
            "id": worst["id"],
            "platform": worst["platform"],
            "fare": worst["fare"],
            "expected": worst["expected"],
            "fairness_pct": worst["fairness_pct"],
        }

    return {
        "total_jobs": total_jobs,
        "avg_fairness": avg_fairness,
        "total_earnings": total_earnings,
        "platforms": platforms,
        "today_earnings": today_earnings,
        "most_flagged_job": most_flagged,
    }
