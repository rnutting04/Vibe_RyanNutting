from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Account(Base):
    __tablename__ = 'accounts'

    account_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    balance = Column(Float, default=0.0, nullable=False)

    user = relationship('User', back_populates='accounts')
    transactions = relationship('Transaction', back_populates='account', cascade='all, delete-orphan')

