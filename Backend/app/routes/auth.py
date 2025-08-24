import datetime
import os
from flask import Blueprint, jsonify, request
import jwt
from dotenv import load_dotenv
from app.db import get_collection, update_user_account_info, update_user_dashboard_preferences, update_user_privacy_settings

load_dotenv()

auth_bp = Blueprint('auth', __name__)
secret_key = os.getenv("SECRET_KEY")

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    Emp_id = data.get('EmpID') or data.get('emp_id')
    Password = data.get('Password') or data.get('password')
    collection = get_collection("DS_PROJECT", "users")

    print(data)
    if collection is not None:
        user = collection.find_one({"emp_id": Emp_id, "password": Password})
        if user:
            token = jwt.encode({
                'empID': Emp_id,
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
            }, secret_key, algorithm='HS256')
            user_name = user["emp_name"]
            return jsonify({"user_name": user_name, "token": token}), 200
        else:
            return jsonify({"error": "Invalid EmpID or Password"}), 401
    else:
        return jsonify({"error": "Database connection failed"}), 500

@auth_bp.route('/update-username', methods=['POST'])
def update_username():
    try:
        data = request.get_json()
        print(f"Update username - Received data: {data}")
        
        # Get empId from the token or request
        emp_id = data.get('empId') or data.get('emp_id')
        new_username = data.get('username')
        
        print(f"Update username - EmpID: {emp_id}, New username: {new_username}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Find user first to verify they exist
        user = collection.find_one({"emp_id": emp_id})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        print(f"User found: {user}")
        
        result = collection.update_one(
            {"emp_id": emp_id},
            {"$set": {"emp_name": new_username}}
        )
        
        if result.modified_count > 0:
            print(f"Username updated successfully for user {emp_id}")
            return jsonify({"message": "Username updated successfully"}), 200
        else:
            print(f"No changes made for user {emp_id}")
            return jsonify({"error": "No changes made"}), 400
            
    except Exception as e:
        print(f"Error updating username: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/update-password', methods=['POST'])
def update_password():
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        emp_id = data.get('empId') or data.get('emp_id')
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        print(f"Password update attempt - EmpID: {emp_id}")
        print(f"Current password provided: {current_password}")
        print(f"New password: {new_password}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # First, find the user to see what's in the database
        # Try both string and integer versions
        user = collection.find_one({"emp_id": emp_id}) or collection.find_one({"emp_id": str(emp_id)})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        print(f"User found: {user}")
        print(f"Stored password: {user.get('password')}")
        
        # Verify current password
        if user.get('password') != current_password:
            print(f"Password mismatch - provided: {current_password}, stored: {user.get('password')}")
            return jsonify({"error": "Current password is incorrect"}), 401
            
        # Update password
        result = collection.update_one(
            {"emp_id": emp_id},
            {"$set": {"password": new_password}}
        )
        
        if result.modified_count > 0:
            print(f"Password updated successfully for user {emp_id}")
            return jsonify({"message": "Password updated successfully"}), 200
        else:
            print(f"No changes made for user {emp_id}")
            return jsonify({"error": "Failed to update password"}), 500
            
    except Exception as e:
        print(f"Error updating password: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/update-account-info', methods=['POST'])
def update_account_info():
    try:
        data = request.get_json()
        print(f"Update account info - Received data: {data}")
        
        emp_id = data.get('empId') or data.get('emp_id')
        account_data = {
            "company": data.get('company', ''),
            "department": data.get('department', ''),
            "position": data.get('position', ''),
            "level": data.get('level', ''),
            "employeeId": data.get('employeeId', ''),
            "hireDate": data.get('hireDate', None)
        }
        
        print(f"Update account info - EmpID: {emp_id}, Data: {account_data}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Find user first to verify they exist
        user = collection.find_one({"emp_id": emp_id})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        print(f"User found: {user}")
        
        # Update account information
        result = collection.update_one(
            {"emp_id": emp_id},
            {"$set": {
                "company": account_data["company"],
                "department": account_data["department"],
                "position": account_data["position"],
                "level": account_data["level"],
                "employee_id": account_data["employeeId"],
                "hire_date": account_data["hireDate"]
            }}
        )
        
        if result.modified_count > 0:
            print(f"Account info updated successfully for user {emp_id}")
            return jsonify({"message": "Account information updated successfully"}), 200
        else:
            print(f"No changes made for user {emp_id}")
            return jsonify({"error": "No changes made"}), 400
            
    except Exception as e:
        print(f"Error updating account info: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/update-dashboard-preferences', methods=['POST'])
def update_dashboard_preferences():
    try:
        data = request.get_json()
        print(f"Update dashboard preferences - Received data: {data}")
        
        emp_id = data.get('empId') or data.get('emp_id')
        dashboard_data = {
            "defaultPage": data.get('defaultPage', 'dashboard'),
            "autoRefreshInterval": data.get('autoRefreshInterval', 30),
            "cardLayout": data.get('cardLayout', 'grid'),
            "defaultFilter": data.get('defaultFilter', 'all')
        }
        
        print(f"Update dashboard preferences - EmpID: {emp_id}, Data: {dashboard_data}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Find user first to verify they exist
        user = collection.find_one({"emp_id": emp_id})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        print(f"User found: {user}")
        
        # Update dashboard preferences
        result = collection.update_one(
            {"emp_id": emp_id},
            {"$set": {
                "dashboard_preferences": dashboard_data
            }}
        )
        
        if result.modified_count > 0:
            print(f"Dashboard preferences updated successfully for user {emp_id}")
            return jsonify({"message": "Dashboard preferences updated successfully"}), 200
        else:
            print(f"No changes made for user {emp_id}")
            return jsonify({"error": "No changes made"}), 400
            
    except Exception as e:
        print(f"Error updating dashboard preferences: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/update-privacy-settings', methods=['POST'])
def update_privacy_settings():
    try:
        data = request.get_json()
        print(f"Update privacy settings - Received data: {data}")
        
        emp_id = data.get('empId') or data.get('emp_id')
        privacy_data = {
            "profileVisibility": data.get('profileVisibility', 'public'),
            "activityStatus": data.get('activityStatus', 'visible')
        }
        
        print(f"Update privacy settings - EmpID: {emp_id}, Data: {privacy_data}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Find user first to verify they exist
        user = collection.find_one({"emp_id": emp_id})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        print(f"User found: {user}")
        
        # Update privacy settings
        result = collection.update_one(
            {"emp_id": emp_id},
            {"$set": {
                "privacy_settings": privacy_data
            }}
        )
        
        if result.modified_count > 0:
            print(f"Privacy settings updated successfully for user {emp_id}")
            return jsonify({"message": "Privacy settings updated successfully"}), 200
        else:
            print(f"No changes made for user {emp_id}")
            return jsonify({"error": "No changes made"}), 400
            
    except Exception as e:
        print(f"Error updating privacy settings: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/get-user-preferences', methods=['GET'])
def get_user_preferences():
    try:
        emp_id = request.args.get('empId') or request.args.get('emp_id')
        if not emp_id:
            return jsonify({"error": "Employee ID is required"}), 400
            
        print(f"Get user preferences - EmpID: {emp_id}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Find user
        user = collection.find_one({"emp_id": emp_id}) or collection.find_one({"emp_id": str(emp_id)}) or collection.find_one({"emp_id": int(emp_id)})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        # Extract preferences
        preferences = {
            "emp_name": user.get('emp_name', ''),
            "company": user.get('company', ''),
            "department": user.get('department', ''),
            "position": user.get('position', ''),
            "level": user.get('level', ''),
            "employee_id": user.get('employee_id', ''),
            "hire_date": user.get('hire_date', ''),
            "dashboard_preferences": user.get('dashboard_preferences', {
                "defaultPage": "dashboard",
                "autoRefreshInterval": 30,
                "cardLayout": "grid",
                "defaultFilter": "all"
            }),
            "privacy_settings": user.get('privacy_settings', {
                "profileVisibility": "public",
                "activityStatus": "visible"
            })
        }
        
        print(f"User preferences retrieved successfully for user {emp_id}")
        return jsonify(preferences), 200
        
    except Exception as e:
        print(f"Error getting user preferences: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/update-preferences', methods=['POST'])
def update_preferences():
    try:
        data = request.get_json()
        print(f"Update preferences - Received data: {data}")
        
        emp_id = data.get('empId') or data.get('emp_id')
        dark_mode = data.get('darkMode')
        notifications_enabled = data.get('notificationsEnabled')
        
        print(f"Update preferences - EmpID: {emp_id}, Dark mode: {dark_mode}, Notifications: {notifications_enabled}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Find user first to verify they exist
        user = collection.find_one({"emp_id": emp_id})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        print(f"User found: {user}")
        
        result = collection.update_one(
            {"emp_id": emp_id},
            {"$set": {
                "preferences": {
                    "darkMode": dark_mode,
                    "notificationsEnabled": notifications_enabled
                }
            }}
        )
        
        if result.modified_count > 0:
            print(f"Preferences updated successfully for user {emp_id}")
            return jsonify({"message": "Preferences updated successfully"}), 200
        else:
            print(f"No changes made for user {emp_id}")
            return jsonify({"error": "No changes made"}), 400
            
    except Exception as e:
        print(f"Error updating preferences: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/debug-users', methods=['GET'])
def debug_users():
    try:
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        users = list(collection.find({}, {'_id': 0}))
        return jsonify({"users": users}), 200
        
    except Exception as e:
        print(f"Error getting users: {e}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/delete-account', methods=['POST'])
def delete_account():
    try:
        data = request.get_json()
        print(f"Delete account - Received data: {data}")
        
        emp_id = data.get('empId') or data.get('emp_id')
        
        print(f"Delete account - EmpID: {emp_id}")
        
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Find user first to verify they exist
        user = collection.find_one({"emp_id": emp_id})
        if not user:
            print(f"User not found with EmpID: {emp_id}")
            return jsonify({"error": "User not found"}), 404
            
        print(f"User found: {user}")
        
        result = collection.delete_one({"emp_id": emp_id})
        
        if result.deleted_count > 0:
            print(f"Account deleted successfully for user {emp_id}")
            return jsonify({"message": "Account deleted successfully"}), 200
        else:
            print(f"No changes made for user {emp_id}")
            return jsonify({"error": "Failed to delete account"}), 500
            
    except Exception as e:
        print(f"Error deleting account: {e}")
        return jsonify({"error": "Internal server error"}), 500
