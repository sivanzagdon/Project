import os
import joblib
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import lightgbm as lgb  

load_dotenv()

MODEL_PATH = "app/services/lightgbm_duration_model.pkl" 
ENCODER_DIR = "app/services/encoders_duration"

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

def preprocess_input(data: dict) -> pd.DataFrame:
    df = pd.DataFrame([data])

    # Converting date into correct format
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df["Hour"] = df["Created on"].dt.hour
    df["Weekday"] = df["Created on"].dt.weekday
    df["Month"] = df["Created on"].dt.month
    df["DayOfMonth"] = df["Created on"].dt.day
    df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
    df["RequestLength"] = df["Description"].apply(lambda x: len(str(x)))
    df['TimeOfDay'] = df['Hour'].apply(lambda x: 'Morning' if 6 <= x < 12 else ('Afternoon' if 12 <= x < 18 else 'Evening'))

    # Ordinal encoding for categorical columns
    for col in ["MainCategory", "SubCategory", "Building", "Site", "TimeOfDay"]:
        encoder = joblib.load(ENCODER_PATHS[col])
        df[col] = encoder.transform(df[col].astype(str))

    df["Hour_Weekday"] = df["Hour"] * df["Weekday"]

    df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)

    return df

def predict_response_time(new_request: dict) -> float:
    try:
        model = joblib.load(MODEL_PATH) 
        new_request["Created on"] = datetime.now().strftime("%m/%d/%Y %H:%M")
    except Exception as e:
        print(f"Failed to load model: {e}")
        return -1

    df = preprocess_input(new_request)
    
    predicted_duration = model.predict(df)[0] 
    return float(round(predicted_duration, 2))

if __name__ == "__main__":
    test_request = {
        "MainCategory": "B. Climate",
        "SubCategory": "AC Issue",
        "Building": "Building A",
        "Site": "Tel Aviv",
        "Description": "The AC is leaking heavily in room 302.",
        "Created on": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    predicted_hours = predict_response_time(test_request)
    print(f"Predicted response time: {predicted_hours} hours")

