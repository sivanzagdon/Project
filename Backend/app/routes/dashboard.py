import app.services.dashboard_service as dashboard_service
from flask import Blueprint, jsonify
from app.db import get_collection
import os
from dotenv import load_dotenv
import pandas as pd


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
def get_dashboard_data():
    try:
        result = dashboard_service.get_dashboard_data_by_years_and_months()
        return result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@dashboard_bp.route("/api/time-data", methods=["GET"])
def get_time_data_route():
    try:
        result = dashboard_service.get_time_data()
        return result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@dashboard_bp.route("/api/num-open-requests", methods=["GET"])
def get_num_of_open_requests_route():
    try:
        result = dashboard_service.get_num_of_open_requests()
        return result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@dashboard_bp.route("/api/dashboard-open-requests", methods=["GET"])
def get_open_requests_dashboard_route():
    try:
        result = dashboard_service.get_open_requests_dashboard_data()
        return result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
