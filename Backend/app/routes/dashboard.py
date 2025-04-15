from app.services.dashboard_service import get_dashboard_data, get_time_data
from flask import Blueprint, jsonify
from app.db import get_collection
import os
from dotenv import load_dotenv
import pandas as pd


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
def get_dashboard_data_route():
    try:
        result = get_dashboard_data()
        return result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@dashboard_bp.route("/api/time-data", methods=["GET"])
def get_time_data_route():
    try:
        result = get_time_data()
        return result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
