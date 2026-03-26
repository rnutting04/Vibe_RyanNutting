from db import accounts_collection


class AccountRepository:
    def add_account(self, account_data):
        accounts_collection.insert_one(account_data)
        return account_data

    def get_account(self, account_id):
        return accounts_collection.find_one({"account_id": account_id})

    def get_accounts_by_user(self, user_id):
        return list(accounts_collection.find({"user_id": user_id}))

    def get_account_by_id_and_user(self, account_id, user_id):
        return accounts_collection.find_one({
            "account_id": account_id,
            "user_id": user_id
        })

    def get_all_accounts(self):
        return list(accounts_collection.find())

    def update_balance(self, account_id, new_balance):
        accounts_collection.update_one(
            {"account_id": account_id},
            {"$set": {"balance": new_balance}}
        )