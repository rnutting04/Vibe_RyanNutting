from db import users_collection


class UserRepository:
    def get_user_by_email(self, email):
        return users_collection.find_one({"email": email.strip().lower()})

    def get_user(self, user_id):
        return users_collection.find_one({"user_id": user_id})

    def add_user(self, user_data):
        users_collection.insert_one(user_data)
        return user_data