import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split, KFold
from dotenv import load_dotenv
from app.db import get_collection
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=UserWarning)
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/lightgbm_duration_model.pkl"
ENCODER_DIR = "app/services/encoders_duration"

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

def fetch_data():
    print("📡 Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    return pd.DataFrame(list(collection.find()))

def target_encode(X, y, columns):
    """Apply target encoding to categorical columns."""
    for col in columns:
        # חישוב ממוצע של היעד (DurationHours) עבור כל קטגוריה
        mean_encoded = X.groupby(col).apply(lambda x: y.loc[x.index].mean())
        # החלפת הערכים בקטגוריות עם הממוצע שנמצא
        X[col] = X[col].map(mean_encoded)
    return X

def preprocess(df):
    print("🧼 Preprocessing data...")

    # המרת התאריך בפורמט מתאים
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df = df.dropna(subset=["Created on"])

    # חישוב זמן טיפול (DurationHours)
    df["DurationHours"] = pd.to_numeric(df["Response time (hours)"], errors="coerce")

    # יצירת תכונות זמן נוספות
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday  # ימי השבוע (0=ראשון, 1=שני, וכו')
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["RequestLength"] = df["Request description"].apply(lambda x: len(str(x)))

    # יצירת תכונה של זמן ביום: בוקר, צהריים, ערב
    df['TimeOfDay'] = df['Hour'].apply(lambda x: 'Morning' if 6 <= x < 12 else ('Afternoon' if 12 <= x < 18 else 'Evening'))

    # הוספת שדה IS_WEEKEND - האם היום הוא בסוף שבוע (שבת או יום ראשון)
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)  # 5=שבת, 6=ראשון
    df["IS_WEEKEND"] = df["Is weekend"]  # תוודא שהשדה יקרא IS_WEEKEND

    # יצירת תכונות אינטראקציה (כמו שעה ויום בשבוע)
    df["Hour_Weekday"] = df["Hour"] * df["Weekday"]

    # יצירת תכונות חדשות עבור ה-preprocessing
    features = [
        "MainCategory", "SubCategory", "Building", "Site",
        "Hour", "Weekday", "Month", "DayOfMonth", "IS_WEEKEND", "RequestLength", "TimeOfDay", "Hour_Weekday"
    ]

    df = df.dropna(subset=features + ["DurationHours"])
    X = df[features].copy()
    y = df["DurationHours"]

    # Target Encoding עבור משתנים קטגוריאליים
    X = target_encode(X, y, columns=["MainCategory", "SubCategory", "Building", "Site", "TimeOfDay"])

    print(f"🧮 Feature matrix shape: {X.shape}, Target shape: {y.shape}")
    return X, y

def evaluate_model():
    print("\U0001F50D Evaluating LightGBM Duration Regressor with Cross-Validation...")
    df = fetch_data()
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)

    # Perform KFold cross-validation
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    mae_scores = []
    rmse_scores = []
    r2_scores = []

    # Perform cross-validation
    for train_index, test_index in kf.split(X):
        X_train, X_test = X.iloc[train_index], X.iloc[test_index]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]

        print("⚙️ Making predictions...")
        model = joblib.load(MODEL_PATH)
        y_pred = model.predict(X_test)

        # Calculate evaluation metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        mae_scores.append(mae)
        rmse_scores.append(rmse)
        r2_scores.append(r2)

    # Output average metrics across all folds
    print("Evaluation Metrics (Cross-Validation):")
    print(f"Mean MAE: {np.mean(mae_scores):.2f} hours")
    print(f"Mean RMSE: {np.mean(rmse_scores):.2f} hours")
    print(f"Mean R² Score: {np.mean(r2_scores):.4f}")

if __name__ == "__main__":
    evaluate_model()
