import { apiRequest } from './client'
import type { Account, Transaction } from '../types'

type CreateAccountPayload = {
  account_type: 'checking' | 'savings'
  initial_balance: number
}

type CreateAccountResponse = {
  message: string
  account: Account
}

type GetAccountsResponse = {
  accounts: Account[]
}

type GetAccountResponse = {
  account: Account
}

type GetTransactionsResponse = {
  transactions: Transaction[]
}

type TransactionResponse = {
  message: string
  account: Account
  transaction: Transaction
}

export async function getAccounts(token: string): Promise<GetAccountsResponse> {
  return apiRequest('/api/accounts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
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

export async function getAccount(accountId: number, token: string): Promise<GetAccountResponse> {
  return apiRequest(`/api/accounts/${accountId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getTransactions(
  accountId: number,
  token: string,
): Promise<GetTransactionsResponse> {
  return apiRequest(`/api/accounts/${accountId}/transactions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function deposit(
  accountId: number,
  amount: number,
  token: string,
): Promise<TransactionResponse> {
  return apiRequest(`/api/accounts/${accountId}/deposit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  })
}

export async function withdraw(
  accountId: number,
  amount: number,
  token: string,
): Promise<TransactionResponse> {
  return apiRequest(`/api/accounts/${accountId}/withdraw`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  })
}