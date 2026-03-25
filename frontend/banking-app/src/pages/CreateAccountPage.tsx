import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountForm from '../components/AccountForm'
import { useAuth } from '../context/AuthContext'
import { createAccount } from '../api/accounts'
import { styles } from '../styles'

export default function CreateAccountPage() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: '700px' }}>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>Open a new account</h1>
          <p style={{ color: '#6b7280' }}>
            Choose an account type and starting balance.
          </p>

          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          {loading && <p>Creating account...</p>}

          <div style={{ marginTop: '1.5rem' }}>
            <AccountForm onSubmit={handleCreate} />
          </div>
        </div>
      </div>
    </div>
  )
}