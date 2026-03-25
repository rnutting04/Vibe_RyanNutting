import { useState } from 'react'
import { styles } from '../styles'

type Props = {
  label: string
  onSubmit: (amount: number) => Promise<void> | void
  error?: string | null
  disabled?: boolean
}

export default function AmountForm({ label, onSubmit, error, disabled = false }: Props) {
  const [amount, setAmount] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const parsedAmount = Number(amount)

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return
    }

    await onSubmit(parsedAmount)
    setAmount('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          placeholder={`${label} amount`}
          style={styles.input}
          disabled={disabled}
        />
        <button type="submit" style={styles.button} disabled={disabled}>
          {label}
        </button>
      </form>

      {error && <p style={{ color: '#dc2626', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  )
}