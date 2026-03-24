class UserRepository:
    def __init__(self):
        self.users = []

    def add_user(self, user):
        self.users.append(user)

    def get_user(self, user_id):
        return next((u for u in self.users if u.user_id == user_id), None)
