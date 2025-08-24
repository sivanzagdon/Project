import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split, RandomizedSearchCV, KFold
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import lightgbm as lgb  
from app.db import get_collection
from dotenv import load_dotenv
from sklearn.utils import shuffle

import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=UserWarning)
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/ml_models/duration/lightgbm_duration_model.pkl"
ENCODER_DIR = "app/ml_models/encoders_duration"
os.makedirs(ENCODER_DIR, exist_ok=True)

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

def fetch_data_from_mongo():
    print("Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("Failed to connect to collection.")
        return pd.DataFrame()
    data = list(collection.find())
    print(f"Retrieved {len(data)} records.")
    return pd.DataFrame(data)

def target_encode(X, y, columns):
    """Apply target encoding to categorical columns."""
    for col in columns:
        mean_encoded = X.groupby(col).apply(lambda x: y.loc[x.index].mean())
        X[col] = X[col].map(mean_encoded)
    return X

def preprocess(df):
    print("Preprocessing data...")

    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df = df.dropna(subset=["Created on"])
    df["DurationHours"] = pd.to_numeric(df["Response time (hours)"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday  
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["RequestLength"] = df["Request description"].apply(lambda x: len(str(x)))
    df['TimeOfDay'] = df['Hour'].apply(lambda x: 'Morning' if 6 <= x < 12 else ('Afternoon' if 12 <= x < 18 else 'Evening'))
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int) 
    df["IS_WEEKEND"] = df["Is weekend"]  
    df["Hour_Weekday"] = df["Hour"] * df["Weekday"]

    features = [
        "MainCategory", "SubCategory", "Building", "Site",
        "Hour", "Weekday", "Month", "DayOfMonth", "IS_WEEKEND", "RequestLength", "TimeOfDay", "Hour_Weekday"
    ]

    df = df.dropna(subset=features + ["DurationHours"])
    X = df[features].copy()
    y = df["DurationHours"]

    X = target_encode(X, y, columns=["MainCategory", "SubCategory", "Building", "Site", "TimeOfDay"])

    print(f"Feature matrix shape: {X.shape}, Target shape: {y.shape}")
    return X, y

def train_model():
    print("Starting training process...")
    df = fetch_data_from_mongo()
    if df.empty:
        print("No data found. Aborting training.")
        return

    df = shuffle(df, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)

    # Split the data into 80% training and 20% test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training LightGBM Regressor model with RandomizedSearchCV and Cross-Validation...")

    # Define parameter grid for LightGBM
    param_dist = {
        'num_leaves': np.arange(20, 150, 10),
        'max_depth': [-1, 5, 10, 20],
        'learning_rate': [0.01, 0.05, 0.1],
        'n_estimators': [100, 200, 300, 500],
        'subsample': [0.7, 0.8, 0.9],
        'min_child_samples': [10, 20, 50],
        'lambda_l1': [0, 0.1, 0.5, 1],
        'lambda_l2': [0, 0.1, 0.5, 1]
    }

    lgbm = lgb.LGBMRegressor(random_state=42)

    random_search = RandomizedSearchCV(lgbm, param_dist, n_iter=10, cv=KFold(n_splits=5, shuffle=True, random_state=42),n_jobs=-1, verbose=2, random_state=42)

    random_search.fit(X_train, y_train)

    best_lgbm_model = random_search.best_estimator_
    print(f"Best parameters found: {random_search.best_params_}")

    best_lgbm_model.fit(X_train, y_train)

    print("Model training complete.")
    joblib.dump(best_lgbm_model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
   
