import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
import lightgbm as lgb
import xgboost as xgb
from app.db import get_collection
from sklearn.model_selection import train_test_split, RandomizedSearchCV, KFold
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import StackingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.utils import shuffle

# הגדרת נתיב למודלים
load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH_LGBM = "app/services/lightgbm_duration_model.pkl"
MODEL_PATH_XGB = "app/services/xgb_duration_model.pkl"
MODEL_PATH_STACKING = "app/services/stacking_duration_model.pkl"

# הגדרת מסלול לקידוד
ENCODER_DIR = "app/services/encoders_duration"
os.makedirs(ENCODER_DIR, exist_ok=True)

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl"),
    "TimeOfDay": os.path.join(ENCODER_DIR, "TimeOfDay_encoder.pkl")
}

FEATURE_COLUMNS = [
    "MainCategory", "SubCategory", "Building", "Site",
    "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength", "TimeOfDay", "Hour_Weekday"
]

def fetch_data_from_mongo():
    print("📡 Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("❌ Failed to connect to collection.")
        return pd.DataFrame()
    data = list(collection.find())
    print(f"✅ Retrieved {len(data)} records.")
    return pd.DataFrame(data)

def target_encode(X, y, columns):
    """Apply target encoding to categorical columns."""
    for col in columns:
        mean_encoded = X.groupby(col).apply(lambda x: y.loc[x.index].mean())
        X[col] = X[col].map(mean_encoded)
    return X

def preprocess(df):
    print("🧼 Preprocessing data...")

    # המרת התאריך בפורמט מתאים
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Resolved date"] = pd.to_datetime(df["Resolved date"], errors="coerce")
    
    # ייחוס זמן התגובה (Response time)
    df["Response time (hours)"] = pd.to_numeric(df["Response time (hours)"], errors="coerce")
    
    # חישוב תכונות זמן נוספות
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Request description"].apply(lambda x: len(str(x)))

    # יצירת TimeOfDay
    df['TimeOfDay'] = df['Hour'].apply(lambda x: 'Morning' if 6 <= x < 12 else ('Afternoon' if 12 <= x < 18 else 'Evening'))

    # מילוי ערכים חסרים לפני קידוד
    df["MainCategory"].fillna(df["MainCategory"].mode()[0], inplace=True)
    df["SubCategory"].fillna(df["SubCategory"].mode()[0], inplace=True)
    df["Building"].fillna(df["Building"].mode()[0], inplace=True)
    df["Site"].fillna(df["Site"].mode()[0], inplace=True)
    df["TimeOfDay"].fillna(df["TimeOfDay"].mode()[0], inplace=True)  # מילוי בערך הנפוץ ביותר

    # קידוד קטגוריות
    for col in ["MainCategory", "SubCategory", "Building", "Site", "TimeOfDay"]:
        encoder = joblib.load(ENCODER_PATHS[col])
        df[col] = encoder.transform(df[col].astype(str))

    # יצירת תכונות אינטראקציה (כמו Hour_Weekday)
    df["Hour_Weekday"] = df["Hour"] * df["Weekday"]
    df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)

    # הפחתת שורות עם ערכים חסרים
    df = df.dropna(subset=FEATURE_COLUMNS + ["Response time (hours)"], how='any')
    
    X = df[FEATURE_COLUMNS].copy()
    y = df["Response time (hours)"]

    return X, y

def train_stacking_model():
    print("🚀 Starting training process...")

    # Fetch data
    df = fetch_data_from_mongo()
    if df.empty:
        print("🛑 No data found. Aborting training.")
        return

    # Shuffle data
    df = shuffle(df, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)

    # Split the data into 80% training and 20% test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Load models
    lgbm_model = joblib.load(MODEL_PATH_LGBM)
    xgb_model = joblib.load(MODEL_PATH_XGB)

    # Define Stacking model
    stacking_model = StackingRegressor(
        estimators=[('lightgbm', lgbm_model), ('xgboost', xgb_model)],
        final_estimator=LinearRegression()
    )

    # Fit Stacking model
    stacking_model.fit(X_train, y_train)

    # Predict and evaluate
    predictions = stacking_model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions, squared=False)
    print(f"Stacking MAE: {mae:.2f}, RMSE: {rmse:.2f}")

    # Save Stacking model
    joblib.dump(stacking_model, MODEL_PATH_STACKING)
    print("✅ Stacking model saved!")

if __name__ == "__main__":
    train_stacking_model()
