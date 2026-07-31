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

AI component:
 
Tech Stack:
● Frontend:
React.js – Responsive single-page application
TypeScript – Type-safe development
Tailwind CSS – Modern, responsive UI styling
shadcn/ui – Reusable UI components
Framer Motion – Smooth animations and transitions
Recharts – Earnings and analytics visualizations
React Router – Client-side navigation

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

Features Implemented 
Core Requirements: 
Bonus Features Attempted: 
