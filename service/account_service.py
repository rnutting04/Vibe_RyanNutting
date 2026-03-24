from repository.account_repository import AccountRepository
from repository.transaction_repository import TransactionRepository
from models.account import Account
from models.transaction import Transaction

class AccountService:
    def __init__(self, account_repo: AccountRepository, transaction_repo: TransactionRepository):
        self.account_repo = account_repo
        self.transaction_repo = transaction_repo
        self.db = account_repo.db

    def create_account(self, account_id, user_id, initial_balance=0.0):
        try:
            account = Account(
                account_id=account_id,
                user_id=user_id,
                balance=initial_balance
            )
            self.account_repo.add_account(account)
            self.db.commit()
            self.db.refresh(account)
            return account
        except:
            self.db.rollback()
            raise

    def get_account(self, account_id):
        return self.account_repo.get_account(account_id)

    def deposit(self, account_id, amount):
        try:
            account = self.get_account(account_id)
            if not account or amount <= 0:
                return None, None

            account.balance += amount
            txn = Transaction(
                account_id=account_id,
                amount=amount,
                type='deposit'
            )

            self.transaction_repo.add_transaction(txn)

            self.db.commit()
            self.db.refresh(account)
            self.db.refresh(txn)

            return account, txn
        except:
            self.db.rollback()
            raise

    def withdraw(self, account_id, amount):
        try:
            account = self.get_account(account_id)
            if not account or amount <= 0 or account.balance < amount:
                return None, None

            account.balance -= amount
            txn = Transaction(
                account_id=account_id,
                amount=-amount,
                type='withdrawal'
            )

            self.transaction_repo.add_transaction(txn)

            self.db.commit()
            self.db.refresh(account)
            self.db.refresh(txn)

            return account, txn
        except:
            self.db.rollback()
            raise

    def get_transactions(self, account_id):
        return self.transaction_repo.get_transactions_by_account(account_id)
