export type User = {
  user_id: number
  name: string
  email: string
  created_at?: string
}

export type Account = {
  account_id: number
  user_id: number
  balance: number
  account_type: 'checking' | 'savings'
  created_at?: string
}

export type Transaction = {
  txn_id: number
  account_id: number
  txn_type: 'deposit' | 'withdrawal'
  amount: number
  created_at?: string
}

export type AuthResponse = {
  message: string
  access_token: string
  user: User
}