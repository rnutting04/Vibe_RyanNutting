import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import AmountForm from '../components/AmountForm'
import TransactionList from '../components/TransactionList'
import { mockAccounts, mockTransactions } from '../mock/data'
import { styles } from '../styles'

export default function AccountDetailPage() {
  const { accountId } = useParams()

  const account = useMemo(
    () => mockAccounts.find((a) => a.account_id === Number(accountId)) ?? mockAccounts[0],
    [accountId],
  )

  const transactions = mockTransactions.filter((txn) => txn.account_id === account.account_id)

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase' }}>{account.account_type}</p>
          <h1 style={{ marginTop: '0.25rem' }}>Account #{account.account_id}</h1>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
            ${account.balance.toFixed(2)}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AmountForm label="Deposit" onSubmit={(amount) => console.log('deposit', amount)} />
            <AmountForm label="Withdraw" onSubmit={(amount) => console.log('withdraw', amount)} />
          </div>
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}