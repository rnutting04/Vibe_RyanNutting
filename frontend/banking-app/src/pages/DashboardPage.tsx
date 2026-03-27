import { useEffect, useMemo, useState } from 'react'
import AccountCard from '../components/AccountCard'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { Account } from '../types'
import { styles } from '../styles'
import Spinner from '../components/Spinner'

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '1.15rem',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#64748b',
          textTransform: 'uppercase',
          fontSize: '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </p>

      <h2
        style={{
          margin: '0.55rem 0 0 0',
          fontSize: '1.75rem',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#0f172a',
        }}
      >
        {value}
      </h2>

      {hint && (
        <p
          style={{
            margin: '0.45rem 0 0 0',
            color: '#64748b',
            fontSize: '0.92rem',
            lineHeight: 1.5,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

function StateCard({
  title,
  message,
  tone = 'neutral',
}: {
  title: string
  message: string
  tone?: 'neutral' | 'error'
}) {
  const isError = tone === 'error'

  return (
    <div
      style={{
        background: '#ffffff',
        border: `1px solid ${isError ? '#fecaca' : '#e2e8f0'}`,
        borderRadius: '24px',
        padding: '1.25rem',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: '0.45rem',
          color: '#0f172a',
          fontSize: '1.1rem',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 0,
          color: isError ? '#dc2626' : '#64748b',
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const { token, user } = useAuth()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true)
        setError(null)

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

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts]
  )

  const checkingCount = useMemo(
    () => accounts.filter((account) => account.account_type?.toLowerCase() === 'checking').length,
    [accounts]
  )

  const savingsCount = useMemo(
    () => accounts.filter((account) => account.account_type?.toLowerCase() === 'savings').length,
    [accounts]
  )

  const pageBaseStyle: React.CSSProperties = {
    ...styles.page,
    background: '#f6f8fb',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    paddingTop: '2rem',
    paddingBottom: '3rem',
  }

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    maxWidth: '1280px',
    display: 'grid',
    gap: '1.5rem',
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={pageBaseStyle}>
        <div style={containerStyle}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div
              style={{
                background: '#0f172a',
                color: '#ffffff',
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.74rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.66)',
                }}
              >
                Banking dashboard
              </p>

              <h1
                style={{
                  margin: '0.45rem 0 0.35rem 0',
                  fontSize: '2rem',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                Your Accounts
              </h1>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.6,
                  maxWidth: '760px',
                }}
              >
                Welcome back{user?.name ? `, ${user.name}` : ''}. Review your account balances,
                monitor totals, and access each account from one place.
              </p>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                <SummaryCard
                  label="Total Accounts"
                  value={`${accounts.length}`}
                  hint="All accounts currently linked to your profile."
                />

                <SummaryCard
                  label="Total Balance"
                  value={`$${totalBalance.toFixed(2)}`}
                  hint="Combined balance across your available accounts."
                />

                <SummaryCard
                  label="Checking Accounts"
                  value={`${checkingCount}`}
                  hint="Accounts currently categorized as checking."
                />

                <SummaryCard
                  label="Savings Accounts"
                  value={`${savingsCount}`}
                  hint="Accounts currently categorized as savings."
                />
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '30px',
              padding: '1.4rem',
              boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '1rem',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: '#0f172a',
                    fontSize: '1.18rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Account Overview
                </h2>

                <p
                  style={{
                    margin: '0.35rem 0 0 0',
                    color: '#64748b',
                    lineHeight: 1.6,
                  }}
                >
                  Select an account to view details, balances, and transaction activity.
                </p>
              </div>

              {!loading && !error && accounts.length > 0 && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '0.75rem 0.95rem',
                    minWidth: '170px',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#64748b',
                    }}
                  >
                    Accounts shown
                  </p>
                  <p
                    style={{
                      margin: '0.35rem 0 0 0',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {accounts.length}
                  </p>
                </div>
              )}
            </div>

            {loading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '18px',
                }}
              >
                <Spinner size={18} />
                <span
                  style={{
                    color: '#1d4ed8',
                    fontWeight: 600,
                  }}
                >
                  Loading accounts...
                </span>
              </div>
            )}

            {!loading && error && (
              <StateCard
                title="Unable to load accounts"
                message={error}
                tone="error"
              />
            )}

            {!loading && !error && accounts.length === 0 && (
              <StateCard
                title="No accounts yet"
                message="You don’t have any accounts yet. Create one to get started."
              />
            )}

            {!loading && !error && accounts.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                {accounts.map((account) => (
                  <AccountCard key={account.account_id} account={account} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}