from flask import Blueprint, jsonify
from app.db import get_collection
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
dashboard_bp = Blueprint("dashboard", __name__)
DATABASE_NAME = os.getenv("DATABASE_NAME")

@dashboard_bp.route("/api/dashboard", methods=["GET"])
def get_dashboard_data():
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        return jsonify({"error": "DB connection failed"}), 500

    data = list(collection.find({}))
    df = pd.DataFrame(data)

    result = {}

    # MainCategory
    main_counts = df["MainCategory"].value_counts().to_dict()
    result["main_category"] = [{"category": k, "count": int(v)} for k, v in main_counts.items()]

    # SubCategory
    sub_counts = df["SubCategory"].value_counts().to_dict()
    result["sub_category"] = [{"subcategory": k, "count": int(v)} for k, v in sub_counts.items()]

    # Weekday
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df = df.dropna(subset=["Created on"])
    df["Weekday"] = df["Created on"].dt.day_name()
    weekday_counts = df["Weekday"].value_counts().reindex(
        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        fill_value=0
    ).to_dict()
    result["by_weekday"] = [{"weekday": k, "count": int(v)} for k, v in weekday_counts.items()]

    return jsonify(result)


