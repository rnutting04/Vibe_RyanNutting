import { useState } from 'react'

type Props = {
  label: string
  onSubmit: (amount: number) => void
}

export default function AmountForm({ label, onSubmit }: Props) {
  const [amount, setAmount] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(Number(amount))
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
      />
      <button type="submit">{label}</button>
    </form>
  )
}