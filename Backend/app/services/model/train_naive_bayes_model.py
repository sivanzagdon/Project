import pandas as pd
import joblib
from sklearn.naive_bayes import GaussianNB
from sklearn.utils import shuffle
from sklearn.preprocessing import LabelEncoder
from dotenv import load_dotenv
import os
from datetime import datetime
from app.db import get_collection

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/overdue_naive_bayes_model.pkl"
ENCODER_DIR = "app/services/encoders"
os.makedirs(ENCODER_DIR, exist_ok=True)

def fetch_data_from_mongo():
    print("\U0001F4F1 Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("\u274c Failed to connect to collection.")
        return pd.DataFrame()
    data = list(collection.find())
    print(f"\u2705 Retrieved {len(data)} records.")
    return pd.DataFrame(data)

def preprocess(df):
    print("\U0001F9FC Preprocessing data...")
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday

    print("\n\U0001F4CA Class distribution:")
    print(df["is_overdue"].value_counts())

    features = ["MainCategory", "SubCategory", "Building", "Site", "Hour", "Weekday"]
    before_drop = len(df)
    df = df.dropna(subset=features + ["is_overdue"])
    after_drop = len(df)
    print(f"\U0001F4C1 Dropped {before_drop - after_drop} rows. Remaining: {after_drop}")

    X = df[features].copy()
    y = df["is_overdue"]

    # Label Encoding and save encoders
    for col in ["MainCategory", "SubCategory", "Building", "Site"]:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        joblib.dump(le, os.path.join(ENCODER_DIR, f"{col}_encoder.pkl"))

    print(f"\U0001F9EE Feature matrix shape: {X.shape}, Target shape: {y.shape}")
    return X, y

def train_model():
    print("\U0001F680 Starting training process...")
    df = fetch_data_from_mongo()
    if df.empty:
        print("\U0001F6D1 No data found. Aborting training.")
        return

    df = shuffle(df, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)

    print("\U0001F333 Training Naive Bayes model...")
    model = GaussianNB()
    model.fit(X, y)
    print("\u2705 Model training complete.")

    joblib.dump((model, X.columns), MODEL_PATH)
    print(f"\U0001F4BE Model saved to: {MODEL_PATH}")

if __name__ == "__main__":  
    train_model()