import { useEffect, useMemo, useState } from 'react'
import { getAllAccountsAdmin } from '../api/admin'
import { useAuth } from '../context/AuthContext'
import type { Account } from '../types'
import { styles } from '../styles'
import Spinner from '../components/Spinner'


function MetricCard({
  label,
  value,
  hint,
  compact = false,
}: {
  label: string
  value: string
  hint?: string
  compact?: boolean
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: compact ? '1rem' : '1.15rem',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#64748b',
          textTransform: 'uppercase',
          fontSize: compact ? '0.7rem' : '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </p>

      <h2
        style={{
          margin: '0.55rem 0 0 0',
          fontSize: compact ? '1.45rem' : '1.75rem',
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
            fontSize: compact ? '0.88rem' : '0.92rem',
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

function TypeBadge({ type }: { type: string }) {
  const normalized = type.toLowerCase()
  const isChecking = normalized === 'checking'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.34rem 0.65rem',
        borderRadius: '999px',
        fontSize: '0.82rem',
        fontWeight: 700,
        textTransform: 'capitalize',
        background: isChecking ? '#eff6ff' : '#f8fafc',
        color: isChecking ? '#1d4ed8' : '#334155',
        border: `1px solid ${isChecking ? '#bfdbfe' : '#e2e8f0'}`,
      }}
    >
      {type}
    </span>
  )
}

function MobileAccountCard({ account }: { account: Account }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '22px',
        padding: '1rem',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
        display: 'grid',
        gap: '0.9rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div>
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
            Account ID
          </p>
          <p
            style={{
              margin: '0.35rem 0 0 0',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {account.account_id}
          </p>
        </div>

        <TypeBadge type={account.account_type} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '0.75rem',
        }}
      >
        <div>
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
            User ID
          </p>
          <p
            style={{
              margin: '0.35rem 0 0 0',
              color: '#334155',
              wordBreak: 'break-word',
            }}
          >
            {account.user_id}
          </p>
        </div>

        <div>
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
            Balance
          </p>
          <p
            style={{
              margin: '0.35rem 0 0 0',
              color: '#0f172a',
              fontWeight: 700,
            }}
          >
            ${account.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div>
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
          Created
        </p>
        <p
          style={{
            margin: '0.35rem 0 0 0',
            color: '#64748b',
            lineHeight: 1.5,
          }}
        >
          {account.created_at ? new Date(account.created_at).toLocaleString() : 'N/A'}
        </p>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { token, user } = useAuth()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts]
  )

  const checkingCount = useMemo(
    () =>
      accounts.filter(
        (account) => account.account_type?.toLowerCase() === 'checking'
      ).length,
    [accounts]
  )

  const savingsCount = useMemo(
    () =>
      accounts.filter(
        (account) => account.account_type?.toLowerCase() === 'savings'
      ).length,
    [accounts]
  )

  const pageBaseStyle: React.CSSProperties = {
    ...styles.page,
    background: '#f6f8fb',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    paddingTop: isMobile ? '1rem' : '2rem',
    paddingBottom: isMobile ? '1.5rem' : '3rem',
  }

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    maxWidth: '1280px',
    display: 'grid',
    gap: isMobile ? '1rem' : '1.5rem',
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
              borderRadius: isMobile ? '24px' : '30px',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div
              style={{
                background: '#0f172a',
                color: '#ffffff',
                padding: isMobile ? '1.15rem' : '1.5rem',
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
                Admin area
              </p>

              <h1
                style={{
                  margin: '0.45rem 0 0.35rem 0',
                  fontSize: isMobile ? '1.55rem' : '2rem',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                Admin Dashboard
              </h1>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.6,
                  maxWidth: '760px',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                }}
              >
                Signed in as {user?.name || 'Administrator'} — review platform-wide
                account visibility, monitor aggregate metrics, and inspect all stored
                account records.
              </p>
            </div>

            <div style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                <MetricCard
                  label="Total Accounts"
                  value={`${accounts.length}`}
                  hint="All user accounts currently available in the system."
                  compact={isMobile}
                />

                <MetricCard
                  label="Total Balance"
                  value={`$${totalBalance.toFixed(2)}`}
                  hint="Combined balance across all visible accounts."
                  compact={isMobile}
                />

                <MetricCard
                  label="Checking Accounts"
                  value={`${checkingCount}`}
                  hint="Accounts categorized as checking."
                  compact={isMobile}
                />

                <MetricCard
                  label="Savings Accounts"
                  value={`${savingsCount}`}
                  hint="Accounts categorized as savings."
                  compact={isMobile}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: isMobile ? '24px' : '30px',
              padding: isMobile ? '1rem' : '1.4rem',
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
                    fontSize: isMobile ? '1.05rem' : '1.18rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  All Accounts
                </h2>

                <p
                  style={{
                    margin: '0.35rem 0 0 0',
                    color: '#64748b',
                    lineHeight: 1.6,
                    fontSize: isMobile ? '0.94rem' : '1rem',
                  }}
                >
                  Administrative visibility into all accounts currently stored in the
                  platform.
                </p>
              </div>

              {!loading && !error && accounts.length > 0 && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '0.75rem 0.95rem',
                    minWidth: isMobile ? '100%' : '170px',
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
                    Records shown
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
                  Loading admin account data...
                </span>
              </div>
            )}

            {!loading && error && (
              <StateCard
                title="Unable to load admin account data"
                message={error}
                tone="error"
              />
            )}

            {!loading && !error && accounts.length === 0 && (
              <StateCard
                title="No accounts found"
                message="There are currently no accounts available in the system."
              />
            )}

            {!loading && !error && accounts.length > 0 && (
              <>
                {isMobile ? (
                  <div
                    style={{
                      display: 'grid',
                      gap: '0.9rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    {accounts.map((account) => (
                      <MobileAccountCard
                        key={account.account_id}
                        account={account}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      overflowX: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '22px',
                      marginTop: '0.5rem',
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        minWidth: '860px',
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: '#f8fafc',
                            textAlign: 'left',
                          }}
                        >
                          <th
                            style={{
                              padding: '0.95rem 1rem',
                              borderBottom: '1px solid #e2e8f0',
                              color: '#475569',
                              fontSize: '0.82rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            Account ID
                          </th>
                          <th
                            style={{
                              padding: '0.95rem 1rem',
                              borderBottom: '1px solid #e2e8f0',
                              color: '#475569',
                              fontSize: '0.82rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            User ID
                          </th>
                          <th
                            style={{
                              padding: '0.95rem 1rem',
                              borderBottom: '1px solid #e2e8f0',
                              color: '#475569',
                              fontSize: '0.82rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            Type
                          </th>
                          <th
                            style={{
                              padding: '0.95rem 1rem',
                              borderBottom: '1px solid #e2e8f0',
                              color: '#475569',
                              fontSize: '0.82rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            Balance
                          </th>
                          <th
                            style={{
                              padding: '0.95rem 1rem',
                              borderBottom: '1px solid #e2e8f0',
                              color: '#475569',
                              fontSize: '0.82rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            Created
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {accounts.map((account, index) => (
                          <tr
                            key={account.account_id}
                            style={{
                              background: index % 2 === 0 ? '#ffffff' : '#fcfdff',
                            }}
                          >
                            <td
                              style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e2e8f0',
                                color: '#0f172a',
                                fontWeight: 600,
                              }}
                            >
                              {account.account_id}
                            </td>

                            <td
                              style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e2e8f0',
                                color: '#334155',
                              }}
                            >
                              {account.user_id}
                            </td>

                            <td
                              style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e2e8f0',
                              }}
                            >
                              <TypeBadge type={account.account_type} />
                            </td>

                            <td
                              style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e2e8f0',
                                color: '#0f172a',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              ${account.balance.toFixed(2)}
                            </td>

                            <td
                              style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e2e8f0',
                                color: '#64748b',
                                whiteSpace: 'nowrap',
                              }}
                            >
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}