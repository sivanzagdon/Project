from flask import request, jsonify
from flask import Blueprint
from app.services.service_request_logic import create_new_service_request, get_open_requests
from app.services.predict_response_time import predict_response_time

service_requests_bp = Blueprint("service_requests", __name__)

@service_requests_bp.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.get_json()
    try:
        result = create_new_service_request(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@service_requests_bp.route('/api/predict-duration', methods=['POST'])
def predict_duration():
    data = request.get_json()
    try:
        predicted_duration = predict_response_time(data)
        return jsonify({"expected_response_time_hours": predicted_duration})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@service_requests_bp.route('/api/open-requests', methods=['GET'])
def get_open_requests_route():
    try:
        open_requests = get_open_requests()  
        if isinstance(open_requests, tuple) and open_requests[1] == 500:
            return jsonify(open_requests[0]), 500  # אם קרה שגיאה בשרת, תחזיר את הטעות עם קוד 500
       
        print(f"Returning the first 5 open requests: {open_requests[:5]}")  # הדפסת 5 הבקשות הראשונות

        return jsonify(open_requests), 200  # אם הכל בסדר, תחזיר את הרשימה עם סטטוס 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


