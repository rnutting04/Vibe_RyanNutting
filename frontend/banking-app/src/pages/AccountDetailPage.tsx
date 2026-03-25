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
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  async function loadAccountData() {
    if (!token || !accountId) return

    try {
      setLoading(true)
      setError(null)

      const accountData = await getAccount(Number(accountId), token)
      const transactionsData = await getTransactions(Number(accountId), token)

      setAccount(accountData.account)
      setTransactions(transactionsData.transactions)
    } catch (err: any) {
      setError(err.message || 'Failed to load account')
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
      setError(null)

      await deposit(Number(accountId), amount, token)
      await loadAccountData()
    } catch (err: any) {
      setError(err.message || 'Deposit failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleWithdraw(amount: number) {
    if (!token || !accountId) return

    try {
      setActionLoading(true)
      setError(null)

      await withdraw(Number(accountId), amount, token)
      await loadAccountData()
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed')
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

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p>Account not found.</p>
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
          <h1 style={{ marginTop: '0.25rem' }}>Account #{account.account_id}</h1>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
            ${account.balance.toFixed(2)}
          </p>

          {actionLoading && <p>Processing transaction...</p>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AmountForm label="Deposit" onSubmit={handleDeposit} />
            <AmountForm label="Withdraw" onSubmit={handleWithdraw} />
          </div>
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}