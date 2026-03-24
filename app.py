from flask import Flask, jsonify, request
from models.user import User
from models.account import Account
from models.transaction import Transaction
from repository.user_repository import UserRepository
from repository.account_repository import AccountRepository
from repository.transaction_repository import TransactionRepository
from service.user_service import UserService
from service.account_service import AccountService

app = Flask(__name__)

# Initialize repositories and services
user_repo = UserRepository()
account_repo = AccountRepository()
transaction_repo = TransactionRepository()
user_service = UserService(user_repo)
account_service = AccountService(account_repo, transaction_repo)


# Home endpoint
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Banking System API"})

# User endpoints
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or 'user_id' not in data or 'name' not in data:
        return jsonify({"error": "user_id and name required"}), 400
    user = user_service.create_user(data['user_id'], data['name'])
    return jsonify({"user_id": user.user_id, "name": user.name}), 201

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = user_service.get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user_id": user.user_id, "name": user.name})

# Account endpoints
@app.route('/api/accounts', methods=['POST'])
def create_account():
    data = request.get_json()
    if not data or 'account_id' not in data or 'user_id' not in data:
        return jsonify({"error": "account_id and user_id required"}), 400
    initial_balance = data.get('initial_balance', 0.0)
    account = account_service.create_account(data['account_id'], data['user_id'], initial_balance)
    return jsonify({"account_id": account.account_id, "user_id": account.user_id, "balance": account.balance}), 201

@app.route('/api/accounts/<int:account_id>', methods=['GET'])
def get_account(account_id):
    account = account_service.get_account(account_id)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify({"account_id": account.account_id, "user_id": account.user_id, "balance": account.balance})

# Deposit endpoint
@app.route('/api/accounts/<int:account_id>/deposit', methods=['POST'])
def deposit(account_id):
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({"error": "amount required"}), 400
    account, txn = account_service.deposit(account_id, data['amount'])
    if not account:
        if data.get('amount', 0) <= 0:
            return jsonify({"error": "Deposit amount must be positive"}), 400
        return jsonify({"error": "Account not found"}), 404
    return jsonify({"account_id": account.account_id, "balance": account.balance, "transaction_id": txn.transaction_id, "amount": txn.amount, "type": txn.type, "timestamp": str(txn.timestamp)})

# Withdraw endpoint
@app.route('/api/accounts/<int:account_id>/withdraw', methods=['POST'])
def withdraw(account_id):
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({"error": "amount required"}), 400
    account, txn = account_service.withdraw(account_id, data['amount'])
    if not account:
        if data.get('amount', 0) <= 0:
            return jsonify({"error": "Withdraw amount must be positive"}), 400
        # Check if account exists
        acc = account_service.get_account(account_id)
        if not acc:
            return jsonify({"error": "Account not found"}), 404
        return jsonify({"error": "Cannot withdraw more than balance"}), 400
    return jsonify({"account_id": account.account_id, "balance": account.balance, "transaction_id": txn.transaction_id, "amount": txn.amount, "type": txn.type, "timestamp": str(txn.timestamp)})

# Transaction history endpoint
@app.route('/api/accounts/<int:account_id>/transactions', methods=['GET'])
def get_transactions(account_id):
    txns = account_service.get_transactions(account_id)
    return jsonify([
        {"transaction_id": t.transaction_id, "amount": t.amount, "type": t.type, "timestamp": str(t.timestamp)}
        for t in txns
    ])



if __name__ == '__main__':
	app.run(debug=True)
