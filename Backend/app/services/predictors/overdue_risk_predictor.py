import os
import joblib
import pandas as pd
from datetime import datetime
import numpy as np
from typing import Dict, Any

APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

OVD_DIR = os.path.join(APP_DIR, "ml_models", "overdue")
ENCODER_DIR = os.path.join(APP_DIR, "ml_models", "encoders")

MODEL_PATHS = {
    "random_forest": os.path.join(OVD_DIR, "overdue_random_forest_model.pkl"),
    "xgboost":       os.path.join(OVD_DIR, "overdue_xgboost_model.pkl"),
    "catboost":      os.path.join(OVD_DIR, "overdue_catboost_model.pkl"),
}

MODEL_WEIGHTS = {
    "random_forest": 0.348,
    "xgboost": 0.324,
    "catboost": 0.328,
}

FEATURE_COLUMNS = {
    "random_forest": ["MainCategory", "SubCategory", "Building", "Site", "Hour", "Weekday"],
    "xgboost": ["MainCategory", "SubCategory", "Building", "Site", "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength"],
    "catboost": ["MainCategory", "SubCategory", "Building", "Site", "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength", "IsUrgent"],
}

CATEGORICAL_COLS = ["MainCategory", "SubCategory", "Building", "Site"]

def _has_predict_like(o: Any) -> bool:
    return hasattr(o, "predict") or hasattr(o, "predict_proba")

def _unwrap_estimator(artifact: Any) -> Any:
    if isinstance(artifact, (tuple, list)):
        for item in artifact:
            if _has_predict_like(item):
                return item
    if isinstance(artifact, dict):
        for key in ("model", "estimator", "pipeline", "clf", "classifier"):
            if key in artifact and _has_predict_like(artifact[key]):
                return artifact[key]
    return artifact

LOADED_MODELS: Dict[str, Any] = {}
LOAD_ERRORS: Dict[str, str] = {}
for name, path in MODEL_PATHS.items():
    try:
        art = joblib.load(path)
        est = _unwrap_estimator(art)
        if not _has_predict_like(est):
            raise TypeError("artifact has no usable estimator")
        LOADED_MODELS[name] = est
    except Exception as e:
        LOAD_ERRORS[name] = str(e)

if not LOADED_MODELS:
    raise RuntimeError(f"No overdue models loaded. Errors: {LOAD_ERRORS}")

ENCODERS: Dict[str, Any] = {}
def get_encoder(col: str):
    if col not in ENCODERS:
        ENCODERS[col] = joblib.load(os.path.join(ENCODER_DIR, f"{col}_encoder.pkl"))
    return ENCODERS[col]

def preprocess_input(data: dict, model_name: str) -> pd.DataFrame:
    df = pd.DataFrame([data])

    if "Created on" not in df or pd.isna(df.loc[0, "Created on"]):
        df["Created on"] = datetime.now()
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce").fillna(datetime.now())

    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Description"].apply(lambda x: len(str(x)))
    df["IsUrgent"] = df["Description"].str.contains("(?i)דחוף|מיידי|אסון|תקלה|קריטי|urgent|critical", na=False).astype(int)

    for col in CATEGORICAL_COLS:
        le = get_encoder(col)
        df[col] = df[col].fillna("Unknown").astype(str)
        if "Unknown" not in getattr(le, "classes_", []):
            le.classes_ = np.append(le.classes_, "Unknown")
        df[col] = df[col].apply(lambda v: v if v in le.classes_ else "Unknown")
        df[col] = le.transform(df[col])

    feats = FEATURE_COLUMNS[model_name]
    X = df.reindex(columns=feats, fill_value=0)
    return X

def _model_score(model, X) -> float:
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)
        return float(np.ravel(proba[:, 1])[0])
    pred = model.predict(X)
    return float(np.ravel(pred)[0])

def predict_combined_risk(data: dict) -> float:
    total_w = 0.0
    weighted = 0.0

    for name, model in LOADED_MODELS.items():
        try:
            X = preprocess_input(data, name)
            s = _model_score(model, X)
            w = MODEL_WEIGHTS.get(name, 0.0)
            weighted += s * w
            total_w += w
        except Exception:
            continue

    if total_w == 0.0:
        return 0.5
    return float(round(weighted / total_w, 2))
