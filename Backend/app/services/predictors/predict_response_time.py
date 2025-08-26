import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any

APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

DUR_DIR = os.path.join(APP_DIR, "ml_models", "duration")
MODEL_PATH = os.path.join(DUR_DIR, "lightgbm_duration_model.pkl")
ENCODER_DIR = os.path.join(APP_DIR, "ml_models", "encoders_duration")

ENCODER_PATHS: Dict[str, str] = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl"),
    "TimeOfDay": os.path.join(ENCODER_DIR, "TimeOfDay_encoder.pkl"),
}

FEATURE_COLUMNS = [
    "MainCategory", "SubCategory", "Building", "Site",
    "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend",
    "RequestLength", "TimeOfDay", "Hour_Weekday"
]

# Extracts the actual estimator from various artifact formats for the duration prediction model
def _unwrap_estimator(artifact: Any) -> Any:
    if isinstance(artifact, (tuple, list)):
        for item in artifact:
            if hasattr(item, "predict"):
                return item
    if isinstance(artifact, dict):
        for key in ("model", "estimator", "regressor", "pipeline"):
            if key in artifact and hasattr(artifact[key], "predict"):
                return artifact[key]
    return artifact

art = joblib.load(MODEL_PATH)
MODEL = _unwrap_estimator(art)

ENCODERS: Dict[str, Any] = {}
# Loads and caches label encoders for categorical feature transformation in duration prediction
def get_encoder(col: str):
    if col not in ENCODERS:
        ENCODERS[col] = joblib.load(ENCODER_PATHS[col])
    return ENCODERS[col]

# Safely transforms categorical data using label encoders with unknown value handling
def _safe_transform(col: str, series: pd.Series) -> pd.Series:
    enc = get_encoder(col)
    classes = set(getattr(enc, "classes_", []))
    s = series.astype(str).fillna("Unknown").str.strip()
    unknown_mask = ~s.isin(classes) if classes else pd.Series(False, index=s.index)
    if unknown_mask.any() and "Unknown" not in classes:
        enc.classes_ = np.append(getattr(enc, "classes_", np.array([], dtype=object)), "Unknown")
        s = s.where(~unknown_mask, "Unknown")
    elif unknown_mask.any():
        s = s.where(~unknown_mask, "Unknown")
    return enc.transform(s)

# Preprocesses input data for duration prediction including feature engineering and encoding
def preprocess_input(data: dict) -> pd.DataFrame:
    df = pd.DataFrame([data])

    if "Created on" not in df or pd.isna(df.loc[0, "Created on"]):
        df["Created on"] = datetime.now()
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce").fillna(datetime.now())

    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)

    desc = df.get("Description", "").fillna("").astype(str)
    df["RequestLength"] = desc.str.len()
    df["TimeOfDay"] = df["Hour"].apply(
        lambda x: "Morning" if 6 <= x < 12 else ("Afternoon" if 12 <= x < 18 else "Evening")
    )

    for col in ["MainCategory", "SubCategory", "Building", "Site", "TimeOfDay"]:
        if col not in df:
            df[col] = "Unknown"
        df[col] = _safe_transform(col, df[col])

    df["Hour_Weekday"] = df["Hour"] * df["Weekday"]

    X = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)
    return X

# Predicts the expected response time in hours for a new service request using LightGBM model
def predict_response_time(new_request: dict) -> float:
    X = preprocess_input(new_request)
    yhat = MODEL.predict(X)
    y = float(yhat[0]) if isinstance(yhat, (list, tuple, np.ndarray)) else float(yhat)
    return float(round(y, 2))
