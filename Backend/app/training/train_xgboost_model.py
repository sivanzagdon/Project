import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.utils import shuffle
from app.db import get_collection
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/ml_models/overdue/overdue_xgboost_model.pkl"
ENCODER_DIR = "app/ml_models/encoders"
os.makedirs(ENCODER_DIR, exist_ok=True)

ENCODER_PATHS = {
    "MainCategory": os.path.join(ENCODER_DIR, "MainCategory_encoder.pkl"),
    "SubCategory": os.path.join(ENCODER_DIR, "SubCategory_encoder.pkl"),
    "Building": os.path.join(ENCODER_DIR, "Building_encoder.pkl"),
    "Site": os.path.join(ENCODER_DIR, "Site_encoder.pkl")
}

def fetch_data_from_mongo():
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("Failed to connect to MongoDB.")
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
        joblib.dump(le, ENCODER_PATHS[col])

    return X, y

def print_confusion_matrix(cm, labels):
    print("\nConfusion Matrix:")
    print(f"{'':<12}{labels[0]:<12}{labels[1]:<12}")
    print(f"{labels[0]:<12}{cm[0][0]:<12}{cm[0][1]:<12}")
    print(f"{labels[1]:<12}{cm[1][0]:<12}{cm[1][1]:<12}")

def train_xgboost_model():
    print("Training XGBoost model...\n")
    df = fetch_data_from_mongo()
    if df.empty:
        print("No data found.")
        return

    df = shuffle(df, random_state=42).reset_index(drop=True)
    X, y = preprocess(df)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

    # Define parameter grid for GridSearchCV
    param_grid = {
        'max_depth': [3, 6, 10],
        'learning_rate': [0.01, 0.05, 0.1],
        'n_estimators': [100, 200, 300],
        'subsample': [0.8, 0.9, 1.0],
        'colsample_bytree': [0.8, 0.9, 1.0],
        'scale_pos_weight': [pos_weight],
        'gamma': [0, 1, 5],
        'reg_lambda': [1, 2, 3]
    }

    # Initialize the XGBoost model
    model = XGBClassifier(
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )

    # Perform GridSearchCV
    grid_search = GridSearchCV(
        estimator=model,
        param_grid=param_grid,
        scoring='accuracy',
        cv=5,
        n_jobs=-1,
        verbose=2
    )

    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    best_params = grid_search.best_params_
    best_score = grid_search.best_score_

    print(f"\nBest parameters found: {best_params}")
    print(f"Best score: {best_score:.4f}")

    # Evaluate the best model on the test set
    y_pred = best_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: \033[1m{acc:.4f}\033[0m")

    cm = confusion_matrix(y_test, y_pred)
    print_confusion_matrix(cm, labels=["Not Overdue", "Overdue"])

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Not Overdue", "Overdue"]))

    # Save the best model
    joblib.dump((best_model, X.columns), MODEL_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")

if __name__ == "__main__":
    train_xgboost_model()