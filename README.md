RideRight

Submission for Synatrix

Domain:Gigshield

Problem Statement:Build an AI-powered companion for gig workers that goes beyond simple earnings tracking — one that acts as a financial coach,
a safety net, and a rights advisor all in one. It should help a worker understand not just how much they earned, but whether 
it was fair, safe, and sustainable, and step in with real support the moment something looks wrong.

Team Bit2Bytes
Yash Kumar
Shreya Sharma
Subarno Dutta

Our solution:
RideRight is an AI-powered companion that helps gig workers earn fairly, work safely, and plan sustainably. Instead of being just an earnings tracker, it combines fair-pay analysis, financial coaching, worker rights assistance, and safety support into one intelligent platform.

User Journey-A worker logs a job manually or uploads a screenshot from a gig app. OCR extracts the trip details, and our AI Fairness Engine checks whether the payout is fair. The worker receives instant insights, can consult the AI chatbot for financial or legal guidance, and views all earnings from multiple platforms in a single dashboard with personalized weekly summaries. If the worker feels unsafe or is overworked, RideRight proactively provides safety and wellness support.

Pain Points Solved-
Unclear and potentially unfair payouts
Scattered earnings across multiple gig platforms
Lack of financial planning and actionable insights
Limited awareness of worker rights
Safety and burnout risks during long working hours
Product Vision

Tech Stack:
● Frontend:
React 19
TypeScript
Vite
Tailwind CSS v4
shadcn/ui (Radix UI)
TanStack Start & TanStack Router
TanStack React Query
Framer Motion (Motion)
Recharts
React Hook Form + Zod
Lucide React Icons

● Backend: 
fastapi
uvicorn[standard]
python-multipart
aiosqlite
groq
python-dotenv
Pillow

● AI/ML: 
Groq API — llama-3.1-8b-instant model
Language-Python
Key libraries-groq (official SDK), python-dotenv (for API key management)
AI use cases-Chatbot Q&A (fairness explanations, rights, complaints), weekly natural-language insight summaries, fatigue nudges, multilingual response generation (native, not post-translation)
● Database/Storage:
● Other tools/APIs: 

Features Implemented:

* 📊 Unified dashboard for earnings, work hours, and analytics
* 📝 Manual job logging & OCR-based screenshot upload
* 🤖 AI-powered Fairness Checker for underpayment detection
* 💬 AI Copilot for financial guidance and worker rights
* 📈 AI-generated weekly insights and earning trends
* 🔄 Multi-platform earnings aggregation
* 📜 Job history with AI fairness analysis
* 👤 User profile with performance metrics
* ✨ Responsive, modern UI with interactive charts and animations

Core Requirements: 
-Let the worker log each job (fare, distance, time) manually, or scan a screenshot of their delivery/ride app using OCR to auto-extract the earnings data.
-A simple fairness-check model that flags a job as "possible underpayment" by comparing the actual payout against an expected fair-rate benchmark for that distance/time (a small reference dataset is enough).
-An AI chatbot (LLM API) that explains, in simple language, things like "is this fare fair?", "what are my rights?", or "how do I raise a complaint?".
-A dashboard summarizing weekly earnings, flagged underpayments, and total hours worked.
-A multi-platform earnings aggregator — let the worker log jobs from more than one gig app (e.g. a food delivery app and a ride-hailing app) and see all earnings unified in a single dashboard.
-An AI-generated weekly insight summary that goes beyond raw numbers, e.g. "You earned 12% less this week, and most of the underpayment happened during night shifts".

Bonus Features Attempted: 
AI-generated complaint draft – Generates a complaint message for underpaid jobs using the LLM.
Fatigue/Burnout detector – Detects long working hours and generates an AI wellness/break reminder.
Multilingual AI responses – The LLM is set up to generate responses in multiple languages (native generation rather than translating after the fact).
