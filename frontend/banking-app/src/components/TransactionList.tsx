import type { Transaction } from '../types'
import { styles } from '../styles'

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div style={{ ...styles.card, marginTop: '1.5rem' }}>
      <h3 style={{ marginTop: 0 }}>Recent transactions</h3>

      {transactions.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No transactions yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {transactions.map((txn) => (
            <div
              key={txn.txn_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {txn.txn_type}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  {txn.created_at ? new Date(txn.created_at).toLocaleString() : 'No date'}
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>${txn.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}