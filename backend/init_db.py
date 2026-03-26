import os
from datetime import datetime
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
from pymongo import ReturnDocument

from db import (
    users_collection,
    accounts_collection,
    transactions_collection,
    counters_collection,
)

load_dotenv()


def get_next_sequence(name: str) -> int:
    counter = counters_collection.find_one_and_update(
        {"_id": name},
        {"$inc": {"value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return counter["value"]


def ensure_counter(name: str):
    existing = counters_collection.find_one({"_id": name})
    if not existing:
        counters_collection.insert_one({
            "_id": name,
            "value": 0
        })
        print(f"Initialized counter: {name}")
    else:
        print(f"Counter already exists: {name}")


def seed_user(name: str, email: str, password: str, role: str = "user"):
    email = email.strip().lower()

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        print(f"User already exists: {email}")
        return existing_user

    user_doc = {
        "user_id": get_next_sequence("user_id"),
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "role": role,
        "created_at": datetime.utcnow(),
    }

    users_collection.insert_one(user_doc)
    print(f"Created {role}: {email}")
    return user_doc


if __name__ == "__main__":
    # Indexes
    users_collection.create_index("user_id", unique=True)
    users_collection.create_index("email", unique=True)

    accounts_collection.create_index("account_id", unique=True)
    accounts_collection.create_index("user_id")

    transactions_collection.create_index("txn_id", unique=True)
    transactions_collection.create_index("account_id")

    print("Indexes created.")

    # Counters
    ensure_counter("user_id")
    ensure_counter("account_id")
    ensure_counter("txn_id")

    # Seed users
    admin_name = os.getenv("ADMIN_NAME")
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    demo_user_name = os.getenv("DEMO_USER_NAME")
    demo_user_email = os.getenv("DEMO_USER_EMAIL")
    demo_user_password = os.getenv("DEMO_USER_PASSWORD")

    if admin_name and admin_email and admin_password:
        seed_user(
            name=admin_name,
            email=admin_email,
            password=admin_password,
            role="admin"
        )

    if demo_user_name and demo_user_email and demo_user_password:
        seed_user(
            name=demo_user_name,
            email=demo_user_email,
            password=demo_user_password,
            role="user"
        )

    print("MongoDB setup complete.")