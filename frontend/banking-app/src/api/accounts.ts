import { apiRequest } from './client'
import type { Account } from '../types'

type CreateAccountPayload = {
  account_type: 'checking' | 'savings'
  initial_balance: number
}

type CreateAccountResponse = {
  message: string
  account: Account
}

export async function createAccount(
  payload: CreateAccountPayload,
  token: string,
): Promise<CreateAccountResponse> {
  return apiRequest('/api/accounts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}