from flask import Blueprint, request, jsonify
from app.services.predictors.overdue_risk_predictor import predict_combined_risk

predict_bp = Blueprint("predict_bp", __name__, url_prefix="/predict")


# Predicts the risk of a service request becoming overdue using machine learning models
@predict_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = predict_combined_risk(data)
    return jsonify({"is_overdue": result})
