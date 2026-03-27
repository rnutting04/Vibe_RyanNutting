
const API_URL = import.meta.env.VITE_API_URL;


export async function apiRequest(path: string, options: RequestInit = {}) {
  console.log(`API Request: ${options.method || 'GET'} ${API_URL}${path}`)
  const res = await fetch(`${API_URL}${path}`, {
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