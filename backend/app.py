from decimal import Decimal, InvalidOperation

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required
)
from werkzeug.security import generate_password_hash, check_password_hash

from repository.user_repository import UserRepository
from repository.account_repository import AccountRepository
from repository.transaction_repository import TransactionRepository
from service.user_service import UserService
from service.account_service import AccountService
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

load_dotenv()

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

ALLOWED_ACCOUNT_TYPES = {"checking", "savings"}


def get_user_service():
    return UserService(UserRepository())


def get_account_service():
    return AccountService(AccountRepository(), TransactionRepository())


def get_current_user_object():
    current_user_id = int(get_jwt_identity())
    return get_user_service().get_user(current_user_id)


def parse_amount(value, allow_zero=False):
    try:
        amount = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return None

    if allow_zero:
        if amount < 0:
            return None
    else:
        if amount <= 0:
            return None

    return amount.quantize(Decimal("0.01"))


def serialize_user(user):
    return {
        "user_id": user["user_id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "created_at": user["created_at"].isoformat() if user.get("created_at") else None,
    }


def serialize_account(account):
    return {
        "account_id": account["account_id"],
        "user_id": account["user_id"],
        "balance": float(account["balance"]),
        "account_type": account["account_type"],
        "created_at": account["created_at"].isoformat() if account.get("created_at") else None,
    }


def serialize_transaction(txn):
    return {
        "txn_id": txn["txn_id"],
        "account_id": txn["account_id"],
        "txn_type": txn["txn_type"],
        "amount": float(txn["amount"]),
        "created_at": txn["created_at"].isoformat() if txn.get("created_at") else None,
    }


@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Banking System API"}), 200


# ---------------------------
# Auth
# ---------------------------

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name:
        return jsonify({"error": "name is required"}), 400
    if not email:
        return jsonify({"error": "email is required"}), 400
    if not password:
        return jsonify({"error": "password is required"}), 400

    user_service = get_user_service()

    existing_user = user_service.get_user_by_email(email)
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    password_hash = generate_password_hash(password)

    user = user_service.create_user(
        name=name,
        email=email,
        password_hash=password_hash,
        role="user"
    )

    token = create_access_token(identity=str(user["user_id"]))

    return jsonify({
        "message": "User registered successfully",
        "access_token": token,
        "user": serialize_user(user),
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email:
        return jsonify({"error": "email is required"}), 400
    if not password:
        return jsonify({"error": "password is required"}), 400

    user_service = get_user_service()
    user = user_service.get_user_by_email(email)

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["user_id"]))

    return jsonify({
        "message": "Login successful",
        "access_token": token,
        "user": serialize_user(user),
    }), 200


# ---------------------------
# User
# ---------------------------

@app.route("/api/users/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user = get_current_user_object()

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(serialize_user(current_user)), 200


# ---------------------------
# Admin
# ---------------------------

@app.route("/api/admin/accounts", methods=["GET"])
@jwt_required()
def get_all_accounts_admin():
    current_user = get_current_user_object()

    if not current_user or current_user["role"] != "admin":
        return jsonify({"error": "Forbidden"}), 403

    accounts = get_account_service().get_all_accounts()

    return jsonify({
        "accounts": [serialize_account(a) for a in accounts]
    }), 200


# ---------------------------
# Accounts
# ---------------------------

@app.route("/api/accounts", methods=["POST"])
@jwt_required()
def create_account():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    user_id = int(get_jwt_identity())
    account_type = (data.get("account_type") or "").strip().lower()
    initial_balance = parse_amount(data.get("initial_balance", 0), allow_zero=True)

    if account_type not in ALLOWED_ACCOUNT_TYPES:
        return jsonify({"error": "Invalid account type"}), 400

    if initial_balance is None:
        return jsonify({"error": "initial_balance must be a non-negative valid amount"}), 400

    account = get_account_service().create_account(
        user_id=user_id,
        initial_balance=float(initial_balance),
        account_type=account_type
    )

    return jsonify({
        "message": "Account created successfully",
        "account": serialize_account(account)
    }), 201


@app.route("/api/accounts", methods=["GET"])
@jwt_required()
def get_accounts():
    user_id = int(get_jwt_identity())
    accounts = get_account_service().get_accounts_by_user(user_id)

    return jsonify({
        "accounts": [serialize_account(a) for a in accounts]
    }), 200


@app.route("/api/accounts/<int:account_id>", methods=["GET"])
@jwt_required()
def get_account(account_id):
    user_id = int(get_jwt_identity())
    account = get_account_service().get_account_for_user(account_id, user_id)

    if not account:
        return jsonify({"error": "Account not found"}), 404

    return jsonify({
        "account": serialize_account(account)
    }), 200


@app.route("/api/accounts/<int:account_id>/deposit", methods=["POST"])
@jwt_required()
def deposit(account_id):
    data = request.get_json()

    if not data or "amount" not in data:
        return jsonify({"error": "amount is required"}), 400

    amount = parse_amount(data.get("amount"))
    if amount is None:
        return jsonify({"error": "amount must be a positive valid number"}), 400

    account, txn = get_account_service().deposit(
        int(get_jwt_identity()),
        account_id,
        float(amount)
    )

    if not account:
        return jsonify({"error": "Account not found"}), 404

    return jsonify({
        "message": "Deposit successful",
        "account": serialize_account(account),
        "transaction": serialize_transaction(txn)
    }), 200


@app.route("/api/accounts/<int:account_id>/withdraw", methods=["POST"])
@jwt_required()
def withdraw(account_id):
    data = request.get_json()

    if not data or "amount" not in data:
        return jsonify({"error": "amount is required"}), 400

    amount = parse_amount(data.get("amount"))
    if amount is None:
        return jsonify({"error": "amount must be a positive valid number"}), 400

    account, txn, error = get_account_service().withdraw(
        int(get_jwt_identity()),
        account_id,
        float(amount)
    )

    if error == "not_found":
        return jsonify({"error": "Account not found"}), 404

    if error == "insufficient_funds":
        return jsonify({"error": "Cannot withdraw more than balance"}), 400

    if error == "invalid_amount":
        return jsonify({"error": "amount must be a positive valid number"}), 400

    return jsonify({
        "message": "Withdrawal successful",
        "account": serialize_account(account),
        "transaction": serialize_transaction(txn)
    }), 200


@app.route("/api/accounts/<int:account_id>/transactions", methods=["GET"])
@jwt_required()
def get_transactions(account_id):
    user_id = int(get_jwt_identity())

    account = get_account_service().get_account_for_user(account_id, user_id)
    if not account:
        return jsonify({"error": "Account not found"}), 404

    txns = get_account_service().get_transactions(account_id)

    return jsonify({
        "transactions": [serialize_transaction(t) for t in txns]
    }), 200


if __name__ == "__main__":
    app.run(debug=True)