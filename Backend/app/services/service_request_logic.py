from datetime import datetime
from app.db import get_collection
from app.services.prediction_service import predict_combined_risk
import json


def load_sla_data():
    try:
        print("Attempting to load SLA data from JSON file...")
        with open("data/sla_data.json", "r", encoding="utf-8") as file:
            data = json.load(file)
            print("SLA data loaded successfully.")
            return data
    except Exception as e:
        print(f"Error loading SLA data: {e}")
        return {}

# הפונקציה המחודשת
def calculate_sla(sub_category: str) -> int:
    print(f"Calculating SLA for sub-category: '{sub_category}'")
    
    sla_data = load_sla_data()
    
    if not sla_data:
        print("No SLA data available or failed to load data.")
        return -1
 

    if sub_category in sla_data:
        print(f"Found SLA for '{sub_category}': {sla_data[sub_category]} hours")
        return sla_data[sub_category]
    
    print(f"Sub-category '{sub_category}' not found in SLA data.")
    return -1  


def create_new_service_request(data: dict) -> dict:
    collection = get_collection("DS_PROJECT", "newRequests")

    sla_time = calculate_sla(data["SubCategory"])
    risk_score = predict_combined_risk(data)

    document = {
        "Type": "Service request",
        "Created on": datetime.now().strftime("%m/%d/%Y %I:%M:%S %p"),
        "Request status": "Open",
        "MainCategory": data["MainCategory"],
        "SubCategory": data["SubCategory"],
        "Building": data["Building"],
        "Site": data["Site"],
        "Request description": data["Description"],
        "SLA (hours)": sla_time,
        "Risk score": risk_score,
    }

    if "Resolved date" in data:
        document["Resolved date"] = data["Resolved date"]
    if "Response time (hours)" in data:
        document["Response time (hours)"] = data["Response time (hours)"]
    if "Response time (days)" in data:
        document["Response time (days)"] = data["Response time (days)"]
    if "is_overdue" in data:
        document["is_overdue"] = data["is_overdue"]

    insert_result = collection.insert_one(document)

    return {
        "message": "Service request created successfully",
        "sla_time": sla_time,
        "risk_score": risk_score,
        "recommendations": ["Assign additional technician", "Prioritize in queue"],
        "request_id": str(insert_result.inserted_id)
    }
