from datetime import datetime
from repository.account_repository import AccountRepository
from repository.transaction_repository import TransactionRepository
from db import get_next_sequence

ALLOWED_ACCOUNT_TYPES = {"checking", "savings"}


class AccountService:
    def __init__(self, account_repo: AccountRepository, transaction_repo: TransactionRepository):
        self.account_repo = account_repo
        self.transaction_repo = transaction_repo

    def create_account(self, user_id, initial_balance=0.00, account_type="checking"):
        account_type = account_type.strip().lower()

        if account_type not in ALLOWED_ACCOUNT_TYPES:
            raise ValueError("Invalid account type")

        account_data = {
            "account_id": get_next_sequence("account_id"),
            "user_id": user_id,
            "balance": float(initial_balance),
            "account_type": account_type,
            "created_at": datetime.utcnow(),
        }

        created_account = self.account_repo.add_account(account_data)

        if float(initial_balance) > 0:
            txn_data = {
                "txn_id": get_next_sequence("txn_id"),
                "account_id": created_account["account_id"],
                "txn_type": "deposit",
                "amount": float(initial_balance),
                "created_at": datetime.utcnow(),
            }
            self.transaction_repo.add_transaction(txn_data)

        return created_account

    def get_account(self, account_id):
        return self.account_repo.get_account(account_id)

    def get_accounts_by_user(self, user_id):
        return self.account_repo.get_accounts_by_user(user_id)

    def get_account_for_user(self, account_id, user_id):
        return self.account_repo.get_account_by_id_and_user(account_id, user_id)

    def get_all_accounts(self):
        return self.account_repo.get_all_accounts()

    def deposit(self, user_id, account_id, amount):
        account = self.get_account_for_user(account_id, user_id)

        if not account:
            return None, None

        if amount <= 0:
            return None, None

        new_balance = float(account["balance"]) + float(amount)
        self.account_repo.update_balance(account_id, new_balance)

        txn_data = {
            "txn_id": get_next_sequence("txn_id"),
            "account_id": account_id,
            "txn_type": "deposit",
            "amount": float(amount),
            "created_at": datetime.utcnow(),
        }

        self.transaction_repo.add_transaction(txn_data)

        updated_account = self.account_repo.get_account(account_id)
        return updated_account, txn_data

    def withdraw(self, user_id, account_id, amount):
        account = self.get_account_for_user(account_id, user_id)

        if not account:
            return None, None, "not_found"

        if amount <= 0:
            return None, None, "invalid_amount"

        if float(account["balance"]) < float(amount):
            return None, None, "insufficient_funds"

        new_balance = float(account["balance"]) - float(amount)
        self.account_repo.update_balance(account_id, new_balance)

        txn_data = {
            "txn_id": get_next_sequence("txn_id"),
            "account_id": account_id,
            "txn_type": "withdrawal",
            "amount": float(amount),
            "created_at": datetime.utcnow(),
        }

        self.transaction_repo.add_transaction(txn_data)

        updated_account = self.account_repo.get_account(account_id)
        return updated_account, txn_data, None

    def get_transactions(self, account_id):
        return self.transaction_repo.get_transactions_by_account(account_id)

    def get_transactions_for_user_account(self, user_id, account_id):
        account = self.get_account_for_user(account_id, user_id)
        if not account:
            return None
        return self.transaction_repo.get_transactions_by_account(account_id)