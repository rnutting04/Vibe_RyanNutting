import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AmountForm from '../components/AmountForm'
import TransactionList from '../components/TransactionList'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getAccount, getTransactions, deposit, withdraw } from '../api/accounts'
import type { Account, Transaction } from '../types'
import { styles } from '../styles'


function InfoTile({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '1rem 1.05rem',
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
        {label}
      </p>
      <p
        style={{
          margin: '0.4rem 0 0 0',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#0f172a',
        }}
      >
        {value}
      </p>
    </div>
  )
}

function ActionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '1.2rem',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div style={{ marginBottom: '0.95rem' }}>
        <h3
          style={{
            margin: 0,
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: '0.3rem 0 0 0',
            fontSize: '0.94rem',
            color: '#64748b',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      </div>

      {children}
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
        padding: '1.4rem',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: '0.45rem',
          color: '#0f172a',
          fontSize: '1.15rem',
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

export default function AccountDetailPage() {
  const { accountId } = useParams()
  const { token } = useAuth()

  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [pageError, setPageError] = useState<string | null>(null)
  const [depositError, setDepositError] = useState<string | null>(null)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  async function loadAccountData() {
    if (!token || !accountId) return

    try {
      setLoading(true)
      setPageError(null)

      const accountResponse = await getAccount(Number(accountId), token)
      const transactionsResponse = await getTransactions(Number(accountId), token)

      setAccount(accountResponse.account)
      setTransactions(transactionsResponse.transactions)
    } catch (err: any) {
      setPageError(err.message || 'Failed to load account')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccountData()
  }, [accountId, token])

  async function handleDeposit(amount: number) {
    if (!token || !accountId) return

    try {
      setActionLoading(true)
      setDepositError(null)
      setWithdrawError(null)

      await deposit(Number(accountId), amount, token)
      await loadAccountData()
    } catch (err: any) {
      setDepositError(err.message || 'Deposit failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleWithdraw(amount: number) {
    if (!token || !accountId) return

    try {
      setActionLoading(true)
      setWithdrawError(null)
      setDepositError(null)

      await withdraw(Number(accountId), amount, token)
      await loadAccountData()
    } catch (err: any) {
      setWithdrawError(err.message || 'Withdrawal failed')
    } finally {
      setActionLoading(false)
    }
  }

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
    maxWidth: '1180px',
    display: 'grid',
    gap: '1.5rem',
  }

  if (loading) {
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
                borderRadius: '28px',
                padding: '2.4rem 1.5rem',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                }}
              >
                <Spinner size={24} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2
                  style={{
                    margin: 0,
                    color: '#0f172a',
                    fontSize: '1.15rem',
                  }}
                >
                  Loading account
                </h2>
                <p
                  style={{
                    margin: '0.45rem 0 0 0',
                    color: '#64748b',
                  }}
                >
                  Fetching account details and recent transactions...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (pageError) {
    return (
      <div style={pageBaseStyle}>
        <div style={containerStyle}>
          <StateCard
            title="Unable to load account"
            message={pageError}
            tone="error"
          />
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div style={pageBaseStyle}>
        <div style={containerStyle}>
          <StateCard
            title="Account not found"
            message="This account could not be found or you do not have access to it."
          />
        </div>
      </div>
    )
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
                padding: '1.5rem',
                color: '#ffffff',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.68)',
                    }}
                  >
                    {account.account_type} account
                  </p>

                  <h1
                    style={{
                      margin: '0.45rem 0 0.4rem 0',
                      fontSize: '2rem',
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Account #{account.account_id}
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      maxWidth: '620px',
                      color: 'rgba(255,255,255,0.78)',
                      lineHeight: 1.6,
                    }}
                  >
                    Manage balances, review recent activity, and complete transactions in a single view.
                  </p>
                </div>

                <div
                  style={{
                    minWidth: '240px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '22px',
                    padding: '1rem 1.1rem',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.62)',
                    }}
                  >
                    Available balance
                  </p>

                  <p
                    style={{
                      margin: '0.45rem 0 0 0',
                      fontSize: '2rem',
                      fontWeight: 625,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    ${account.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <InfoTile label="Account Type" value={account.account_type} />
                <InfoTile label="Account Number" value={`#${account.account_id}`} />
                <InfoTile label="Transactions" value={`${transactions.length} total`} />
                <InfoTile label="Status" value={actionLoading ? 'Processing' : 'Ready'} />
              </div>

              {actionLoading && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                    padding: '0.9rem 1rem',
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
                    Processing transaction...
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1rem',
                }}
              >
                <ActionCard
                  title="Deposit funds"
                  subtitle="Add money to this account with immediate balance refresh."
                >
                  <AmountForm
                    label="Deposit"
                    onSubmit={handleDeposit}
                    error={depositError}
                    disabled={actionLoading}
                  />
                </ActionCard>

                <ActionCard
                  title="Withdraw funds"
                  subtitle="Move money out with clear validation and feedback."
                >
                  <AmountForm
                    label="Withdraw"
                    onSubmit={handleWithdraw}
                    error={withdrawError}
                    disabled={actionLoading}
                  />
                </ActionCard>
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
            <div style={{ marginBottom: '1rem' }}>
              <h2
                style={{
                  margin: 0,
                  color: '#0f172a',
                  fontSize: '1.18rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Recent transactions
              </h2>
              <p
                style={{
                  margin: '0.35rem 0 0 0',
                  color: '#64748b',
                  lineHeight: 1.6,
                }}
              >
                A clear record of recent account activity and money movement.
              </p>
            </div>

            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  )
}