from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

def get_collection(database_name: str, collection_name: str):
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        return db[collection_name]
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return None

def update_user_schema():
    """Update user collection schema to include new fields"""
    try:
        users_collection = get_collection("DS_PROJECT", "users")
        if users_collection is None:
            print("Could not connect to users collection")
            return False
        
        # Add new fields to existing users if they don't exist
        update_result = users_collection.update_many(
            {},  # Update all documents
            {
                "$setOnInsert": {
                    "company": "",
                    "department": "",
                    "position": "",
                    "level": "",
                    "employee_id": "",
                    "hire_date": None,
                    "dashboard_preferences": {
                        "defaultPage": "dashboard",
                        "autoRefreshInterval": 30,
                        "cardLayout": "grid",
                        "defaultFilter": "all"
                    },
                    "privacy_settings": {
                        "profileVisibility": "public",
                        "activityStatus": "visible"
                    }
                }
            },
            upsert=False
        )
        
        print(f"Schema update completed. Modified {update_result.modified_count} documents")
        return True
        
    except Exception as e:
        print(f"Error updating user schema: {e}")
        return False

def get_user_by_emp_id(emp_id):
    """Get user by employee ID"""
    try:
        users_collection = get_collection("DS_PROJECT", "users")
        if users_collection is None:
            return None
        
        return users_collection.find_one({"emp_id": emp_id})
        
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

def update_user_account_info(emp_id, account_data):
    """Update user account information"""
    try:
        users_collection = get_collection("DS_PROJECT", "users")
        if users_collection is None:
            return False
        
        update_result = users_collection.update_one(
            {"emp_id": emp_id},
            {
                "$set": {
                    "company": account_data.get("company", ""),
                    "department": account_data.get("department", ""),
                    "position": account_data.get("position", ""),
                    "level": account_data.get("level", ""),
                    "employee_id": account_data.get("employeeId", ""),
                    "hire_date": account_data.get("hireDate", None)
                }
            }
        )
        
        return update_result.modified_count > 0
        
    except Exception as e:
        print(f"Error updating account info: {e}")
        return False

def update_user_dashboard_preferences(emp_id, dashboard_data):
    """Update user dashboard preferences"""
    try:
        users_collection = get_collection("DS_PROJECT", "users")
        if users_collection is None:
            return False
        
        update_result = users_collection.update_one(
            {"emp_id": emp_id},
            {
                "$set": {
                    "dashboard_preferences": {
                        "defaultPage": dashboard_data.get("defaultPage", "dashboard"),
                        "autoRefreshInterval": dashboard_data.get("autoRefreshInterval", 30),
                        "cardLayout": dashboard_data.get("cardLayout", "grid"),
                        "defaultFilter": dashboard_data.get("defaultFilter", "all")
                    }
                }
            }
        )
        
        return update_result.modified_count > 0
        
    except Exception as e:
        print(f"Error updating dashboard preferences: {e}")
        return False

def update_user_privacy_settings(emp_id, privacy_data):
    """Update user privacy settings"""
    try:
        users_collection = get_collection("DS_PROJECT", "users")
        if users_collection is None:
            return False
        
        update_result = users_collection.update_one(
            {"emp_id": emp_id},
            {
                "$set": {
                    "privacy_settings": {
                        "profileVisibility": privacy_data.get("profileVisibility", "public"),
                        "activityStatus": privacy_data.get("activityStatus", "visible")
                    }
                }
            }
        )
        
        return update_result.modified_count > 0
        
    except Exception as e:
        print(f"Error updating privacy settings: {e}")
        return False
