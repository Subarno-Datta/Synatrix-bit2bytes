import aiosqlite
import json
from pathlib import Path

DB_PATH = Path(__file__).parent / "rideright.db"


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id          TEXT PRIMARY KEY,
                platform    TEXT NOT NULL,
                fare        REAL NOT NULL,
                distance    REAL NOT NULL,
                minutes     REAL NOT NULL,
                date        TEXT NOT NULL,
                status      TEXT NOT NULL,
                expected    REAL NOT NULL,
                fairness_pct REAL NOT NULL,
                created_at  TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.commit()


async def insert_job(job: dict):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """INSERT OR REPLACE INTO jobs
               (id, platform, fare, distance, minutes, date, status, expected, fairness_pct)
               VALUES (:id, :platform, :fare, :distance, :minutes, :date, :status, :expected, :fairness_pct)""",
            job,
        )
        await db.commit()


async def get_jobs(limit: int = 50) -> list[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM jobs ORDER BY created_at DESC LIMIT ?", (limit,)
        ) as cur:
            rows = await cur.fetchall()
    return [dict(r) for r in rows]


async def get_dashboard_stats() -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row

        async with db.execute("""
            SELECT
                COALESCE(SUM(fare), 0)                          AS total_earnings,
                COALESCE(SUM(minutes) / 60.0, 0)               AS total_hours,
                COUNT(DISTINCT platform)                        AS platforms_used,
                SUM(CASE WHEN status != 'fair' THEN 1 ELSE 0 END) AS flagged_jobs,
                COALESCE(SUM(CASE WHEN status != 'fair' THEN expected - fare ELSE 0 END), 0) AS lost_earnings
            FROM jobs
        """) as cur:
            stats = dict(await cur.fetchone())

        async with db.execute("""
            SELECT platform,
                   SUM(fare)  AS amount,
                   COUNT(*)   AS job_count
            FROM jobs
            GROUP BY platform
            ORDER BY amount DESC
        """) as cur:
            platform_rows = [dict(r) for r in await cur.fetchall()]

        async with db.execute("""
            SELECT strftime('%w', created_at) AS dow,
                   SUM(fare)                  AS earnings,
                   AVG(expected)              AS fair
            FROM jobs
            GROUP BY dow
            ORDER BY dow
        """) as cur:
            weekly_rows = [dict(r) for r in await cur.fetchall()]

    day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    weekly = [
        {"day": day_names[int(r["dow"])], "earnings": round(r["earnings"], 2), "fair": round(r["fair"], 2)}
        for r in weekly_rows
    ]

    return {
        "stats": {
            "total_earnings": round(stats["total_earnings"], 2),
            "total_hours": round(stats["total_hours"], 1),
            "platforms_used": stats["platforms_used"],
            "flagged_jobs": stats["flagged_jobs"],
            "lost_earnings": round(stats["lost_earnings"], 2),
        },
        "platform_earnings": platform_rows,
        "weekly": weekly,
    }
