import AccountCard from '../components/AccountCard'
import { mockAccounts, mockUser } from '../mock/data'
import { styles } from '../styles'

export default function DashboardPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.25rem' }}>Welcome, {mockUser.name}</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Here is a preview of your current checking and savings accounts.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {mockAccounts.map((account) => (
            <AccountCard key={account.account_id} account={account} />
          ))}
        </div>
      </div>
    </div>
  )
}