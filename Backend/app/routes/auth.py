import datetime
import os
from flask import Blueprint, jsonify, request
import jwt
from dotenv import load_dotenv
from app.db import get_collection

load_dotenv()

auth_bp = Blueprint('auth', __name__)
secret_key = os.getenv("SECRET_KEY")

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    Emp_id = data.get('emp_id')
    Password = data.get('password')
    collection = get_collection("DS_PROJECT", "users")

    print(data)
    if collection is not None:
        user = collection.find_one({"EmpID": Emp_id, "Password": Password})
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
