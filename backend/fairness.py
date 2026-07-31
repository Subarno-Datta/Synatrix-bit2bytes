"""
Fare fairness estimation.

Expected fare formula (heuristic based on Indian gig market rates):
  food_delivery / quick_commerce:  base ₹30 + ₹12/km + ₹1.5/min
  ride_hailing:                    base ₹40 + ₹14/km + ₹1.8/min

Fairness thresholds:
  >= 90%  → fair
  75–89%  → review
  < 75%   → underpaid
"""

PLATFORM_TYPE: dict[str, str] = {
    "swiggy": "food_delivery",
    "zomato": "food_delivery",
    "blinkit": "quick_commerce",
    "uber": "ride_hailing",
    "rapido": "ride_hailing",
    "ola": "ride_hailing",
}

RATES = {
    "food_delivery":   {"base": 30, "per_km": 12, "per_min": 1.5},
    "quick_commerce":  {"base": 25, "per_km": 11, "per_min": 1.4},
    "ride_hailing":    {"base": 40, "per_km": 14, "per_min": 1.8},
}


def platform_type(platform: str) -> str:
    return PLATFORM_TYPE.get(platform.lower(), "food_delivery")


def expected_fare(platform: str, distance_km: float, time_min: float) -> float:
    ptype = platform_type(platform)
    r = RATES[ptype]
    return round(r["base"] + r["per_km"] * distance_km + r["per_min"] * time_min, 2)


def fairness_percent(actual: float, expected: float) -> float:
    if expected <= 0:
        return 100.0
    return round((actual / expected) * 100, 1)


def fairness_label(pct: float) -> str:
    if pct >= 90:
        return "fair"
    if pct >= 75:
        return "review"
    return "underpaid"


def assess(platform: str, distance_km: float, time_min: float, actual_payout: float) -> dict:
    exp = expected_fare(platform, distance_km, time_min)
    pct = fairness_percent(actual_payout, exp)
    label = fairness_label(pct)
    return {
        "platform_type": platform_type(platform),
        "distance_km": distance_km,
        "time_min": time_min,
        "actual_payout": actual_payout,
        "expected_fare": exp,
        "fairness_percent": pct,
        "label": label,
    }
