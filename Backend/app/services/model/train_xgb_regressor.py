import os
import joblib
import pandas as pd
from datetime import datetime
from sklearn.utils import shuffle
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
from app.db import get_collection
from dotenv import load_dotenv
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=UserWarning)
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/xgboost_duration_model.pkl"
ENCODER_DIR = "app/services/encoders_duration"
os.makedirs(ENCODER_DIR, exist_ok=True)

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

def fetch_data_from_mongo():
    print("📡 Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("❌ Failed to connect to collection.")
        return pd.DataFrame()
    data = list(collection.find())
    print(f"✅ Retrieved {len(data)} records.")
    return pd.DataFrame(data)

def preprocess(df):
    print("🧼 Preprocessing data...")

    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df = df.dropna(subset=["Created on"])

    # 🧽 Clean numeric string values like "1,344" → "1344"
    # df["Response time (hours)"] = df["Response time (hours)"].astype(str).str.replace(",", "")

    # 🕳️ כמה שורות חסרות את Response time (hours)
    missing_duration = df["Response time (hours)"].isnull().sum()
    print(f"🕳️ Missing 'Response time (hours)': {missing_duration} rows")

    # Use provided Response time (hours) directly
    df["DurationHours"] = pd.to_numeric(df["Response time (hours)"], errors="coerce")

    # 🔍 Show examples of problematic parsing
    invalid = df[pd.to_numeric(df["Response time (hours)"], errors="coerce").isnull()]
    print("🧪 Examples of problematic 'Response time (hours)' values:")
    print(invalid["Response time (hours)"].value_counts().head(10))

    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Request description"].apply(lambda x: len(str(x)))

    # 🔍 Check missing values before dropping
    print("\n🕵️ Missing values per column BEFORE dropping:")
    print(df[[
        "MainCategory", "SubCategory", "Building", "Site",
        "Hour", "Weekday", "Month", "DayOfMonth",
        "Is weekend", "RequestLength", "DurationHours"
    ]].isnull().sum())

    features = [
        "MainCategory", "SubCategory", "Building", "Site",
        "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength"
    ]

    df = df.dropna(subset=features + ["DurationHours"])
    X = df[features].copy()
    y = df["DurationHours"]

    for col in ["MainCategory", "SubCategory", "Building", "Site"]:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        joblib.dump(le, ENCODER_PATHS[col])
        print(f"🔠 After Label Encoding for {col}:")
        print(X[col].head())

    print(f"🧮 Feature matrix shape: {X.shape}, Target shape: {y.shape}")
    return X, y

def train_model():
    print("🚀 Starting training process...")
    df = fetch_data_from_mongo()
    if df.empty:
        print("🛑 No data found. Aborting training.")
        return

    df = shuffle(df, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)

    print("🌳 Training XGBoost Regressor model...")
    model = XGBRegressor(
        random_state=42,
        max_depth=6,
        learning_rate=0.05,
        n_estimators=300,
        subsample=0.9,
        colsample_bytree=0.9
    )
    model.fit(X, y)
    print("✅ Model training complete.")

    joblib.dump((model, X.columns), MODEL_PATH)
    print(f"💾 Model saved to: {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
