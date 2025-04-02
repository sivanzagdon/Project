import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split  # Import for splitting the data
from dotenv import load_dotenv
from app.db import get_collection
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=UserWarning)
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/xgboost_duration_model.pkl"
ENCODER_DIR = "app/services/encoders_duration"

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

def fetch_data():
    print("📰 Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    return pd.DataFrame(list(collection.find()))

def preprocess(df):
    print("🧼 Preprocessing test data...")
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df = df.dropna(subset=["Created on"])

    df["DurationHours"] = pd.to_numeric(df["Response time (hours)"], errors="coerce")

    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Request description"].apply(lambda x: len(str(x)))

    features = [
        "MainCategory", "SubCategory", "Building", "Site",
        "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength"
    ]

    df = df.dropna(subset=features + ["DurationHours"])
    X = df[features].copy()
    y = df["DurationHours"]

    for col in ["MainCategory", "SubCategory", "Building", "Site"]:
        le = joblib.load(ENCODER_PATHS[col])
        X[col] = le.transform(X[col].astype(str))

    return X, y

def evaluate_model():
    print("\U0001F50D Evaluating XGBoost Duration Regressor...")
    df = fetch_data()
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)

    # Split the data into 80% training and 20% test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("⚙️ Making predictions...")
    model, _ = joblib.load(MODEL_PATH)
    y_pred = model.predict(X_test)

    print("\n\U0001F4CA Evaluation Metrics:")
    print(f"\U0001F522 Mean Absolute Error (MAE): {mean_absolute_error(y_test, y_pred):.2f} hours")
    print(f"\U0001F4C9 Root Mean Squared Error (RMSE): {np.sqrt(mean_squared_error(y_test, y_pred)):.2f} hours")
    print(f"\U0001F4C8 R² Score: {r2_score(y_test, y_pred):.4f}")

if __name__ == "__main__":
    evaluate_model()
