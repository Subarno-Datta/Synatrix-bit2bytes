"""
Groq API integration for GigShield's AI features.

SETUP:
1. Get a free Groq API key: https://console.groq.com/keys
2. Add it to a .env file: GROQ_API_KEY=your_key_here
3. pip install groq python-dotenv
4. Test standalone first: python groq_llm.py
"""

import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # reads .env and loads GROQ_API_KEY into environment

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
MODEL_ID = "llama-3.1-8b-instant"  # fast + free-tier friendly; swap to llama-3.3-70b-versatile for higher quality if needed

client = Groq(api_key=GROQ_API_KEY)

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "kn": "Kannada",
    "ta": "Tamil",
}


def _call_groq(system_prompt: str, user_prompt: str, max_tokens: int = 200) -> str:
    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=0.4,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[AI temporarily unavailable: {e}]"


def fairness_qa(question: str, job_data: dict, lang_code: str = "en") -> str:
    lang_name = LANGUAGE_NAMES.get(lang_code, "English")
    system_prompt = (
        "You are a helpful assistant for gig workers in India. "
        "Explain things in simple, plain language. Keep your response under 100 words. "
        f"Respond in {lang_name}."
    )
    user_prompt = f"""Job data: platform={job_data.get('platform_type')}, distance={job_data.get('distance_km')}km,
time={job_data.get('time_min')}min, paid=₹{job_data.get('actual_payout')},
expected fair rate=₹{job_data.get('expected_fare')}, fairness={job_data.get('fairness_percent')}%,
status={job_data.get('label')}

Worker's question: "{question}"

Answer clearly and supportively, referencing the specific numbers above."""
    token_budget = 150 if lang_code == "en" else 220  # Indic scripts use more tokens per word
    return _call_groq(system_prompt, user_prompt, max_tokens=token_budget)


def weekly_insight_summary(week_data: dict) -> str:
    system_prompt = (
        "You summarize a gig worker's week in 2-3 short sentences, plain language, no jargon. "
        "Highlight the most useful pattern, e.g. which day/time had the worst pay."
    )
    user_prompt = f"""Data: total earned=₹{week_data.get('total_earned')}, jobs flagged as underpaid=
{week_data.get('flagged_count')}/{week_data.get('total_jobs')}, total hours=
{week_data.get('total_hours')}, worst day={week_data.get('worst_day')}
(avg fairness {week_data.get('worst_day_ratio')}%)"""
    return _call_groq(system_prompt, user_prompt, max_tokens=100)


def complaint_draft(job_data: dict) -> str:
    system_prompt = "Write a short, polite complaint message (under 80 words) a gig worker can send to their platform's support."
    user_prompt = f"""About this underpaid job:
Platform: {job_data.get('platform_type')}, Paid: ₹{job_data.get('actual_payout')},
Expected: ₹{job_data.get('expected_fare')}, Distance: {job_data.get('distance_km')}km,
Time: {job_data.get('time_min')}min."""
    return _call_groq(system_prompt, user_prompt, max_tokens=120)


def fatigue_nudge(hours_worked: float, threshold: float) -> str:
    system_prompt = "Write a short, caring one-sentence check-in message for a tired worker."
    user_prompt = f"This gig worker has logged {hours_worked} consecutive working hours today, above the healthy threshold of {threshold}. Suggest they take a break."
    return _call_groq(system_prompt, user_prompt, max_tokens=60)


def translate(text: str, target_lang_code: str) -> str:
    """
    Groq has no dedicated translation model, so this prompts the LLM directly
    to translate. Only used as a fallback — prefer generating the response
    directly in the target language via fairness_qa's lang_code param instead,
    since that avoids a double LLM call.
    """
    if target_lang_code == "en":
        return text
    lang_name = LANGUAGE_NAMES.get(target_lang_code, target_lang_code)
    system_prompt = f"Translate the given text into {lang_name}. Return only the translation, nothing else."
    return _call_groq(system_prompt, text, max_tokens=200)


if __name__ == "__main__":
    # Quick manual test — run this file directly to confirm your GROQ_API_KEY works
    sample_job = {
        "platform_type": "food_delivery",
        "distance_km": 5,
        "time_min": 20,
        "actual_payout": 65,
        "expected_fare": 92,
        "fairness_percent": 70.7,
        "label": "Possible underpayment",
    }
    print("Testing fairness Q&A (English)...")
    print(fairness_qa("Was this fare fair?", sample_job))
    print("\nTesting fairness Q&A (Hindi)...")
    print(fairness_qa("Was this fare fair?", sample_job, lang_code="hi"))