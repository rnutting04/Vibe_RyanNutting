from db import engine, Base
from models.account import Account
from models.user import User
from models.transaction import Transaction

if __name__ == "__main__":
    #Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
