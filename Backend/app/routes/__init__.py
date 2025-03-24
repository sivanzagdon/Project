from flask import Blueprint

routes_bp = Blueprint('routes_bp', __name__)

from . import auth
from . import service_requests