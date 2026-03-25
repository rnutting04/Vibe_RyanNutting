import { useState } from 'react'
import { styles } from '../styles'

type Props = {
  label: string
  onSubmit: (amount: number) => void
}

export default function AmountForm({ label, onSubmit }: Props) {
  const [amount, setAmount] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const parsedAmount = Number(amount)

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return
    }

    onSubmit(parsedAmount)
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <input
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
        placeholder={`${label} amount`}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        {label}
      </button>
    </form>
  )
}