import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { AuthResponse } from '../types'
import { styles } from '../styles'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 900
  })

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data: AuthResponse = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      login(data.access_token, data.user)

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const pageStyle: React.CSSProperties = {
    ...styles.page,
    background: '#f6f8fb',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '1rem' : '2rem 1.25rem',
  }

  const inputStyle: React.CSSProperties = {
    ...styles.input,
    width: '100%',
    background: '#ffffff',
    border: '1px solid #dbe3ee',
    borderRadius: '14px',
    padding: isMobile ? '0.85rem 0.9rem' : '0.9rem 0.95rem',
    fontSize: '0.98rem',
    color: '#0f172a',
    boxSizing: 'border-box',
    outline: 'none',
    boxShadow: 'none',
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .login-input::placeholder {
            color: #94a3b8;
          }

          .login-link {
            color: #1d4ed8;
            text-decoration: none;
            font-weight: 600;
          }

          .login-link:hover {
            text-decoration: underline;
          }
        `}
      </style>

      <div style={pageStyle}>
        <div
          style={{
            width: '100%',
            maxWidth: isMobile ? '520px' : '1060px',
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'minmax(0, 1fr)'
              : 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: isMobile ? '24px' : '32px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: isMobile ? '1.35rem' : '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: isMobile ? '1.25rem' : '2rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '999px',
                    background: '#60a5fa',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    color: 'rgba(255,255,255,0.82)',
                  }}
                >
                  Secure Banking Access
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? '1.85rem' : '2.4rem',
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  maxWidth: isMobile ? '100%' : '420px',
                }}
              >
                Welcome back
              </h1>

              <p
                style={{
                  margin: '0.85rem 0 0 0',
                  maxWidth: '500px',
                  color: 'rgba(255,255,255,0.76)',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  lineHeight: 1.65,
                }}
              >
                Sign in to manage your accounts, review balances, and access your banking dashboard securely.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.8rem',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  padding: isMobile ? '0.9rem' : '1rem',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.76rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.58)',
                    fontWeight: 700,
                  }}
                >
                  Trusted access
                </p>
                <p
                  style={{
                    margin: '0.4rem 0 0 0',
                    color: 'rgba(255,255,255,0.86)',
                    lineHeight: 1.55,
                    fontSize: isMobile ? '0.93rem' : '1rem',
                  }}
                >
                  Protected sign-in flow with role-based routing for standard users and administrators.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  padding: isMobile ? '0.9rem' : '1rem',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.76rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.58)',
                    fontWeight: 700,
                  }}
                >
                  Account visibility
                </p>
                <p
                  style={{
                    margin: '0.4rem 0 0 0',
                    color: 'rgba(255,255,255,0.86)',
                    lineHeight: 1.55,
                    fontSize: isMobile ? '0.93rem' : '1rem',
                  }}
                >
                  View account information, balances, and transaction activity in a consistent modern interface.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: isMobile ? '1.35rem' : '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '420px',
              }}
            >
              <div style={{ marginBottom: '1.35rem' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  Sign in
                </p>

                <h2
                  style={{
                    margin: '0.45rem 0 0.4rem 0',
                    color: '#0f172a',
                    fontSize: isMobile ? '1.55rem' : '1.9rem',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Access your account
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#64748b',
                    lineHeight: 1.6,
                    fontSize: isMobile ? '0.95rem' : '1rem',
                  }}
                >
                  Enter your email and password to continue.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'grid',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'grid', gap: '0.45rem' }}>
                  <label
                    htmlFor="email"
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="login-input"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gap: '0.45rem' }}>
                  <label
                    htmlFor="password"
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="login-input"
                    style={inputStyle}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '14px',
                      padding: '0.85rem 0.95rem',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.button,
                    width: '100%',
                    borderRadius: '14px',
                    border: '1px solid #0f172a',
                    background: loading ? '#1e293b' : '#0f172a',
                    color: '#ffffff',
                    padding: isMobile ? '0.9rem 1rem' : '0.95rem 1rem',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.7rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.92 : 1,
                  }}
                >
                  {loading && <Spinner size={16} />}
                  <span>{loading ? 'Signing in...' : 'Login'}</span>
                </button>
              </form>

              <p
                style={{
                  margin: '1.15rem 0 0 0',
                  color: '#64748b',
                  lineHeight: 1.6,
                  fontSize: isMobile ? '0.95rem' : '1rem',
                }}
              >
                Don’t have an account?{' '}
                <Link to="/register" className="login-link">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}