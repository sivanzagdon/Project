from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
database_name = os.getenv("DATABASE_NAME")
collection_name = os.getenv("COLLECTION_NAME")

app = Flask(__name__)
CORS(app)

def connect_to_mongo():
    """
    Connect to the MongoDB database and return the collection.

    Returns:
        Collection: A MongoDB collection object if the connection is successful.
        None: If the connection fails.
    """
    try:
        client = MongoClient(mongo_uri) 
        print("Connected to MongoDB successfully!")

        database = client[database_name]
        collection = database[collection_name]

        # בדיקה האם collection אינו None
        if collection is not None:
            return collection
        else:
            print("Collection not found!")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

@app.route('/')
def home():
    """
    Define the home route for the Flask application.

    Returns:
        str: A welcome message for the HR Dataset API.
    """
    return "Welcome to the HR Dataset API!"
