from datetime import datetime

class Transaction:
    def __init__(self, transaction_id, account_id, amount, type, timestamp=None):
        self.transaction_id = transaction_id
        self.account_id = account_id
        self.amount = amount
        self.type = type  # 'deposit' or 'withdrawal'
        self.timestamp = timestamp or datetime.now()
