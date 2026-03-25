from repository.account_repository import AccountRepository
from repository.transaction_repository import TransactionRepository
from models.account import Account
from models.transaction import Transaction

ALLOWED_ACCOUNT_TYPES = {"checking", "savings"}

class AccountService:
    def __init__(self, account_repo: AccountRepository, transaction_repo: TransactionRepository):
        self.account_repo = account_repo
        self.transaction_repo = transaction_repo
        self.db = account_repo.db


    def create_account(self, user_id, initial_balance=0.00, account_type="checking"):
        try:
            # normalize input
            account_type = account_type.strip().lower()

            # ✅ validate here (service layer)
            if account_type not in ALLOWED_ACCOUNT_TYPES:
                raise ValueError("Invalid account type")

            account = Account(
                user_id=user_id,
                balance=initial_balance,
                account_type=account_type
            )

            self.account_repo.add_account(account)
            self.db.commit()
            self.db.refresh(account)

            # optional: record opening deposit
            if initial_balance > 0:
                txn = Transaction(
                    account_id=account.account_id,
                    amount=initial_balance,
                    txn_type="deposit"
                )
                self.transaction_repo.add_transaction(txn)
                self.db.commit()
                self.db.refresh(txn)

            return account

        except Exception:
            self.db.rollback()
            raise

    def get_account(self, account_id):
        return self.account_repo.get_account(account_id)

    def get_accounts_by_user(self, user_id):
        return self.account_repo.get_accounts_by_user(user_id)

    def get_account_for_user(self, account_id, user_id):
        return self.account_repo.get_account_by_id_and_user(account_id, user_id)

    def deposit(self, user_id, account_id, amount):
        try:
            account = self.get_account_for_user(account_id, user_id)
            if not account:
                return None, None

            if amount <= 0:
                return None, None

            account.balance += amount

            txn = Transaction(
                account_id=account.account_id,
                amount=amount,
                txn_type="deposit"
            )

            self.transaction_repo.add_transaction(txn)

            self.db.commit()
            self.db.refresh(account)
            self.db.refresh(txn)

            return account, txn
        except Exception:
            self.db.rollback()
            raise

    def withdraw(self, user_id, account_id, amount):
        try:
            account = self.get_account_for_user(account_id, user_id)

            if not account:
                return None, None, "not_found"

            if amount <= 0:
                return None, None, "invalid_amount"

            if account.balance < amount:
                return None, None, "insufficient_funds"

            account.balance -= amount

            txn = Transaction(
                account_id=account.account_id,
                amount=amount,
                txn_type="withdrawal"
            )

            self.transaction_repo.add_transaction(txn)

            self.db.commit()
            self.db.refresh(account)
            self.db.refresh(txn)

            return account, txn, None
        except Exception:
            self.db.rollback()
            raise

    def get_transactions(self, account_id):
        return self.transaction_repo.get_transactions_by_account(account_id)

    def get_transactions_for_user_account(self, user_id, account_id):
        account = self.get_account_for_user(account_id, user_id)
        if not account:
            return None
        return self.transaction_repo.get_transactions_by_account(account_id)