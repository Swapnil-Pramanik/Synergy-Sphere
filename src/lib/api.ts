// Simple API client for the frontend
// Base URL is configurable using Vite env: VITE_API_URL
// Defaults to http://localhost:4000 (matches backend default)

export const API_BASE = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:4000'

function headers(json: boolean = true) {
  const h: Record<string, string> = {}
  if (json) h['Content-Type'] = 'application/json'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function handle(res: Response) {
  let data: any = null
  try { data = await res.json() } catch {}
  if (!res.ok) {
    let msg = data?.message || res.statusText || 'Request failed'
    if (data?.error) {
      msg += `: ${typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}`
    }
    throw new Error(msg)
  }
  return data
}

export const api = {
  get: (path: string) => fetch(`${API_BASE}${path}`, { method: 'GET', headers: headers(false) }).then(handle),
  post: (path: string, body?: any) => fetch(`${API_BASE}${path}`, { method: 'POST', headers: headers(true), body: JSON.stringify(body || {}) }).then(handle),
  put: (path: string, body?: any) => fetch(`${API_BASE}${path}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(body || {}) }).then(handle),
}
