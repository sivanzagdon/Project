import pandas as pd
import joblib
from sklearn.naive_bayes import GaussianNB
from sklearn.utils import shuffle
from dotenv import load_dotenv
import os
from datetime import datetime
from app.db import get_collection

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/overdue_naive_bayes_model.pkl"

def fetch_data_from_mongo():
    print("📡 Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("❌ Failed to connect to collection.")
        return pd.DataFrame()
    data = list(collection.find())
    print(f"✅ Retrieved {len(data)} records.")
    return pd.DataFrame(data)  # ✅ תיקון כאן

def preprocess(df):
    print("🧼 Preprocessing data...")
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday

    print("\n📊 Class distribution:")
    print(df["is_overdue"].value_counts())

    features = ["MainCategory", "SubCategory", "Building", "Site", "Hour", "Weekday"]
    before_drop = len(df)
    df = df.dropna(subset=features + ["is_overdue"])
    after_drop = len(df)
    print(f"📁 Dropped {before_drop - after_drop} rows. Remaining: {after_drop}")

    X = pd.get_dummies(df[features])
    y = df["is_overdue"]

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

    print("🌲 Training Naive Bayes model...")
    model = GaussianNB()
    model.fit(X, y)
    print("✅ Model training complete.")

    joblib.dump((model, X.columns), MODEL_PATH)
    print(f"💾 Model saved to: {MODEL_PATH}")

if __name__ == "__main__":  # ✅ תיקון כאן
    train_model()
