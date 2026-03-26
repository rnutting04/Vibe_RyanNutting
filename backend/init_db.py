import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

from db import engine, Base, SessionLocal
from models.account import Account
from models.user import User
from models.transaction import Transaction

load_dotenv()


def seed_user(db, name, email, password, role="user"):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        print(f"User already exists: {email}")
        return existing_user

    user = User(
        name=name,
        email=email.lower().strip(),
        password_hash=generate_password_hash(password),
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    print(f"Created {role}: {email}")
    return user


if __name__ == "__main__":
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

    db = SessionLocal()

    try:
        admin_name = os.getenv("ADMIN_NAME")
        admin_email = os.getenv("ADMIN_EMAIL")
        admin_password = os.getenv("ADMIN_PASSWORD")

        demo_user_name = os.getenv("DEMO_USER_NAME")
        demo_user_email = os.getenv("DEMO_USER_EMAIL")
        demo_user_password = os.getenv("DEMO_USER_PASSWORD")

        if admin_name and admin_email and admin_password:
            seed_user(
                db=db,
                name=admin_name,
                email=admin_email,
                password=admin_password,
                role="admin"
            )

        if demo_user_name and demo_user_email and demo_user_password:
            seed_user(
                db=db,
                name=demo_user_name,
                email=demo_user_email,
                password=demo_user_password,
                role="user"
            )

        print("Database seeding complete.")

    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
    finally:
        db.close()
