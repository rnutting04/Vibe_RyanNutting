from db import SessionLocal
from models.transaction import Transaction

class TransactionRepository:
    def __init__(self):
        self.db = SessionLocal()

    def add_transaction(self, transaction):
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def get_transactions_by_account(self, account_id):
        return self.db.query(Transaction).filter(Transaction.account_id == account_id).all()
