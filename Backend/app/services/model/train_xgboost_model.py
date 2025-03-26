import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.utils import shuffle
from app.db import get_collection
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/overdue_xgboost_model.pkl"

def fetch_data_from_mongo():
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("❌ Failed to connect to MongoDB.")
        return pd.DataFrame()
    return pd.DataFrame(list(collection.find()))

def preprocess(df):
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
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

    df = df.dropna(subset=features + ["is_overdue"])

    X = df[features].copy()
    y = df["is_overdue"]

    for col in ["MainCategory", "SubCategory", "Building", "Site"]:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))

    return X, y

def print_confusion_matrix(cm, labels):
    print("\n🧩 Confusion Matrix:")
    print(f"{'':<12}{labels[0]:<12}{labels[1]:<12}")
    print(f"{labels[0]:<12}{cm[0][0]:<12}{cm[0][1]:<12}")
    print(f"{labels[1]:<12}{cm[1][0]:<12}{cm[1][1]:<12}")

def train_xgboost_model():
    print("🚀 Training XGBoost model...\n")
    df = fetch_data_from_mongo()
    if df.empty:
        print("🛑 No data found.")
        return

    df = shuffle(df, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    # Calculate scale_pos_weight if class imbalance exists
    pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

    model = XGBClassifier(
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss',
        max_depth=6,
        learning_rate=0.05,
        n_estimators=300,
        subsample=0.9,
        colsample_bytree=0.9,
        scale_pos_weight=pos_weight,
        gamma=1,
        reg_lambda=2
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f"\n🎯 Accuracy: \033[1m{acc:.4f}\033[0m")

    cm = confusion_matrix(y_test, y_pred)
    print_confusion_matrix(cm, labels=["Not Overdue", "Overdue"])

    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Not Overdue", "Overdue"]))

    joblib.dump((model, X.columns), MODEL_PATH)
    print(f"\n💾 Model saved to: {MODEL_PATH}")

if __name__ == "__main__":
    train_xgboost_model()