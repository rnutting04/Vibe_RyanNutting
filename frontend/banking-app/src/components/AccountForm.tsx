import { useState } from 'react'

type Props = {
  onSubmit: (accountType: 'checking' | 'savings', initialBalance: number) => void
}

export default function AccountForm({ onSubmit }: Props) {
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking')
  const [initialBalance, setInitialBalance] = useState('0')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(accountType, Number(initialBalance))
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <label htmlFor="accountType">Account Type</label>
        <select
          id="accountType"
          value={accountType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setAccountType(e.target.value as 'checking' | 'savings')
          }
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
        </select>
      </div>

      <div>
        <label htmlFor="initialBalance">Initial Balance</label>
        <input
          id="initialBalance"
          type="number"
          step="0.01"
          min="0"
          value={initialBalance}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialBalance(e.target.value)}
        />
      </div>

      <button type="submit">Create Account</button>
    </form>
  )
}