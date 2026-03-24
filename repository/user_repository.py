from db import SessionLocal
from models.user import User

class UserRepository:
    def __init__(self, db):
        self.db = db

    def add_user(self, user):
        self.db.add(user)
        self.db.flush()
        self.db.refresh(user)
        return user

    def get_user(self, user_id):
        return self.db.query(User).filter(User.user_id == user_id).first()