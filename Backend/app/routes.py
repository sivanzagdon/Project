import datetime
from flask import jsonify, request
import jwt
from app import app, connect_to_mongo
from dotenv import load_dotenv
import os

# טוען את משתני הסביבה מקובץ .env
load_dotenv()

# גישה למשתנים מתוך .env
secret_key = os.getenv("SECRET_KEY")

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # מקבלים את הנתונים מהגוף של הבקשה
    Emp_id = data.get('EmpID')  # לוקחים את מזהה העובד
    Password = data.get('Password')  # לוקחים את הסיסמא
    collection = connect_to_mongo()  # חיבור למונגוDB

    print(data)
    if collection is not None:
        # חיפוש עובד לפי EmpID וסיסמא
        user = collection.find_one({"EmpID": Emp_id, "Password": Password})
        
        if user:
            # יצירת טוקן JWT
            token = jwt.encode({
                'empID': Emp_id,
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)  # תקופת פקיעה של הטוקן (1 שעה)
            }, secret_key, algorithm='HS256')
            user_name = user["Employee_Name"]

            return jsonify({"user_name": user_name, "token": token}), 200  # החזרת הטוקן
        else:
            return jsonify({"error": "Invalid EmpID or Password"}), 401  # פרטי התחברות לא נכונים
    else:
        return jsonify({"error": "Database connection failed"}), 500  # שגיאה אם לא התחברנו למסד נתונים
