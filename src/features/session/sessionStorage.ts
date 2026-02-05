const STORAGE_KEY = 'session_token'

export function getStoredToken(): string {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function setStoredToken(token: string) {
  localStorage.setItem(STORAGE_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(STORAGE_KEY)
}
