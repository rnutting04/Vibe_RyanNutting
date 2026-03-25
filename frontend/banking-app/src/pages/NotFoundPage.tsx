import { Link } from 'react-router-dom'
import { styles } from '../styles'

export default function NotFoundPage() {
  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: '700px' }}>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>404</h1>
          <p style={{ color: '#6b7280' }}>The page you requested could not be found.</p>
          <Link to="/">Back to dashboard</Link>
        </div>
      </div>
    </div>
  )
}