import AccountForm from '../components/AccountForm'
import { styles } from '../styles'

export default function CreateAccountPage() {
  function handleCreate(accountType: 'checking' | 'savings', initialBalance: number) {
    console.log({ accountType, initialBalance })
  }

  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: '700px' }}>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>Open a new account</h1>
          <p style={{ color: '#6b7280' }}>
            Choose an account type and starting balance. This is currently using mock frontend behavior.
          </p>

          <div style={{ marginTop: '1.5rem' }}>
            <AccountForm onSubmit={handleCreate} />
          </div>
        </div>
      </div>
    </div>
  )
}