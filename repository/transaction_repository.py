class TransactionRepository:
    def __init__(self):
        self.transactions = []

    def add_transaction(self, transaction):
        self.transactions.append(transaction)

    def get_transactions_by_account(self, account_id):
        return [t for t in self.transactions if t.account_id == account_id]
