import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.utils import shuffle
from app.db import get_collection
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/ml_models/overdue/overdue_random_forest_model.pkl"
ENCODER_DIR = "app/ml_models/encoders"

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

CATEGORICAL_COLS = ["MainCategory", "SubCategory", "Building", "Site"]

def fetch_data():
    collection = get_collection(DATABASE_NAME, "service_requests")
    data = list(collection.find())
    return pd.DataFrame(data)

def preprocess_for_prediction(df):
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday

    for col in CATEGORICAL_COLS:
        df[col] = df[col].fillna("Unknown")

    df = df.dropna(subset=["Created on", "is_overdue"])

    for col in CATEGORICAL_COLS:
        le = joblib.load(ENCODER_PATHS[col])
        df[col] = le.transform(df[col].astype(str))

    features = ["MainCategory", "SubCategory", "Building", "Site", "Hour", "Weekday"]
    X = df[features]
    y = df["is_overdue"]

    return X, y

def align_columns(X, model_columns):
    return X.reindex(columns=model_columns, fill_value=0)

def test_model():
    print("Loading model...")
    model, model_columns = joblib.load(MODEL_PATH)

    print("Fetching and preprocessing data...")
    df = fetch_data()
    df = shuffle(df).reset_index(drop=True)
    test_size = int(0.2 * len(df))
    test_df = df.iloc[:test_size].copy()

    X_test, y_test = preprocess_for_prediction(test_df)
    X_test = align_columns(X_test, model_columns)

    print("Predicting...")
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f"\n Accuracy on test set: {acc:.4f}")

    print("\n Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    print("\n Classification Report:")
    print(classification_report(y_test, y_pred))

if __name__ == "__main__":
    test_model()