from flask import Flask, jsonify, request, g
from db import SessionLocal
from repository.user_repository import UserRepository
from repository.account_repository import AccountRepository
from repository.transaction_repository import TransactionRepository
from service.user_service import UserService
from service.account_service import AccountService

app = Flask(__name__)


def get_db():
    if "db" not in g:
        g.db = SessionLocal()
    return g.db


@app.teardown_appcontext
def close_db(error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def get_user_service():
    db = get_db()
    user_repo = UserRepository(db)
    return UserService(user_repo)


def get_account_service():
    db = get_db()
    account_repo = AccountRepository(db)
    transaction_repo = TransactionRepository(db)
    return AccountService(account_repo, transaction_repo)


@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Banking System API"})


# User endpoints
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data or 'user_id' not in data or 'name' not in data:
        return jsonify({"error": "user_id and name required"}), 400

    db = get_db()
    user_service = get_user_service()

    try:
        user = user_service.create_user(
            user_id=data["user_id"],
            name=data["name"]
        )
        return jsonify({
            "user_id": user.user_id,
            "name": user.name
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    db = get_db()
    user_service = get_user_service()

    try:
        user = user_service.get_user(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "user_id": user.user_id,
            "name": user.name
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


# Account endpoints
@app.route('/api/accounts', methods=['POST'])
def create_account():
    data = request.get_json()

    if not data or 'account_id' not in data or 'user_id' not in data:
        return jsonify({"error": "account_id and user_id required"}), 400

    initial_balance = data.get("initial_balance", 0.0)

    db = get_db()
    account_service = get_account_service()

    try:
        account = account_service.create_account(
            data["account_id"],
            data["user_id"],
            initial_balance
        )
        return jsonify({
            "account_id": account.account_id,
            "user_id": account.user_id,
            "balance": account.balance
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/accounts/<int:account_id>', methods=['GET'])
def get_account(account_id):
    db = get_db()
    account_service = get_account_service()

    try:
        account = account_service.get_account(account_id)
        if not account:
            return jsonify({"error": "Account not found"}), 404

        return jsonify({
            "account_id": account.account_id,
            "user_id": account.user_id,
            "balance": account.balance
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/accounts/<int:account_id>/deposit', methods=['POST'])
def deposit(account_id):
    data = request.get_json()

    if not data or 'amount' not in data:
        return jsonify({"error": "amount required"}), 400

    db = get_db()
    account_service = get_account_service()

    try:
        account, txn = account_service.deposit(account_id, data['amount'])

        if not account:
            if data.get('amount', 0) <= 0:
                return jsonify({"error": "Deposit amount must be positive"}), 400
            return jsonify({"error": "Account not found"}), 404

        return jsonify({
            "account_id": account.account_id,
            "balance": account.balance,
            "transaction_id": txn.transaction_id,
            "amount": txn.amount,
            "type": txn.type,
            "timestamp": str(txn.timestamp)
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/accounts/<int:account_id>/withdraw', methods=['POST'])
def withdraw(account_id):
    data = request.get_json()

    if not data or 'amount' not in data:
        return jsonify({"error": "amount required"}), 400

    db = get_db()
    account_service = get_account_service()

    try:
        account, txn = account_service.withdraw(account_id, data['amount'])

        if not account:
            if data.get('amount', 0) <= 0:
                return jsonify({"error": "Withdraw amount must be positive"}), 400

            acc = account_service.get_account(account_id)
            if not acc:
                return jsonify({"error": "Account not found"}), 404

            return jsonify({"error": "Cannot withdraw more than balance"}), 400

        return jsonify({
            "account_id": account.account_id,
            "balance": account.balance,
            "transaction_id": txn.transaction_id,
            "amount": txn.amount,
            "type": txn.type,
            "timestamp": str(txn.timestamp)
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/accounts/<int:account_id>/transactions', methods=['GET'])
def get_transactions(account_id):
    db = get_db()
    account_service = get_account_service()

    try:
        txns = account_service.get_transactions(account_id)
        return jsonify([
            {
                "transaction_id": t.transaction_id,
                "amount": t.amount,
                "type": t.type,
                "timestamp": str(t.timestamp)
            }
            for t in txns
        ])
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)