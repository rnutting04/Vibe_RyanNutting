from repository.user_repository import UserRepository
from models.user import User

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
        self.db = user_repo.db

    def create_user(self, name, email, password_hash):
        try:
            user = User(name=name, email=email, password_hash=password_hash)
            self.user_repo.add_user(user)
            self.db.commit()
            return user
        except:
            self.db.rollback()
            raise

    def get_user_by_email(self, email):
        return self.user_repo.get_user_by_email(email)

    def get_user(self, user_id):
        return self.user_repo.get_user(user_id)
