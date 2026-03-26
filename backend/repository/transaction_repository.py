from db import transactions_collection


class TransactionRepository:
    def add_transaction(self, transaction_data):
        transactions_collection.insert_one(transaction_data)
        return transaction_data

    def get_transactions_by_account(self, account_id):
        return list(
            transactions_collection.find({"account_id": account_id}).sort("created_at", -1)
        )