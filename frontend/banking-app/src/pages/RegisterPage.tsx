import { Link } from 'react-router-dom'
import { styles } from '../styles'

export default function RegisterPage() {
  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: '520px' }}>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>Create account</h1>
          <p style={{ color: '#6b7280' }}>
            Mock registration page for frontend structure. Backend hookup comes next.
          </p>

          <form style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <label>Name</label>
              <input style={styles.input} placeholder="Full name" />
            </div>

            <div>
              <label>Email</label>
              <input style={styles.input} placeholder="Email address" />
            </div>

            <div>
              <label>Password</label>
              <input style={styles.input} type="password" placeholder="Password" />
            </div>

            <button type="button" style={styles.button}>
              Register
            </button>
          </form>

          <p style={{ marginTop: '1rem', color: '#6b7280' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}