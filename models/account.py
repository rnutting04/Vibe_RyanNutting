from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db import Base

class Account(Base):
    __tablename__ = 'accounts'

    account_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    balance = Column(Numeric(10, 2), default=0.00, nullable=False)
    account_type = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship('User', back_populates='accounts')
    transactions = relationship(
        'Transaction',
        back_populates='account',
        cascade='all, delete-orphan'
    )