import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {open ? (
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 860
  })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 860
      setIsMobile(mobile)
      if (!mobile) setMenuOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const navLinkStyle: React.CSSProperties = {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  }

  const subtleButtonStyle: React.CSSProperties = {
    background: 'transparent',
    color: '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '0.72rem 1rem',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  }

  const primaryButtonStyle: React.CSSProperties = {
    background: '#2563eb',
    color: '#ffffff',
    border: '1px solid #2563eb',
    borderRadius: '12px',
    padding: '0.72rem 1rem',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.95rem',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  }

  return (
    <nav
      style={{
        width: '100%',
        background: '#0f172a',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        overflowX: 'clip',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: isMobile ? '0.85rem 1rem' : '1rem 1.5rem',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: '56px',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <Link
            to="/"
            onClick={closeMenu}
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: isMobile ? '0.98rem' : '1.02rem',
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: 0,
              flexShrink: 1,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.92rem',
                fontWeight: 800,
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              B
            </span>

            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              }}
            >
              Banking Portal
            </span>
          </Link>

          {!isMobile && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginLeft: '1.5rem',
                  minWidth: 0,
                  boxSizing: 'border-box',
                }}
              >
                {isAuthenticated && (
                  <>
                    <Link to="/" style={navLinkStyle}>
                      Dashboard
                    </Link>
                    <Link to="/accounts/new" style={navLinkStyle}>
                      Create Account
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" style={navLinkStyle}>
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>

              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  minWidth: 0,
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        lineHeight: 1.2,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '0.94rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user?.name}
                      </span>
                      <span
                        style={{
                          color: '#94a3b8',
                          fontSize: '0.8rem',
                          textTransform: 'capitalize',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user?.role || 'User'}
                      </span>
                    </div>

                    <button onClick={handleLogout} style={subtleButtonStyle}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={navLinkStyle}>
                      Login
                    </Link>
                    <Link to="/register" style={primaryButtonStyle}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </>
          )}

          {isMobile && (
            <div
              style={{
                marginLeft: 'auto',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((prev) => !prev)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                <MenuIcon open={menuOpen} />
              </button>
            </div>
          )}
        </div>

        {isMobile && menuOpen && (
          <div
            style={{
              marginTop: '0.85rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'grid',
              gap: '0.85rem',
              width: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
            }}
          >
            {isAuthenticated ? (
              <>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '0.95rem 1rem',
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.96rem',
                    }}
                  >
                    {user?.name}
                  </p>
                  <p
                    style={{
                      margin: '0.3rem 0 0 0',
                      color: '#94a3b8',
                      fontSize: '0.84rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {user?.role || 'User'}
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: '0.35rem',
                    minWidth: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  <Link
                    to="/"
                    onClick={closeMenu}
                    style={{
                      ...navLinkStyle,
                      display: 'block',
                      width: '100%',
                      padding: '0.8rem 0.1rem',
                    }}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/accounts/new"
                    onClick={closeMenu}
                    style={{
                      ...navLinkStyle,
                      display: 'block',
                      width: '100%',
                      padding: '0.8rem 0.1rem',
                    }}
                  >
                    Create Account
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      style={{
                        ...navLinkStyle,
                        display: 'block',
                        width: '100%',
                        padding: '0.8rem 0.1rem',
                      }}
                    >
                      Admin
                    </Link>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    ...subtleButtonStyle,
                    width: '100%',
                    display: 'inline-flex',
                    justifyContent: 'center',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: '0.75rem',
                  minWidth: 0,
                  boxSizing: 'border-box',
                }}
              >
                <Link
                  to="/login"
                  onClick={closeMenu}
                  style={{
                    ...navLinkStyle,
                    display: 'block',
                    width: '100%',
                    padding: '0.8rem 0.1rem',
                  }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  style={{
                    ...primaryButtonStyle,
                    width: '100%',
                    display: 'inline-flex',
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}