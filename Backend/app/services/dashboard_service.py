from flask import Blueprint, jsonify
from app.db import get_collection
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
dashboard_bp = Blueprint("dashboard", __name__)
DATABASE_NAME = os.getenv("DATABASE_NAME")    

###########################################################################################
def get_dashboard_data_by_years():
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        return jsonify({"error": "DB connection failed"}), 500

    data = list(collection.find({}))
    df = pd.DataFrame(data)

    # Ensure datetime format
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df = df.dropna(subset=["Created on"])

    df["Year"] = df["Created on"].dt.year
    df["Weekday"] = df["Created on"].dt.day_name()

    result = {}

    for site in ['A', 'B', 'C']:
        site_data = df[df['Site'] == site]
        site_result = {}

        for year in site_data["Year"].unique():
            year_data = site_data[site_data["Year"] == year]
            year_result = {}

            # MainCategory breakdown
            main_counts = year_data["MainCategory"].value_counts().to_dict()
            year_result["main_category"] = [{"category": k, "count": int(v)} for k, v in main_counts.items()]

            # SubCategory breakdown
            sub_counts = year_data["SubCategory"].value_counts().to_dict()
            year_result["sub_category"] = [{"subcategory": k, "count": int(v)} for k, v in sub_counts.items()]

            # Weekday breakdown
            weekday_counts = (
                year_data["Weekday"]
                .value_counts()
                .reindex(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], fill_value=0)
                .to_dict()
            )
            year_result["by_weekday"] = [{"weekday": k, "count": int(v)} for k, v in weekday_counts.items()]

            # Assign year result to site_result
            site_result[str(year)] = year_result

        # Assign site result to final result
        result[site] = site_result

    return jsonify(result)



####################################################################################################
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

##################################################################################################3
def get_dashboard_data_by_years_and_months():
    collection = get_collection(DATABASE_NAME, "service_requests")
    if collection is None:
        return jsonify({"error": "DB connection failed"}), 500

    data = list(collection.find({}))
    df = pd.DataFrame(data)

    # Ensure datetime format
    df["Created on"] = pd.to_datetime(df["Created on"], errors="coerce")
    df = df.dropna(subset=["Created on"])

    # Extract components
    df["Year"] = df["Created on"].dt.year
    df["Month"] = df["Created on"].dt.month_name()
    df["Weekday"] = df["Created on"].dt.day_name()

    result = {}

    for site in ['A', 'B', 'C']:
        site_data = df[df["Site"] == site]
        site_result = {}

        for year in site_data["Year"].unique():
            year_data = site_data[site_data["Year"] == year]
            year_result = {
                "yearly": {},
                "monthly": {}
            }

            # Yearly Aggregation
            yearly_main = year_data["MainCategory"].value_counts().to_dict()
            year_result["yearly"]["main_category"] = [
                {"category": k, "count": int(v)} for k, v in yearly_main.items()
            ]

            yearly_sub = year_data["SubCategory"].value_counts().to_dict()
            year_result["yearly"]["sub_category"] = [
                {"subcategory": k, "count": int(v)} for k, v in yearly_sub.items()
            ]

            yearly_weekdays = (
                year_data["Weekday"]
                .value_counts()
                .reindex(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], fill_value=0)
                .to_dict()
            )
            year_result["yearly"]["by_weekday"] = [
                {"weekday": k, "count": int(v)} for k, v in yearly_weekdays.items()
            ]

            # Monthly Aggregation
            for month in year_data["Month"].unique():
                month_data = year_data[year_data["Month"] == month]
                month_result = {}

                month_main = month_data["MainCategory"].value_counts().to_dict()
                month_result["main_category"] = [
                    {"category": k, "count": int(v)} for k, v in month_main.items()
                ]

                month_sub = month_data["SubCategory"].value_counts().to_dict()
                month_result["sub_category"] = [
                    {"subcategory": k, "count": int(v)} for k, v in month_sub.items()
                ]

                month_weekdays = (
                    month_data["Weekday"]
                    .value_counts()
                    .reindex(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], fill_value=0)
                    .to_dict()
                )
                month_result["by_weekday"] = [
                    {"weekday": k, "count": int(v)} for k, v in month_weekdays.items()
                ]

                year_result["monthly"][month] = month_result

            site_result[str(year)] = year_result
        result[site] = site_result

    return jsonify(result)



