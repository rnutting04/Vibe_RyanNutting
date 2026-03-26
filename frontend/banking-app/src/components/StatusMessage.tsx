type Props = {
  type: 'success' | 'error' | 'info'
  message: string
}

export default function StatusMessage({ type, message }: Props) {
  const colors = {
    success: {
      background: '#ecfdf5',
      border: '#10b981',
      text: '#065f46',
    },
    error: {
      background: '#fef2f2',
      border: '#ef4444',
      text: '#991b1b',
    },
    info: {
      background: '#eff6ff',
      border: '#3b82f6',
      text: '#1e3a8a',
    },
  }

  const style = colors[type]

  return (
    <div
      style={{
        background: style.background,
        border: `1px solid ${style.border}`,
        color: style.text,
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        marginTop: '0.75rem',
      }}
    >
      {message}
    </div>
  )
}