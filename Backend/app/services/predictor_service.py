# import joblib
# import pandas as pd
# from datetime import datetime
# from sklearn.preprocessing import LabelEncoder
# from app.db import get_collection


# RF_MODEL_PATH = "app/services/model/overdue_random_forest_model.pkl"
# XGB_MODEL_PATH = "app/services/model/overdue_xgboost_model.pkl"
# NB_MODEL_PATH = "app/services/model/overdue_naive_bayes_model.pkl"


# MODEL_WEIGHTS = {
#     "rf": 0.83,
#     "xgb": 0.60,
#     "nb": 0.50,
# }



# def preprocess_input(data: dict, expected_columns: list[str]) -> pd.DataFrame:
#     df = pd.DataFrame([data])
#     df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
#     df["Hour"] = df["Created on"].dt.hour
#     df["Weekday"] = df["Created on"].dt.weekday
#     df["Month"] = df["Created on"].dt.month
#     df["DayOfMonth"] = df["Created on"].dt.day
#     df["Is weekend"] = df["Weekday"].isin([5, 6]).astype(int)
#     df["RequestLength"] = df["Request description"].apply(lambda x: len(str(x)))

#     features = [
#         "MainCategory", "SubCategory", "Building", "Site",
#         "Hour", "Weekday", "Month", "DayOfMonth", "Is weekend", "RequestLength"
#     ]

#     df = df[features].copy()
#     for col in ["MainCategory", "SubCategory", "Building", "Site"]:
#         le = LabelEncoder()
#         df[col] = le.fit_transform(df[col].astype(str))

#     return df.reindex(columns=expected_columns, fill_value=0)


# def predict_combined_risk(new_data: dict) -> float:
#     votes = []

#     # Random Forest
#     try:
#         rf_model, rf_cols = joblib.load(RF_MODEL_PATH)
#         X_rf = preprocess_input(new_data, list(rf_cols))
#         pred_rf = rf_model.predict(X_rf)[0]
#         votes.append(pred_rf * MODEL_WEIGHTS["rf"])
#     except Exception as e:
#         print("RF model error:", e)

#     # XGBoost
#     try:
#         xgb_model, xgb_cols = joblib.load(XGB_MODEL_PATH)
#         X_xgb = preprocess_input(new_data, list(xgb_cols))
#         pred_xgb = xgb_model.predict(X_xgb)[0]
#         votes.append(pred_xgb * MODEL_WEIGHTS["xgb"])
#     except Exception as e:
#         print("XGB model error:", e)

#     # Naive Bayes
#     try:
#         nb_model, nb_cols = joblib.load(NB_MODEL_PATH)
#         X_nb = preprocess_input(new_data, list(nb_cols))
#         pred_nb = nb_model.predict(X_nb)[0]
#         votes.append(pred_nb * MODEL_WEIGHTS["nb"])
#     except Exception as e:
#         print("NB model error:", e)

#     # אם אף מודל לא הצליח להחזיר
#     if not votes:
#         return -1  # או אולי לזרוק שגיאה

    
#     combined_score = sum(votes) / sum([MODEL_WEIGHTS[k] for k in MODEL_WEIGHTS if votes])
#     return round(combined_score, 2)