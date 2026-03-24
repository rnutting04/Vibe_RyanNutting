from db import SessionLocal
from models.account import Account

class AccountRepository:
    def __init__(self):
        self.db = SessionLocal()

    def add_account(self, account):
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account

    def get_account(self, account_id):
        return self.db.query(Account).filter(Account.account_id == account_id).first()

    def get_accounts_by_user(self, user_id):
        return self.db.query(Account).filter(Account.user_id == user_id).all()
