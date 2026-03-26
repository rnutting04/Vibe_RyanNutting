from decimal import Decimal, InvalidOperation

from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required
)
from werkzeug.security import generate_password_hash, check_password_hash

from db import SessionLocal
from repository.user_repository import UserRepository
from repository.account_repository import AccountRepository
from repository.transaction_repository import TransactionRepository
from service.user_service import UserService
from service.account_service import AccountService

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.config["JWT_SECRET_KEY"] = "change-this-before-demo"
jwt = JWTManager(app)

ALLOWED_ACCOUNT_TYPES = {"checking", "savings"}


def get_db():
    if "db" not in g:
        g.db = SessionLocal()
    return g.db


def get_current_user_object():
    current_user_id = int(get_jwt_identity())
    user_service = get_user_service()
    return user_service.get_user(current_user_id)


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


def parse_amount(value):
    try:
        amount = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return None

    if amount <= 0:
        return None

    return amount.quantize(Decimal("0.01"))


def serialize_account(account):
    return {
        "account_id": account.account_id,
        "user_id": account.user_id,
        "balance": float(account.balance),
        "account_type": account.account_type,
        "created_at": account.created_at.isoformat() if account.created_at else None
    }


def serialize_transaction(txn):
    return {
        "txn_id": txn.txn_id,
        "account_id": txn.account_id,
        "txn_type": txn.txn_type,
        "amount": float(txn.amount),
        "created_at": txn.created_at.isoformat() if txn.created_at else None
    }


@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Banking System API"})


@app.route("/api/admin/accounts", methods=["GET"])
@jwt_required()
def get_all_accounts_admin():
    current_user = get_current_user_object()

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "Forbidden"}), 403

    account_service = get_account_service()
    accounts = account_service.get_all_accounts()

    return jsonify({
        "accounts": [
            {
                "account_id": a.account_id,
                "user_id": a.user_id,
                "balance": float(a.balance),
                "account_type": a.account_type,
                "created_at": a.created_at.isoformat() if a.created_at else None
            }
            for a in accounts
        ]
    }), 200


# ---------------------------
# Auth routes
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

    db = get_db()
    user_service = get_user_service()

    try:
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

        token = create_access_token(identity=str(user.user_id))

        return jsonify({
            "message": "User registered successfully",
            "access_token": token,
            "user": {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
        }), 201

    except Exception:
        db.rollback()
        return jsonify({"error": "Failed to register user"}), 500


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

    try:
        user = user_service.get_user_by_email(email)
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401

        token = create_access_token(identity=str(user.user_id))

        return jsonify({
            "message": "Login successful",
            "access_token": token,
            "user": {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "role": user.role
            }
        }), 200

    except Exception:
        return jsonify({"error": "Login failed"}), 500


# ---------------------------
# User routes
# ---------------------------

@app.route("/api/users/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = int(get_jwt_identity())
    user_service = get_user_service()

    try:
        user = user_service.get_user(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }), 200

    except Exception:
        return jsonify({"error": "Failed to fetch user"}), 500


# ---------------------------
# Account routes
# ---------------------------

@app.route("/api/accounts", methods=["POST"])
@jwt_required()
def create_account():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    current_user_id = int(get_jwt_identity())
    account_type = (data.get("account_type") or "").strip().lower()
    initial_balance = parse_amount(data.get("initial_balance", 0))

    if account_type not in ALLOWED_ACCOUNT_TYPES:
        return jsonify({"error": "account_type must be 'checking' or 'savings'"}), 400

    # allow zero initial balance
    if data.get("initial_balance", 0) in [0, "0", "0.00", 0.0]:
        initial_balance = Decimal("0.00")

    if initial_balance is None:
        return jsonify({"error": "initial_balance must be a non-negative valid amount"}), 400

    db = get_db()
    account_service = get_account_service()

    try:
        account = account_service.create_account(
            user_id=current_user_id,
            initial_balance=initial_balance,
            account_type=account_type
        )

        return jsonify({
            "message": "Account created successfully",
            "account": serialize_account(account)
        }), 201

    except Exception:
        db.rollback()
        return jsonify({"error": "Failed to create account"}), 500


@app.route("/api/accounts", methods=["GET"])
@jwt_required()
def get_my_accounts():
    current_user_id = int(get_jwt_identity())
    account_service = get_account_service()

    try:
        accounts = account_service.get_accounts_by_user(current_user_id)
        return jsonify({
            "accounts": [serialize_account(account) for account in accounts]
        }), 200

    except Exception:
        return jsonify({"error": "Failed to fetch accounts"}), 500


@app.route("/api/accounts/<int:account_id>", methods=["GET"])
@jwt_required()
def get_account(account_id):
    current_user_id = int(get_jwt_identity())
    account_service = get_account_service()

    try:
        account = account_service.get_account_for_user(account_id, current_user_id)
        if not account:
            return jsonify({"error": "Account not found"}), 404

        return jsonify({
            "account": serialize_account(account)
        }), 200

    except Exception:
        return jsonify({"error": "Failed to fetch account"}), 500


@app.route("/api/accounts/<int:account_id>/deposit", methods=["POST"])
@jwt_required()
def deposit(account_id):
    data = request.get_json()

    if not data or "amount" not in data:
        return jsonify({"error": "amount is required"}), 400

    current_user_id = int(get_jwt_identity())
    amount = parse_amount(data.get("amount"))

    if amount is None:
        return jsonify({"error": "amount must be a positive valid number"}), 400

    db = get_db()
    account_service = get_account_service()

    try:
        account, txn = account_service.deposit(current_user_id, account_id, amount)

        if not account:
            return jsonify({"error": "Account not found"}), 404

        return jsonify({
            "message": "Deposit successful",
            "account": serialize_account(account),
            "transaction": serialize_transaction(txn)
        }), 200

    except Exception:
        db.rollback()
        return jsonify({"error": "Failed to process deposit"}), 500


@app.route("/api/accounts/<int:account_id>/withdraw", methods=["POST"])
@jwt_required()
def withdraw(account_id):
    data = request.get_json()

    if not data or "amount" not in data:
        return jsonify({"error": "amount is required"}), 400

    current_user_id = int(get_jwt_identity())
    amount = parse_amount(data.get("amount"))

    if amount is None:
        return jsonify({"error": "amount must be a positive valid number"}), 400

    db = get_db()
    account_service = get_account_service()

    try:
        account, txn, error_code = account_service.withdraw(current_user_id, account_id, amount)

        if error_code == "not_found":
            return jsonify({"error": "Account not found"}), 404

        if error_code == "insufficient_funds":
            return jsonify({"error": "Cannot withdraw more than balance"}), 400

        return jsonify({
            "message": "Withdrawal successful",
            "account": serialize_account(account),
            "transaction": serialize_transaction(txn)
        }), 200

    except Exception:
        db.rollback()
        return jsonify({"error": "Failed to process withdrawal"}), 500


@app.route("/api/accounts/<int:account_id>/transactions", methods=["GET"])
@jwt_required()
def get_transactions(account_id):
    current_user_id = int(get_jwt_identity())
    account_service = get_account_service()

    try:
        account = account_service.get_account_for_user(account_id, current_user_id)
        if not account:
            return jsonify({"error": "Account not found"}), 404

        txns = account_service.get_transactions(account_id)

        return jsonify({
            "transactions": [serialize_transaction(txn) for txn in txns]
        }), 200

    except Exception:
        return jsonify({"error": "Failed to fetch transactions"}), 500


if __name__ == "__main__":
    app.run(debug=True)