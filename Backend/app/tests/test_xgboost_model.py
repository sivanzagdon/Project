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
MODEL_PATH = "app/ml_models/overdue/overdue_xgboost_model.pkl"
ENCODER_DIR = "app/ml_models/encoders"

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

CATEGORICAL_COLS = ["MainCategory", "SubCategory", "Building", "Site"]

# Fetches service request data from MongoDB collection for XGBoost model evaluation
def fetch_data_from_mongo():
    print("Fetching and preprocessing data...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("Failed to connect to MongoDB")
        return pd.DataFrame()
    return pd.DataFrame(list(collection.find()))

# Preprocesses data by creating time-based features and applying label encoding for model evaluation
def preprocess(df):
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Request description"].apply(lambda x: len(str(x)))

    for col in CATEGORICAL_COLS:
        df[col] = df[col].fillna("Unknown")

    df = df.dropna(subset=["Created on", "is_overdue"])

    for col in CATEGORICAL_COLS:
        le = joblib.load(ENCODER_PATHS[col])
        df[col] = le.transform(df[col].astype(str))

    features = [
        "MainCategory", "SubCategory", "Building", "Site",
        "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength"
    ]
    X = df[features]
    y = df["is_overdue"]

    return X, y

# Aligns test data columns with model training columns for consistent prediction
def align_columns(X, model_columns):
    return X.reindex(columns=model_columns, fill_value=0)

# Evaluates XGBoost model performance on test data with accuracy, confusion matrix and classification report
def evaluate_model():
    df = fetch_data_from_mongo()
    if df.empty:
        return

    df = shuffle(df).reset_index(drop=True)
    X, y = preprocess(df)

    print("Splitting into train/test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Loading model...")
    model, model_columns = joblib.load(MODEL_PATH)

    print("Aligning test data columns...")
    X_test_aligned = X_test.reindex(columns=model_columns, fill_value=0)

    print("Predicting...")
    y_pred = model.predict(X_test_aligned)

    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy on test set: \033[1m{acc:.4f}\033[0m")

    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(f"{'':<12}{'Not Overdue':<8}{'Overdue':<8}")
    print(f"{'Not Overdue':<12}{cm[0][0]:<8}{cm[0][1]:<8}")
    print(f"{'Overdue':<12}{cm[1][0]:<8}{cm[1][1]:<8}")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Not Overdue", "Overdue"]))

if __name__ == "__main__":
    evaluate_model()
