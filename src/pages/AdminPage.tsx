import React from 'react'
import { TaskAdminCard } from '../components/TaskAdminCard'
import { SessionPanel, SessionPanelHandle } from '../features/session/SessionPanel'
import { useSession } from '../features/session/useSession'
import { useWorksheetAdminTasks } from '../features/worksheet/useWorksheetAdminTasks'
import { useAnswerSubmission } from '../features/worksheet/useAnswerSubmission'

export function WorksheetPage() {
  const session = useSession()
  const sessionPanelRef = React.useRef<SessionPanelHandle | null>(null)

  const { tasks, status } = useWorksheetTasks()
  const { answers, setAnswers } = useWorksheetAdminAnswers(session.token, session.authStatus)

  const nudgeSession = React.useCallback(
    (message: string) => {
      if (sessionPanelRef.current) {
        sessionPanelRef.current.nudge(message)
      } else {
        session.setMessage(message)
      }
    },
    [session.setMessage]
  )

  const onSelect = useAnswerSubmission({
    token: session.token,
    authStatus: session.authStatus,
    setAnswers,
    nudgeSession
  })

  const onEdit = (taskId: number, optionId: number, newText: string, isCorrect: boolean) => {};

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <SessionPanel
        ref={sessionPanelRef}
        tokenInput={session.tokenInput}
        setTokenInput={session.setTokenInput}
        authStatus={session.authStatus}
        message={session.message}
        setMessage={session.setMessage}
        loginWithToken={session.loginWithToken}
        createSession={session.createSession}
        logout={session.logout}
      />

      {status === 'loading' ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">Loading...</div>
      ) : status === 'error' ? (
        <div className="rounded-3xl border border-red-200 bg-white p-6 text-sm text-red-700 shadow-sm">Error</div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {tasks.map(t => (
            <TaskAdminCard key={t.id} task={t} correctState={answers[t.id]} onSelect={onSelect} onEdit={onEdit} />
          ))}
        </div>
      )}
    </main>
  )
}
