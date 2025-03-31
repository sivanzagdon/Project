import os
import joblib
import pandas as pd
from datetime import datetime
import numpy as np

BASE_DIR = r"C:\Users\Sivan Zagdon\DS\Project\Backend\app\services"
ENCODER_DIR = os.path.join(BASE_DIR, "encoders")

MODEL_PATHS = {
    "random_forest": os.path.join(BASE_DIR, "overdue_random_forest_model.pkl"),
    "xgboost": os.path.join(BASE_DIR, "overdue_xgboost_model.pkl"),
    "catboost": os.path.join(BASE_DIR, "overdue_catboost_model.pkl")
}

MODEL_WEIGHTS = {
    "random_forest": 0.83,
    "xgboost": 0.77,
    "catboost": 0.78
}

FEATURE_COLUMNS = {
    "random_forest": ['MainCategory', 'SubCategory', 'Building', 'Site', 'Hour', 'Weekday'],
    "xgboost": ['MainCategory', 'SubCategory', 'Building', 'Site', 'Hour', 'Weekday', 'Month', 'DayOfMonth', 'Is weekend', 'RequestLength'],
    "catboost": ['MainCategory', 'SubCategory', 'Building', 'Site', 'Hour', 'Weekday', 'Month', 'DayOfMonth', 'Is weekend', 'RequestLength', 'IsUrgent']
}

CATEGORICAL_COLS = ["MainCategory", "SubCategory", "Building", "Site"]

# Load models into memory once
LOADED_MODELS = {}
for name, path in MODEL_PATHS.items():
    try:
        LOADED_MODELS[name] = joblib.load(path)
        print(f"Model '{name}' loaded into memory.")
    except Exception as e:
        print(f"Error loading model '{name}': {e}")

def preprocess_input(data: dict, model_name: str) -> pd.DataFrame:
    print("Preprocessing input data...")
    df = pd.DataFrame([data])

    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Description"].apply(lambda x: len(str(x)))
    df["IsUrgent"] = df["Description"].str.contains("(?i)דחוף|מיידי|אסון|תקלה|קריטי", na=False).astype(int)

    for col in CATEGORICAL_COLS:
        df[col] = df[col].fillna("Unknown")
        encoder_path = os.path.join(ENCODER_DIR, f"{col}_encoder.pkl")
        le = joblib.load(encoder_path)
        df[col] = df[col].apply(lambda val: val if val in le.classes_ else "Unknown")
        if "Unknown" not in le.classes_:
            le.classes_ = np.append(le.classes_, "Unknown")
        df[col] = le.transform(df[col].astype(str))

    features = FEATURE_COLUMNS[model_name]
    X = df[features].copy()
    X = X.reindex(columns=features, fill_value=0)

    print("Data after preprocessing:")
    print(X.head())
    return X

def predict_combined_risk(data: dict) -> float:
    data["Created on"] = datetime.now().strftime("%m/%d/%Y %H:%M")
    total_weight = 0
    weighted_sum = 0

    for name in MODEL_PATHS:
        try:
            model, features = LOADED_MODELS[name]
            print(f"Using preloaded model: {name}")
            X = preprocess_input(data, name)

            print(f"Running prediction with {name} model...")
            pred = int(model.predict(X)[0])
            print(f"{name} model prediction: {pred}")

            weighted_sum += pred * MODEL_WEIGHTS[name]
            total_weight += MODEL_WEIGHTS[name]

            print(f"Weighted sum for {name}: {weighted_sum}")
            print(f"Total weight: {total_weight}")

        except Exception as e:
            print(f"Failed to use model '{name}': {e}")

    if total_weight > 0:
        final_score = round((weighted_sum / total_weight), 2)
        print(f"Combined risk score calculated: {final_score}")
    else:
        final_score = 0.5
        print("No models returned valid predictions. Defaulting to 0.5")

    return final_score
