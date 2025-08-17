# app/services/prediction_reconciler.py
import math
from typing import Dict

def implied_prob_from_hours(pred_hours: float, sla_hours: float, k: float = 0.35) -> float:
    ratio = pred_hours / max(sla_hours, 1e-6)
    return 1.0 / (1.0 + math.exp(-(ratio - 1.0) / k))

def categorize(prob: float) -> str:
    if prob >= 0.66: return "High"
    if prob >= 0.33: return "Medium"
    return "Low"

def reconcile_predictions(pred_hours: float, prob_overdue: float, sla_hours: float, w: float = 0.5) -> Dict[str, float | str]:
    prob_implied = implied_prob_from_hours(pred_hours, sla_hours)
    combined = w * float(prob_overdue) + (1.0 - w) * prob_implied
    if pred_hours >= 2.0 * sla_hours: combined = max(combined, 0.9)
    if pred_hours <= 0.7 * sla_hours: combined = min(combined, 0.2)
    return {
        "predicted_hours": float(pred_hours),
        "sla_hours": float(sla_hours),
        "prob_model": float(prob_overdue),
        "prob_from_hours": float(prob_implied),
        "prob_final": float(round(combined, 2)),
        "risk_bucket": categorize(combined)
    }
