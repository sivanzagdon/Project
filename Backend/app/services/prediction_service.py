

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
    "naive_bayes": os.path.join(BASE_DIR, "overdue_naive_bayes_model.pkl"),
    "adaboost": os.path.join(BASE_DIR, "overdue_adaboost_model.pkl")
}

MODEL_WEIGHTS = {
    "random_forest": 0.83,
    "xgboost": 0.60,
    "naive_bayes": 0.50,
    "adaboost": 0.60
}

FEATURE_COLUMNS = {
    "random_forest": ['MainCategory', 'SubCategory', 'Building', 'Site', 'Hour', 'Weekday'],
    "xgboost": ['MainCategory', 'SubCategory', 'Building', 'Site', 'Hour', 'Weekday', 'Month', 'DayOfMonth', 'Is weekend', 'RequestLength'],
    "naive_bayes": ['MainCategory', 'SubCategory', 'Building', 'Site', 'Hour', 'Weekday'],
    "adaboost": ['MainCategory', 'SubCategory', 'Building', 'Site', 'Hour', 'Weekday', 'Month', 'DayOfMonth', 'Is weekend', 'RequestLength']
}

CATEGORICAL_COLS = ["MainCategory", "SubCategory", "Building", "Site"]

def preprocess_input(data: dict, model_name: str) -> pd.DataFrame:
    print("\U0001f9f9 Preprocessing input data...")
    df = pd.DataFrame([data])

    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Description"].apply(lambda x: len(str(x)))

    # Fill NAs for safety
    for col in CATEGORICAL_COLS:
        df[col] = df[col].fillna("Unknown")

    for col in CATEGORICAL_COLS:
        encoder_path = os.path.join(ENCODER_DIR, f"{col}_encoder.pkl")
        le = joblib.load(encoder_path)
        df[col] = df[col].apply(lambda val: val if val in le.classes_ else "Unknown")

        if "Unknown" not in le.classes_:
            le.classes_ = np.append(le.classes_, "Unknown")

        df[col] = le.transform(df[col].astype(str))

    features = FEATURE_COLUMNS[model_name]
    X = df[features].copy()
    X = X.reindex(columns=features, fill_value=0)

    print("\U0001f9ee Data after preprocessing:")
    print(X.head())
    return X

def predict_combined_risk(data: dict) -> float:
    data["Created on"] = datetime.now().strftime("%m/%d/%Y %H:%M")
    total_weight = 0
    weighted_sum = 0

    for name, path in MODEL_PATHS.items():
        try:
            print(f"\U0001f501 Attempting to load model: {name} from path: {path}")
            model, features = joblib.load(path)
            print(f"✅ {name} model loaded successfully")
            X = preprocess_input(data, name)

            print(f"⚙️ Running prediction with {name} model...")
            pred = int(model.predict(X)[0])
            print(f"\U0001f4ca {name} model prediction: {pred}")

            weighted_sum += pred * MODEL_WEIGHTS[name]
            total_weight += MODEL_WEIGHTS[name]

            print(f"Weighted sum for {name}: {weighted_sum}")
            print(f"Total weight: {total_weight}")

        except Exception as e:
            print(f"⚠️ Failed to load or predict with {name}: {e}")

    if total_weight > 0:
        final_score = round((weighted_sum / total_weight), 2)
        print(f"\U0001f522 Combined risk score calculated: {final_score}")
    else:
        final_score = 0.5
        print("⚠️ No models returned valid predictions. Defaulting to 0.5")

    return final_score
