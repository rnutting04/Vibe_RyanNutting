from repository.user_repository import UserRepository
from models.user import User

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def create_user(self, user_id, name):
        user = User(user_id=user_id, name=name)
        self.user_repo.add_user(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get_user(user_id)
