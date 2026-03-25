import { Link } from 'react-router-dom'
import type { Account } from '../types'
import { styles } from '../styles'

export default function AccountCard({ account }: { account: Account }) {
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            {account.account_type}
          </p>
          <h3 style={{ margin: '0.25rem 0 0 0' }}>Account #{account.account_id}</h3>
        </div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>${account.balance.toFixed(2)}</div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link to={`/accounts/${account.account_id}`}>View details</Link>
      </div>
    </div>
  )
}