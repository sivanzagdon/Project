from app import app  
from app.routes import *
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)