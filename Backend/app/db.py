from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

def get_collection(database_name: str, collection_name: str):
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        return db[collection_name]
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return None
