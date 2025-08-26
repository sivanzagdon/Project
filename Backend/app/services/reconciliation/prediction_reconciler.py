import math
from typing import Dict, Union

Number = Union[float, int]

# Calculates implied overdue probability from predicted hours vs SLA hours using sigmoid function
def implied_prob_from_hours(pred_hours: Number, sla_hours: Number, k: float = 0.35) -> float:
    ratio = float(pred_hours) / max(float(sla_hours), 1e-6)
    return 1.0 / (1.0 + math.exp(-(ratio - 1.0) / k))

# Categorizes probability into risk buckets: High (>=0.66), Medium (>=0.33), Low (<0.33)
def categorize(prob: float) -> str:
    if prob >= 0.66:
        return "High"
    if prob >= 0.33:
        return "Medium"
    return "Low"

# Combines ML model predictions with time-based predictions to create final risk assessment
def reconcile_predictions(pred_hours: Number, prob_overdue: Number, sla_hours: Number, w: float = 0.5) -> Dict[str, float | str]:
    pred_h = float(pred_hours)
    sla_h = float(sla_hours)
    prob_model = float(prob_overdue)

    prob_implied = implied_prob_from_hours(pred_h, sla_h)
    combined = w * prob_model + (1.0 - w) * prob_implied

    if pred_h >= 2.0 * sla_h:
        combined = max(combined, 0.9)
    if pred_h <= 0.7 * sla_h:
        combined = min(combined, 0.2)

    return {
        "predicted_hours": float(round(pred_h, 2)),
        "sla_hours": float(round(sla_h, 2)),
        "prob_model": float(round(prob_model, 3)),
        "prob_from_hours": float(round(prob_implied, 3)),
        "prob_final": float(round(combined, 2)),
        "risk_bucket": categorize(combined),
    }
