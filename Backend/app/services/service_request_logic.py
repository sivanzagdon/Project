from datetime import datetime
from app.db import get_collection 

def calculate_sla(main_category: str, sub_category: str) -> int:
    
    if main_category == "Electricity":
        return 4
    elif main_category == "Plumbing":
        return 6
    else:
        return 8

def predict_risk(data: dict) -> float:
    # To change
    return 0.85

def create_new_service_request(data: dict) -> dict:
    collection = get_collection("DS_PROJECT", "newRequests")

    sla_time = calculate_sla(data["mainCategory"], data["subCategory"])
    risk_score = predict_risk(data)

    document = {
        "Type": "Service request",
        "Created on": datetime.now().strftime("%m/%d/%Y %I:%M:%S %p"),
        "Request status": "Open",
        "MainCategory": data["mainCategory"],
        "SubCategory": data["subCategory"],
        "Building": data["building"],
        "Site": data["site"],
        "Request description": data["description"],
        "SLA (hours)": sla_time,
        "Risk score": risk_score,
    }

    # שדות שניתן להוסיף בעתיד (למשל בהשלמה ידנית או ב-Cron Job)
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

