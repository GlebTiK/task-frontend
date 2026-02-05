import React from 'react'
import { api } from '../../api/client'
import { SessionInfo } from '../../api/types'
import { clearStoredToken, getStoredToken, setStoredToken } from './sessionStorage'

export type AuthStatus = 'none' | 'checking' | 'valid' | 'invalid'

type UseSessionReturn = {
  token: string
  tokenInput: string
  authStatus: AuthStatus
  message: string
  setMessage: (m: string) => void
  setTokenInput: (t: string) => void
  createSession: () => Promise<void>
  loginWithToken: () => void
  logout: () => void
}

export function useSession(): UseSessionReturn {
  const [token, setToken] = React.useState<string>(() => getStoredToken())
  const [tokenInput, setTokenInputRaw] = React.useState<string>(() => getStoredToken())
  const [authStatus, setAuthStatus] = React.useState<AuthStatus>('none')
  const [message, setMessage] = React.useState<string>('')

  React.useEffect(() => {
    let cancelled = false

    const validate = async () => {
      if (!token) {
        if (!cancelled) setAuthStatus('none')
        return
      }

      if (!cancelled) setAuthStatus('checking')

      try {
        await api.get<SessionInfo>('/session', { headers: { Authorization: `Bearer ${token}` } })
        if (!cancelled) setAuthStatus('valid')
      } catch {
        clearStoredToken()
        if (!cancelled) {
          setToken('')
          setTokenInputRaw('')
          setAuthStatus('invalid')
          setMessage('Invalid token')
        }
      }
    }

    validate()
    return () => {
      cancelled = true
    }
  }, [token])

  const setTokenInput = (t: string) => {
    setTokenInputRaw(t)
    if (message) setMessage('')
  }

  const createSession = async () => {
    setMessage('')
    try {
      const r = await api.get<{ token: string }>('/session-token')
      setStoredToken(r.data.token)
      setToken(r.data.token)
      setTokenInputRaw(r.data.token)
    } catch {
      setMessage('Failed to create session')
    }
  }

  const loginWithToken = () => {
    const t = tokenInput.trim()
    if (!t) return
    setMessage('')
    setStoredToken(t)
    setToken(t)
  }

  const logout = () => {
    clearStoredToken()
    setToken('')
    setTokenInputRaw('')
    setAuthStatus('none')
    setMessage('')
  }

  return {
    token,
    tokenInput,
    authStatus,
    message,
    setMessage,
    setTokenInput,
    createSession,
    loginWithToken,
    logout
  }
}
