export async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`http://127.0.0.1:5000${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}