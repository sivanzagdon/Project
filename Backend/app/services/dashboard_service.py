from flask import Blueprint, jsonify
from app.db import get_collection
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
dashboard_bp = Blueprint("dashboard", __name__)
DATABASE_NAME = os.getenv("DATABASE_NAME")    

def get_dashboard_data():
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        return jsonify({"error": "DB connection failed"}), 500

    data = list(collection.find({}))
    df = pd.DataFrame(data)

    result = {}

    # Filter data by Site (A, B, C)
    for site in ['A', 'B', 'C']:
        site_data = df[df['Site'] == site]
        site_result = {}

        # MainCategory
        main_counts = site_data["MainCategory"].value_counts().to_dict()
        site_result["main_category"] = [{"category": k, "count": int(v)} for k, v in main_counts.items()]

        # SubCategory
        sub_counts = site_data["SubCategory"].value_counts().to_dict()
        site_result["sub_category"] = [{"subcategory": k, "count": int(v)} for k, v in sub_counts.items()]

        # Weekday
        site_data["Created on"] = pd.to_datetime(site_data["Created on"], errors="coerce")
        site_data = site_data.dropna(subset=["Created on"])
        site_data["Weekday"] = site_data["Created on"].dt.day_name()
        weekday_counts = site_data["Weekday"].value_counts().reindex(
            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            fill_value=0
        ).to_dict()
        site_result["by_weekday"] = [{"weekday": k, "count": int(v)} for k, v in weekday_counts.items()]

        
        result[site] = site_result

    return jsonify(result)



def get_time_data():
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        return jsonify({"error": "DB connection failed"}), 500

    data = list(collection.find({}))  
    results = {'A': [], 'B': [], 'C': []}

    for item in data:
        site = item.get('Site') 
        created_on = item.get('Created on')
        resolved_date = item.get('Resolved date')
        updated_date = item.get('Update date')

        closed_at = resolved_date if resolved_date else updated_date

        if site and created_on and closed_at:
            if site in results:
                results[site].append({
                    'created_on': created_on,
                    'closed_at': closed_at
                })

    if not any(results.values()):
        return jsonify({"message": "No requests found with valid dates"}), 404
    
    return jsonify(results)
