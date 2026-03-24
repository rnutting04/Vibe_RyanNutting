class AccountRepository:
    def __init__(self):
        self.accounts = []

    def add_account(self, account):
        self.accounts.append(account)

    def get_account(self, account_id):
        return next((a for a in self.accounts if a.account_id == account_id), None)

    def get_accounts_by_user(self, user_id):
        return [a for a in self.accounts if a.user_id == user_id]
