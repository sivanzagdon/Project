import pandas as pd
import joblib
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.model_selection import train_test_split
from app.db import get_collection
from dotenv import load_dotenv
import os
from datetime import datetime
from sklearn.utils import shuffle

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/overdue_xgboost_model.pkl"

def fetch_data_from_mongo():
    print("📡 Fetching and preprocessing data...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("❌ Failed to connect to MongoDB")
        return pd.DataFrame()
    return pd.DataFrame(list(collection.find()))

def preprocess(df):
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday

    features = ["MainCategory", "SubCategory", "Building", "Site", "Hour", "Weekday"]
    df = df.dropna(subset=features + ["is_overdue"])

    print("📊 Class distribution:")
    print(df["is_overdue"].value_counts())

    X = pd.get_dummies(df[features].copy())
    y = df["is_overdue"]
    return X, y

def print_confusion_matrix(cm, labels):
    print("\n🧩 Confusion Matrix:")
    print(f"{'':<12}{labels[0]:<8}{labels[1]:<8}")
    print(f"{labels[0]:<12}{cm[0][0]:<8}{cm[0][1]:<8}")
    print(f"{labels[1]:<12}{cm[1][0]:<8}{cm[1][1]:<8}")

def evaluate_model():
    df = fetch_data_from_mongo()
    if df.empty:
        return

    df = shuffle(df).reset_index(drop=True)
    X, y = preprocess(df)

    print("🧪 Splitting into train/test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("📦 Loading model...")
    model, model_columns = joblib.load(MODEL_PATH)

    print("🔧 Aligning test data columns...")
    X_test_aligned = X_test.reindex(columns=model_columns, fill_value=0)

    print("🔮 Predicting...")
    y_pred = model.predict(X_test_aligned)

    acc = accuracy_score(y_test, y_pred)
    print(f"\n🎯 Accuracy on test set: \033[1m{acc:.4f}\033[0m")

    cm = confusion_matrix(y_test, y_pred)
    print_confusion_matrix(cm, labels=["Not Overdue", "Overdue"])

    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Not Overdue", "Overdue"]))

if __name__ == "__main__":
    evaluate_model()
