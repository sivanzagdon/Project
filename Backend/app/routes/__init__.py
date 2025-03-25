from flask import Blueprint
from . import auth
from . import service_requests

routes_bp = Blueprint('routes_bp', __name__)

