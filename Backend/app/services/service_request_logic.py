from datetime import datetime
from flask import jsonify
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



from app.db import get_collection
from datetime import datetime
from flask import jsonify


def get_open_requests():
    try:
        print("Fetching open requests from the database...")  

        collection = get_collection("DS_PROJECT", "newRequests")
        
        if collection is None:
            print("Failed to connect to the database collection.")
            return jsonify({"error": "Failed to connect to the database collection."}), 500
        
        open_requests = collection.find({"Request status": "Open"})
        
        open_requests_list = []

        for request in open_requests:

            request_data = {
                "id": str(request.get("_id", "")),  
                "Created on": request.get("Created on", ""),
                "Request status": request.get("Request status", ""),
                "MainCategory": request.get("MainCategory", ""),
                "SubCategory": request.get("SubCategory", ""),
                "Building": request.get("Building", ""),
                "Site": request.get("Site", ""),
                "Request description": request.get("Request description", ""),
            }

            open_requests_list.append(request_data)

        if not open_requests_list:
            print("No open requests found.")
        else:
            print(f"Found {len(open_requests_list)} open requests.")  

        print(f"Returning {len(open_requests_list)} open requests.")  

        return (open_requests_list)
    except Exception as e:
        print(f"Error while fetching open requests: {e}")
        return jsonify({"error": str(e)}), 500














