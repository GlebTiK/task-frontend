import React from 'react'
import { AuthStatus } from './useSession'

export type SessionPanelHandle = {
  nudge: (message: string) => void
}

type Props = {
  tokenInput: string
  setTokenInput: (t: string) => void
  authStatus: AuthStatus
  message: string
  setMessage: (m: string) => void
  loginWithToken: () => void
  createSession: () => Promise<void>
  logout: () => void
}

function getDotClass(status: AuthStatus): string {
  if (status === 'valid') return 'bg-primary'
  if (status === 'checking') return 'bg-slate-400'
  return 'bg-slate-300'
}

function getStatusText(status: AuthStatus): string {
  if (status === 'valid') return 'Session active'
  if (status === 'checking') return 'Checking...'
  return 'Not logged in'
}

export const SessionPanel = React.forwardRef<SessionPanelHandle, Props>(function SessionPanel(
  {
    tokenInput,
    setTokenInput,
    authStatus,
    message,
    setMessage,
    loginWithToken,
    createSession,
    logout
  },
  ref
) {
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const tokenInputRef = React.useRef<HTMLInputElement | null>(null)
  const [highlight, setHighlight] = React.useState(false)

  const nudge = React.useCallback(
    (m: string) => {
      setMessage(m)
      setHighlight(true)
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

      setTimeout(() => {
        tokenInputRef.current?.focus({ preventScroll: true })
        tokenInputRef.current?.select?.()
      }, 0)

      window.setTimeout(() => setHighlight(false), 1600)
    },
    [setMessage]
  )

  React.useImperativeHandle(ref, () => ({ nudge }), [nudge])

  return (
    <div
      ref={panelRef}
      className={
        `mb-6 scroll-mt-24 rounded-3xl border bg-white p-5 shadow-sm ` +
        (highlight ? 'border-red-300 ring-2 ring-red-300' : 'border-slate-200')
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Worksheet</div>
          <div className="mt-1 text-xs text-slate-500">Select one option for each task</div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getDotClass(authStatus)}`} />
          <div className="text-xs text-slate-500">{getStatusText(authStatus)}</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <input
          ref={tokenInputRef}
          value={tokenInput}
          onChange={e => setTokenInput(e.target.value)}
          placeholder="Session token"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={loginWithToken}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:border-primary"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={createSession}
          className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white"
        >
          New token
        </button>
        <button
          type="button"
          onClick={logout}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:border-primary"
        >
          Log out
        </button>
      </div>

      {message ? <div className="mt-3 text-xs font-semibold text-red-600">{message}</div> : null}
    </div>
  )
})
