import React from 'react'
import { api } from './api/client'
import { WorksheetTask, AnswerResult, StoredAnswer, SessionInfo } from './api/types'
import { Header } from './components/Header'
import { TaskCard, TaskAnswerState } from './components/TaskCard'

type AnswersMap = Record<number, TaskAnswerState>

function toAnswersMap(rows: StoredAnswer[]): AnswersMap {
  const out: AnswersMap = {}
  for (const r of rows) {
    out[r.taskId] = {
      selectedOptionId: r.optionId,
      result: r.correct ? 'correct' : 'wrong'
    }
  }
  return out
}

function getStoredToken(): string {
  return localStorage.getItem('session_token') || ''
}

function setStoredToken(token: string) {
  localStorage.setItem('session_token', token)
}

function clearStoredToken() {
  localStorage.removeItem('session_token')
}

export default function App() {
  const [tasks, setTasks] = React.useState<WorksheetTask[]>([])
  const [token, setToken] = React.useState<string>(() => getStoredToken())
  const [tokenInput, setTokenInput] = React.useState<string>(() => getStoredToken())
  const [answers, setAnswers] = React.useState<AnswersMap>({})
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'error'>('idle')
  const [authStatus, setAuthStatus] = React.useState<'none' | 'checking' | 'valid' | 'invalid'>('none')
  const [authError, setAuthError] = React.useState<string>('')

  React.useEffect(() => {
    const run = async () => {
      setStatus('loading')
      try {
        const t = await api.get<WorksheetTask[]>('/worksheet/tasks')
        setTasks(t.data)
        setStatus('idle')
      } catch {
        setStatus('error')
      }
    }
    run()
  }, [])

  React.useEffect(() => {
    const run = async () => {
      setAuthError('')
      if (!token) {
        setAuthStatus('none')
        setAnswers({})
        return
      }
      setAuthStatus('checking')
      try {
        await api.get<SessionInfo>('/session', { headers: { Authorization: `Bearer ${token}` } })
        const a = await api.get<StoredAnswer[]>('/worksheet/answers', { headers: { Authorization: `Bearer ${token}` } })
        setAnswers(toAnswersMap(a.data))
        setAuthStatus('valid')
      } catch {
        clearStoredToken()
        setToken('')
        setTokenInput('')
        setAnswers({})
        setAuthStatus('invalid')
        setAuthError('Invalid token')
      }
    }
    run()
  }, [token])

  const createSession = async () => {
    setAuthError('')
    try {
      const r = await api.get<{ token: string }>('/session-token')
      setStoredToken(r.data.token)
      setToken(r.data.token)
      setTokenInput(r.data.token)
    } catch {
      setAuthError('Failed to create session')
    }
  }

  const loginWithToken = () => {
    const t = tokenInput.trim()
    if (!t) return
    setStoredToken(t)
    setToken(t)
  }

  const logout = () => {
    clearStoredToken()
    setToken('')
    setTokenInput('')
    setAnswers({})
    setAuthStatus('none')
    setAuthError('')
  }

  const onSelect = async (taskId: number, optionId: number) => {
    if (!token || authStatus !== 'valid') {
      setAuthError('Login required')
      return
    }

    const next: AnswersMap = { ...answers, [taskId]: { selectedOptionId: optionId } }
    setAnswers(next)

    try {
      const r = await api.post<AnswerResult>(
        `/worksheet/tasks/${taskId}/answer`,
        { optionId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const result = r.data.correct ? 'correct' : 'wrong'
      setAnswers({ ...next, [taskId]: { selectedOptionId: optionId, result } })
    } catch {
      setAnswers({ ...next, [taskId]: { selectedOptionId: optionId, result: 'wrong' } })
    }
  }

  const sessionDot =
    authStatus === 'valid' ? 'bg-primary' :
    authStatus === 'checking' ? 'bg-slate-400' :
    'bg-slate-300'

  const sessionText =
    authStatus === 'valid' ? 'Session active' :
    authStatus === 'checking' ? 'Checking...' :
    'Not logged in'

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Worksheet</div>
              <div className="mt-1 text-xs text-slate-500">Select one option for each task</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${sessionDot}`} />
              <div className="text-xs text-slate-500">{sessionText}</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
            <input
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

          {authError ? (
            <div className="mt-3 text-xs font-semibold text-red-600">{authError}</div>
          ) : null}
        </div>

        {status === 'loading' ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">Loading...</div>
        ) : status === 'error' ? (
          <div className="rounded-3xl border border-red-200 bg-white p-6 text-sm text-red-700 shadow-sm">Error</div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} answerState={answers[t.id]} onSelect={onSelect} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
