import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav
      style={{
        background: '#111827',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
        Banking Portal
      </Link>

      {isAuthenticated && (
        <Link to="/accounts/new" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
          Create Account
        </Link>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: '#cbd5e1' }}>{user?.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.6rem 0.9rem',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}