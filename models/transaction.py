from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base

class Transaction(Base):
    __tablename__ = 'transactions'

    transaction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey('accounts.account_id'), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String(20), nullable=False)  # deposit or withdrawal
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    account = relationship('Account', back_populates='transactions')
