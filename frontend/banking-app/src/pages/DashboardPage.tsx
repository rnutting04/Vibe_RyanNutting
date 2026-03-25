import { useEffect, useState } from 'react'
import AccountCard from '../components/AccountCard'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { Account } from '../types'
import { styles } from '../styles'

export default function DashboardPage() {
  const { token } = useAuth()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true)

        const data = await apiRequest('/api/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setAccounts(data.accounts)
      } catch (err: any) {
        setError(err.message || 'Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchAccounts()
    }
  }, [token])

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1>Your Accounts</h1>

        {loading && <p>Loading accounts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && accounts.length === 0 && (
          <p>No accounts yet. Create one to get started.</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {accounts.map((account) => (
            <AccountCard key={account.account_id} account={account} />
          ))}
        </div>
      </div>
    </div>
  )
}