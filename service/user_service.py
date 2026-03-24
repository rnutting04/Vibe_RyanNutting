from repository.user_repository import UserRepository
from models.user import User

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
        self.db = user_repo.db

    def create_user(self, user_id, name):
        try:
            user = User(user_id=user_id, name=name)
            self.user_repo.add_user(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except:
            self.db.rollback()
            raise

    def get_user(self, user_id):
        return self.user_repo.get_user(user_id)
