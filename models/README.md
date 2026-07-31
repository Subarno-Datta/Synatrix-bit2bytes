# GigShield — Model Layer (Groq)

This folder holds the AI/model logic. The backend should import from `groq_llm.py`
and call these functions — treat this as the contract between the model layer and
the backend.

## Setup

```bash
cd models
pip install -r requirements.txt
```

Create a `.env` file in this folder (already gitignored) with:

GROQ_API_KEY=your_key_here

Get a free key at [console.groq.com/keys](https://console.groq.com/keys).

Test it works before integrating:
```bash
python groq_llm.py
```

## Functions (the interface the backend should call)

| Function | Purpose | Returns |
|---|---|---|
| `fairness_qa(question, job_data, lang_code="en")` | Chatbot Q&A grounded in a job's fairness data. Pass `lang_code` (`en`/`hi`/`kn`/`ta`) to get the response directly in that language — no separate translation call needed. | `str` |
| `weekly_insight_summary(week_data)` | Natural-language summary of the week's earnings/fairness/hours | `str` |
| `complaint_draft(job_data)` | Drafts a complaint message for an underpaid job | `str` |
| `fatigue_nudge(hours_worked, threshold)` | Short caring message when hours exceed threshold | `str` |
| `translate(text, target_lang_code)` | Fallback-only translation of already-generated English text. Prefer generating directly in-language via `fairness_qa`'s `lang_code` param instead — it's one LLM call instead of two. | `str` |

## Expected shapes

`job_data` dict expects these keys (matches the fairness-check output the backend produces):
```python
{
    "platform_type": "food_delivery",  # or "ride_hailing"
    "distance_km": 5,
    "time_min": 20,
    "actual_payout": 65,
    "expected_fare": 92,
    "fairness_percent": 70.7,
    "label": "Possible underpayment",
}
```

`week_data` dict expects:
```python
{
    "total_earned": 1240,
    "flagged_count": 3,
    "total_jobs": 12,
    "total_hours": 38.5,
    "worst_day": "2026-07-29",
    "worst_day_ratio": 68.2,
}
```

## Notes for the team

- Model: `llama-3.1-8b-instant` on Groq — fast enough that cold-start latency isn't a
  concern during the live demo.
- Non-English responses use a higher token budget (220 vs 150) since Indic scripts use
  more tokens per word than English — without this, longer Hindi/Kannada/Tamil answers
  get cut off mid-sentence.
- If responses feel too shallow for the demo, swap `MODEL_ID` in `groq_llm.py` to
  `llama-3.3-70b-versatile` — still on Groq's free tier, slightly slower but noticeably smarter.
- Every function has error handling and returns a readable fallback string instead of
  crashing — so a Groq API hiccup during the demo won't break the whole UI, just show a
  "temporarily unavailable" message in that one spot.