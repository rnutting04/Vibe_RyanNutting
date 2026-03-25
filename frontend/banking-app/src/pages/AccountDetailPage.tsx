import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AmountForm from '../components/AmountForm'
import TransactionList from '../components/TransactionList'
import { useAuth } from '../context/AuthContext'
import { getAccount, getTransactions, deposit, withdraw } from '../api/accounts'
import type { Account, Transaction } from '../types'
import { styles } from '../styles'

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

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p>Loading account...</p>
        </div>
      </div>
    )
  }

  if (pageError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Unable to load account</h2>
            <p style={{ color: '#dc2626' }}>{pageError}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Account not found</h2>
            <p style={{ color: '#6b7280' }}>This account could not be found or you do not have access to it.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase' }}>
            {account.account_type}
          </p>

          <h1 style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Account #{account.account_id}
          </h1>

          <p style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
            ${account.balance.toFixed(2)}
          </p>

          {actionLoading && (
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Processing transaction...
            </p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <AmountForm
              label="Deposit"
              onSubmit={handleDeposit}
              error={depositError}
              disabled={actionLoading}
            />

            <AmountForm
              label="Withdraw"
              onSubmit={handleWithdraw}
              error={withdrawError}
              disabled={actionLoading}
            />
          </div>
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}