from flask import request, jsonify
from app.routes import routes_bp
from app.services.service_request_logic import create_new_service_request

@routes_bp.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.get_json()

    try:
        result = create_new_service_request(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
