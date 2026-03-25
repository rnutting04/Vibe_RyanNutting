import type { Account, Transaction, User } from '../types'

export const mockUser: User = {
  user_id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  created_at: '2026-03-25T10:00:00Z',
}

export const mockAccounts: Account[] = [
  {
    account_id: 1,
    user_id: 1,
    balance: 2450.75,
    account_type: 'checking',
    created_at: '2026-03-20T09:00:00Z',
  },
  {
    account_id: 2,
    user_id: 1,
    balance: 8200.0,
    account_type: 'savings',
    created_at: '2026-03-21T11:30:00Z',
  },
]

export const mockTransactions: Transaction[] = [
  {
    txn_id: 1,
    account_id: 1,
    txn_type: 'deposit',
    amount: 1500.0,
    created_at: '2026-03-21T12:00:00Z',
  },
  {
    txn_id: 2,
    account_id: 1,
    txn_type: 'withdrawal',
    amount: 120.25,
    created_at: '2026-03-22T09:15:00Z',
  },
  {
    txn_id: 3,
    account_id: 1,
    txn_type: 'deposit',
    amount: 800.0,
    created_at: '2026-03-23T14:45:00Z',
  },
]