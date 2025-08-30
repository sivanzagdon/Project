import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.utils import shuffle
from sklearn.preprocessing import LabelEncoder
from dotenv import load_dotenv
from datetime import datetime
from app.db import get_collection
from sklearn.model_selection import GridSearchCV  

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/ml_models/overdue/overdue_random_forest_model.pkl"
ENCODER_DIR = "app/ml_models/encoders"
os.makedirs(ENCODER_DIR, exist_ok=True)

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

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
    print(f"\U0001F4C1 Dropped {before_drop - after_drop} rows with missing values. Remaining: {after_drop}")

    X = df[features].copy()
    y = df["is_overdue"]

    for col in ["MainCategory", "SubCategory", "Building", "Site"]:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        joblib.dump(le, ENCODER_PATHS[col])
        print(f"After Label Encoding for {col}:")
        print(X[col].head())

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

    print("\U0001F333 Starting GridSearchCV...")

    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'class_weight': ['balanced', None],
        'max_features': ['auto', 'sqrt', 'log2']  # New parameter added
    }

    # Create the RandomForest model with class_weight='balanced'
    model = RandomForestClassifier(
        random_state=42,
        class_weight='balanced'  # Set class_weight as 'balanced' directly
    )

    grid_search = GridSearchCV(estimator=model,
                               param_grid=param_grid,
                               cv=5,
                               n_jobs=-1,
                               verbose=2)

    grid_search.fit(X, y)

    best_model = grid_search.best_estimator_
    joblib.dump((best_model, X.columns), MODEL_PATH)
    print(f"\U0001F4BE Best model saved to: {MODEL_PATH}")
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best score: {grid_search.best_score_}")

if __name__ == "__main__":
    train_model()
