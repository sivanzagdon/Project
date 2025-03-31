from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from app.routes.auth import auth_bp
from app.routes.predict import predict_bp
from app.routes.service_requests import service_requests_bp

from app.routes.dashboard import dashboard_bp


load_dotenv()
app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(service_requests_bp)
app.register_blueprint(dashboard_bp)
