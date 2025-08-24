# app/routes/service_request.py
from flask import request, jsonify
from flask import Blueprint

from app.services.service_request_logic import (
    create_new_service_request,
    get_open_requests,
    calculate_sla,
)
from app.services.predictors.predict_response_time import predict_response_time
from app.services.predictors.overdue_risk_predictor import predict_combined_risk
from app.services.reconciliation.prediction_reconciler import reconcile_predictions

service_requests_bp = Blueprint("service_requests", __name__)

@service_requests_bp.route('/api/tickets', methods=['POST'])
def create_ticket():
    payload = request.get_json()

    try:
        ticket_meta = create_new_service_request(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        sla_hours = calculate_sla(payload.get("SubCategory", ""))

        predicted_hours = float(predict_response_time(payload))

        prob_overdue = float(predict_combined_risk(payload))

        fused = reconcile_predictions(predicted_hours, prob_overdue, sla_hours, w=0.5)

        recs = []
        if fused["risk_bucket"] == "High":
            recs.append("Assign senior technician now")
        if fused["predicted_hours"] > fused["sla_hours"]:
            recs.append("Notify customer about expected delay")

        
        resp = {
            "request_id": ticket_meta.get("request_id"),
            "predicted_hours": fused["predicted_hours"],        
            "sla_hours": fused["sla_hours"],
            "overdue_probability": fused["prob_final"],
            "risk_bucket": fused["risk_bucket"],
            "recommendations": recs,
            "sla_time": fused["sla_hours"],
            "risk_score": fused["prob_final"],
        }
        return jsonify(resp), 201

    except Exception as e:
        fallback_sla = calculate_sla(payload.get("SubCategory", ""))
        return jsonify({
            "request_id": ticket_meta.get("request_id"),
            "predicted_hours": None,                          
            "sla_hours": fallback_sla,
            "overdue_probability": None,
            "risk_bucket": None,
            "recommendations": [],
            "sla_time": fallback_sla,
            "risk_score": None,
            "error": f"prediction failed {str(e)}",
        }), 201


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
            return jsonify(open_requests[0]), 500
        print(f"Returning the first 5 open requests: {open_requests[:5]}")
        return jsonify(open_requests), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
