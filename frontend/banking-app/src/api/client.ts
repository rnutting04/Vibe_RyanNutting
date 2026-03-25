export async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`http://127.0.0.1:5000${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error('Request failed')
  }

  return res.json()
}