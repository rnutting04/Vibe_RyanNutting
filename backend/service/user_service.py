from datetime import datetime
from repository.user_repository import UserRepository
from db import get_next_sequence


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def create_user(self, name, email, password_hash, role="user"):
        email = email.strip().lower()

        existing_user = self.user_repo.get_user_by_email(email)
        if existing_user:
            raise ValueError("Email already registered")

        user_data = {
            "user_id": get_next_sequence("user_id"),
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "role": role,
            "created_at": datetime.utcnow(),
        }

        return self.user_repo.add_user(user_data)

    def get_user(self, user_id):
        return self.user_repo.get_user(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_user_by_email(email)