# app/services/duration_predictor.py
import os
import joblib
import pandas as pd
from datetime import datetime
from typing import Dict
import lightgbm as lgb  

MODEL_PATH = os.path.join(os.path.dirname(__file__), "lightgbm_duration_model.pkl")
ENCODER_DIR = os.path.join(os.path.dirname(__file__), "encoders_duration")

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

MODEL = joblib.load(MODEL_PATH)
ENCODERS: Dict[str, object] = {}

def get_encoder(col: str):
    if col not in ENCODERS:
        ENCODERS[col] = joblib.load(ENCODER_PATHS[col])
    return ENCODERS[col]

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
    df["RequestLength"] = df["Description"].apply(lambda x: len(str(x)))
    df["TimeOfDay"] = df["Hour"].apply(
        lambda x: "Morning" if 6 <= x < 12 else ("Afternoon" if 12 <= x < 18 else "Evening")
    )

    for col in ["MainCategory", "SubCategory", "Building", "Site", "TimeOfDay"]:
        enc = get_encoder(col)
        df[col] = enc.transform(df[col].astype(str))

    df["Hour_Weekday"] = df["Hour"] * df["Weekday"]
    return df.reindex(columns=FEATURE_COLUMNS, fill_value=0)

def predict_response_time(new_request: dict) -> float:
    X = preprocess_input(new_request)
    y = MODEL.predict(X)[0]
    return float(round(y, 2))
