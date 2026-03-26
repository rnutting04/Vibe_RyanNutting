import { apiRequest } from './client'
import type { Account } from '../types'

type AdminAccountsResponse = {
  accounts: Account[]
}

export async function getAllAccountsAdmin(token: string): Promise<AdminAccountsResponse> {
  return apiRequest('/api/admin/accounts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}