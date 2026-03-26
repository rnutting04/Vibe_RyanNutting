import { apiRequest } from './client'
import type { Account } from '../types'
const API_URL = import.meta.env.VITE_API_URL;
type AdminAccountsResponse = {
  accounts: Account[]
}

export async function getAllAccountsAdmin(token: string): Promise<AdminAccountsResponse> {
  return apiRequest(`${API_URL}/api/admin/accounts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}