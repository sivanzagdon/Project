import os
import joblib
import pandas as pd
from datetime import datetime
from sklearn.utils import shuffle
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV 
from app.db import get_collection
from dotenv import load_dotenv
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=UserWarning)
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/random_forest_duration_model.pkl" 
ENCODER_DIR = "app/services/encoders_duration"
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
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int) 
    df["IS_WEEKEND"] = df["Is weekend"]  

    features = [
        "MainCategory", "SubCategory", "Building", "Site",
        "Hour", "Weekday", "Month", "DayOfMonth", "IS_WEEKEND", "RequestLength"
    ]

    df = df.dropna(subset=features + ["DurationHours"])
    X = df[features].copy()
    y = df["DurationHours"]

    for col in ["MainCategory", "SubCategory", "Building", "Site"]:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        joblib.dump(le, ENCODER_PATHS[col])
        print(f"After Label Encoding for {col}:")
        print(X[col].head())

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

    print("Training Random Forest Regressor model with GridSearchCV...")
    # Define parameter grid for Random Forest
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 5, 10, 15],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'bootstrap': [True, False]
    }

    # Initialize Random Forest Regressor
    rf = RandomForestRegressor(random_state=42)

    # Initialize GridSearchCV
    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=2)

    # Fit the model
    grid_search.fit(X_train, y_train)

    # Get the best parameters and model
    best_rf_model = grid_search.best_estimator_
    print(f"Best parameters found: {grid_search.best_params_}")

    # Train the best model
    best_rf_model.fit(X_train, y_train)

    print("Model training complete.")
    joblib.dump(best_rf_model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
