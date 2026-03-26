import { useEffect, useState } from 'react'
import { getAllAccountsAdmin } from '../api/admin'
import { useAuth } from '../context/AuthContext'
import type { Account } from '../types'
import { styles } from '../styles'

export default function AdminDashboardPage() {
  const { token, user } = useAuth()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAdminAccounts() {
      if (!token) return

      try {
        setLoading(true)
        setError(null)

        const data = await getAllAccountsAdmin(token)
        setAccounts(data.accounts)
      } catch (err: any) {
        setError(err.message || 'Failed to load admin account data')
      } finally {
        setLoading(false)
      }
    }

    loadAdminAccounts()
  }, [token])

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const checkingCount = accounts.filter((account) => account.account_type === 'checking').length
  const savingsCount = accounts.filter((account) => account.account_type === 'savings').length

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div
          style={{
            ...styles.card,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            color: '#fff',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#93c5fd',
            }}
          >
            Admin Area
          </p>

          <h1 style={{ margin: '0.5rem 0 0.25rem 0' }}>Admin Dashboard</h1>

          <p style={{ margin: 0, color: '#d1d5db' }}>
            Signed in as {user?.name} — review platform-wide account visibility and basic operational metrics.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={styles.card}>
            <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Total Accounts
            </p>
            <h2 style={{ margin: '0.5rem 0 0 0' }}>{accounts.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Total Balance
            </p>
            <h2 style={{ margin: '0.5rem 0 0 0' }}>${totalBalance.toFixed(2)}</h2>
          </div>

          <div style={styles.card}>
            <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Checking Accounts
            </p>
            <h2 style={{ margin: '0.5rem 0 0 0' }}>{checkingCount}</h2>
          </div>

          <div style={styles.card}>
            <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Savings Accounts
            </p>
            <h2 style={{ margin: '0.5rem 0 0 0' }}>{savingsCount}</h2>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>All Accounts</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
              Administrative visibility into all user accounts currently stored in the system.
            </p>
          </div>

          {loading && <p>Loading admin account data...</p>}

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #ef4444',
                color: '#991b1b',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && accounts.length === 0 && (
            <p style={{ color: '#6b7280' }}>No accounts found in the system.</p>
          )}

          {!loading && !error && accounts.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '1rem',
                }}
              >
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                    <th style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb' }}>Account ID</th>
                    <th style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb' }}>User ID</th>
                    <th style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb' }}>Type</th>
                    <th style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb' }}>Balance</th>
                    <th style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.account_id}>
                      <td style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb' }}>
                        {account.account_id}
                      </td>
                      <td style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb' }}>
                        {account.user_id}
                      </td>
                      <td
                        style={{
                          padding: '0.85rem',
                          borderBottom: '1px solid #e5e7eb',
                          textTransform: 'capitalize',
                        }}
                      >
                        {account.account_type}
                      </td>
                      <td
                        style={{
                          padding: '0.85rem',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: 600,
                        }}
                      >
                        ${account.balance.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                        {account.created_at
                          ? new Date(account.created_at).toLocaleString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}