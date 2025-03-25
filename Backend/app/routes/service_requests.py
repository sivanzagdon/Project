from flask import request, jsonify
from flask import Blueprint
from app.services.service_request_logic import create_new_service_request

service_requests_bp = Blueprint("service_requests", __name__)

@service_requests_bp.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.get_json()
    try:
        result = create_new_service_request(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
