from db import SessionLocal
from models.transaction import Transaction



class TransactionRepository:
    def __init__(self, db):
        self.db = db

    def add_transaction(self, transaction):
        self.db.add(transaction)
        self.db.flush()
        self.db.refresh(transaction)
        return transaction

    def get_transactions_by_account(self, account_id):
        return self.db.query(Transaction).filter(Transaction.account_id == account_id).all()