from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

from app.routes import routes_bp
app.register_blueprint(routes_bp)
