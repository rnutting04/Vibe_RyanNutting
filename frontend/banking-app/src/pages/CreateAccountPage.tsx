import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountForm from '../components/AccountForm'
import { useAuth } from '../context/AuthContext'
import { createAccount } from '../api/accounts'
import { styles } from '../styles'
import Spinner from '../components/Spinner'

function InfoCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        padding: '1rem',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '0.76rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.58)',
          fontWeight: 700,
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: '0.4rem 0 0 0',
          color: 'rgba(255,255,255,0.86)',
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>
    </div>
  )
}

export default function CreateAccountPage() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 900
  })

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function handleCreate(accountType: 'checking' | 'savings', initialBalance: number) {
    if (!token) {
      setError('You must be logged in')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await createAccount(
        {
          account_type: accountType,
          initial_balance: initialBalance,
        },
        token,
      )

      navigate(`/accounts/${data.account.account_id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const pageStyle: React.CSSProperties = {
    ...styles.page,
    background: '#f6f8fb',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
    padding: isMobile ? '1rem' : '2rem 1.25rem 3rem',
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

      <div style={pageStyle}>
        <div
          style={{
            ...styles.container,
            maxWidth: '1100px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? 'minmax(0, 1fr)'
                : 'minmax(0, 1fr) minmax(0, 1.05fr)',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: isMobile ? '24px' : '32px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
            }}
          >
            <div
              style={{
                background: '#0f172a',
                color: '#ffffff',
                padding: isMobile ? '1.35rem' : '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: isMobile ? '1.25rem' : '2rem',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '999px',
                      background: '#60a5fa',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      color: 'rgba(255,255,255,0.82)',
                    }}
                  >
                    New Account Setup
                  </span>
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '1.85rem' : '2.35rem',
                    lineHeight: 1.05,
                    letterSpacing: '-0.04em',
                    maxWidth: '420px',
                  }}
                >
                  Open a new account
                </h1>

                <p
                  style={{
                    margin: '0.9rem 0 0 0',
                    maxWidth: '520px',
                    color: 'rgba(255,255,255,0.76)',
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    lineHeight: 1.65,
                  }}
                >
                  Choose an account type and starting balance to create a new banking profile entry.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '0.8rem',
                }}
              >
                <InfoCard
                  title="Account types"
                  description="Create either a checking or savings account depending on how you want to manage funds."
                />
                <InfoCard
                  title="Starting balance"
                  description="Set the initial deposit amount that will be available once the account is created."
                />
              </div>
            </div>

            <div
              style={{
                padding: isMobile ? '1.35rem' : '2rem',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  margin: '0 auto',
                }}
              >
                <div style={{ marginBottom: '1.35rem' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#64748b',
                    }}
                  >
                    Create account
                  </p>

                  <h2
                    style={{
                      margin: '0.45rem 0 0.4rem 0',
                      color: '#0f172a',
                      fontSize: isMobile ? '1.55rem' : '1.9rem',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Account details
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: '#64748b',
                      lineHeight: 1.6,
                      fontSize: isMobile ? '0.95rem' : '1rem',
                    }}
                  >
                    Complete the form below to open a new bank account.
                  </p>
                </div>

                {error && (
                  <div
                    style={{
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '14px',
                      padding: '0.85rem 0.95rem',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                    }}
                  >
                    {error}
                  </div>
                )}

                {loading && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.95rem 1rem',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '16px',
                      marginBottom: '1rem',
                    }}
                  >
                    <Spinner size={18} />
                    <span
                      style={{
                        color: '#1d4ed8',
                        fontWeight: 600,
                      }}
                    >
                      Creating account...
                    </span>
                  </div>
                )}

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '24px',
                    padding: isMobile ? '1rem' : '1.2rem',
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
                  }}
                >
                  <AccountForm onSubmit={handleCreate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}