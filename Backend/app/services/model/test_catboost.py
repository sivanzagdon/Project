import os
import pandas as pd
import joblib
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.utils import shuffle
from app.db import get_collection
from datetime import datetime
from sklearn.feature_selection import SelectKBest, f_classif

load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
MODEL_PATH = "app/services/overdue_catboost_model.pkl"
ENCODER_DIR = "app/services/encoders"

CATEGORICAL_COLS = ["MainCategory", "SubCategory", "Building", "Site"]

def fetch_data_from_mongo():
    print("  Fetching data from MongoDB...")
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        print("  Failed to connect to MongoDB.")
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
    df["IsUrgent"] = df["Request description"].str.contains("(?i)דחוף|מיידי|אסון|תקלה|קריטי", na=False).astype(int)

    features = CATEGORICAL_COLS + [
        "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength", "IsUrgent"
    ]

    df = df.dropna(subset=features + ["is_overdue"])
    X = df[features].copy()
    y = df["is_overdue"]

    for col in CATEGORICAL_COLS:
        encoder_path = os.path.join(ENCODER_DIR, f"{col}_encoder.pkl")
        le = joblib.load(encoder_path)
        X[col] = le.transform(X[col].astype(str))

    selector = SelectKBest(score_func=f_classif, k='all')
    X_selected = selector.fit_transform(X, y)
    selected_columns = X.columns[selector.get_support()].tolist()
    X = pd.DataFrame(X_selected, columns=selected_columns)

    return X, y

def print_confusion_matrix(cm, labels):
    print(" Confusion Matrix:")
    print(f"{'':<12}{labels[0]:<8}{labels[1]:<8}")
    print(f"{labels[0]:<12}{cm[0][0]:<8}{cm[0][1]:<8}")
    print(f"{labels[1]:<12}{cm[1][0]:<8}{cm[1][1]:<8}")

def evaluate_model():
    df = fetch_data_from_mongo()
    if df.empty:
        print(" No data to evaluate.")
        return

    df = shuffle(df).reset_index(drop=True)
    X, y = preprocess(df)

    print(" Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    print(" Loading CatBoost model...")
    model, model_columns = joblib.load(MODEL_PATH)

    print("  Aligning columns...")
    X_test = X_test.reindex(columns=model_columns, fill_value=0)

    print("  Predicting...")
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f" Accuracy on test set: \033[1m{acc:.4f}\033[0m")

    cm = confusion_matrix(y_test, y_pred)
    print_confusion_matrix(cm, labels=["Not Overdue", "Overdue"])

    print(" Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Not Overdue", "Overdue"]))

if __name__ == "__main__":
    evaluate_model()
