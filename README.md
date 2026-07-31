# SynapTrix Submission: RideRight

## Team
- Team code: T7856
- Team name: Bit2Bytes
- Members: Yash Kumar, Shreya Sharma, Subarno Dutta

## Domain & Problem
- Domain: GigShield — Gig Economy & Informal Sector Tech
- Problem statement: Build an AI-powered companion for gig workers that goes beyond simple
  earnings tracking — one that acts as a financial coach, a safety net, and a rights advisor
  all in one. It should help a worker understand not just how much they earned, but whether
  it was fair, safe, and sustainable, and step in with real support the moment something
  looks wrong.

## Solution
RideRight is an AI-powered companion that helps gig workers earn fairly, work safely, and plan
sustainably. Instead of being just an earnings tracker, it combines fair-pay analysis, financial
coaching, worker rights assistance, and safety support into one intelligent platform.

**User journey:** A worker logs a job manually or uploads a screenshot from a gig app. OCR
extracts the trip details, and the AI Fairness Engine checks whether the payout is fair. The
worker receives instant insights, can consult the AI chatbot for financial or legal guidance,
and views all earnings from multiple platforms in a single dashboard with personalized weekly
summaries. If the worker feels overworked, RideRight proactively provides wellness support.

**Pain points solved:**
- Unclear and potentially unfair payouts
- Scattered earnings across multiple gig platforms
- Lack of financial planning and actionable insights
- Limited awareness of worker rights
- Safety and burnout risks during long working hours

The AI component matters because it turns raw numbers into something a worker can actually act
on — a plain-language explanation, a language they understand, a moment of care — rather than
just another dashboard to interpret alone.

## AI Usage
- Model/API used: Groq API — `llama-3.1-8b-instant`
- Prompting or fine-tuning approach: No fine-tuning — zero-shot prompting with structured job
  data (platform, distance, time, payout, fairness ratio) injected directly into each prompt so
  responses stay grounded in the worker's actual numbers rather than generic advice. Response
  length is capped per prompt to keep outputs concise and demo-reliable. Multilingual responses
  are generated natively in the target language via the prompt (not translated afterward),
  keeping it to one LLM call per response.
- Safety/validation checks: The core fairness determination (underpaid / slightly low / fair) is
  rule-based and transparent, not model-generated — the LLM only explains an already-computed
  result, so a worker is never told something is unfair purely on the model's say-so. All LLM
  calls have error handling with a readable fallback message if the API is unreachable or times
  out, so a Groq hiccup during the demo doesn't break the app.

## Demo
- Live demo/video: <add link>
- Repository: https://github.com/Subarno-Datta/Synatrix-bit2bytes

## Setup

Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Models/AI layer:
```bash
cd models
pip install -r requirements.txt
# add GROQ_API_KEY to a .env file in this folder
python groq_llm.py
```

## Judging Notes
- What works today:
  - Unified dashboard for earnings, work hours, and analytics
  - Manual job logging & OCR-based screenshot upload
  - AI-powered Fairness Checker for underpayment detection
  - AI Copilot for financial guidance and worker rights
  - AI-generated weekly insights and earning trends
  - Multi-platform earnings aggregation
  - Job history with AI fairness analysis
  - User profile with performance metrics
  - AI-generated complaint drafts for underpaid jobs
  - Fatigue/burnout detector with AI-generated wellness nudges
  - Responsive, modern UI with interactive charts and animations
- Known limitations: <fill in — e.g. SQLite storage only, no persistence across deployments;
  OCR accuracy depends on screenshot quality; free-tier Groq rate limits under heavy use>
- What you would build next: Community fairness benchmark using crowdsourced fare data across
  workers, an "I feel unsafe" safety trigger with location sharing, route safety scoring
</parameter>
