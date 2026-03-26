from pymongo import MongoClient, ReturnDocument
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME", "bank_app_mongo")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing from .env")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

users_collection = db["users"]
accounts_collection = db["accounts"]
transactions_collection = db["transactions"]
counters_collection = db["counters"]


def get_next_sequence(name: str) -> int:
    counter = counters_collection.find_one_and_update(
        {"_id": name},
        {"$inc": {"value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return counter["value"]