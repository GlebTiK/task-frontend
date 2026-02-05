import React from 'react'
import { api } from '../../api/client'
import { AnswerResult } from '../../api/types'
import { AuthStatus } from '../session/useSession'
import { AnswersMap } from './useWorksheetAnswers'

type Params = {
  token: string
  authStatus: AuthStatus
  setAnswers: React.Dispatch<React.SetStateAction<AnswersMap>>
  nudgeSession: (message: string) => void
}

const MSG_NEED_TOKEN = 'Generate a session token (New token) or paste one and click Log in before answering.'
const MSG_NEED_SESSION = 'Your session is not active. Generate a new token and log in before answering.'

export function useAnswerSubmission({
  token,
  authStatus,
  setAnswers,
  nudgeSession
}: Params) {
  return React.useCallback(
    async (taskId: number, optionId: number) => {
      if (!token) {
        nudgeSession(MSG_NEED_TOKEN)
        return
      }

      if (authStatus !== 'valid') {
        nudgeSession(MSG_NEED_SESSION)
        return
      }

      setAnswers(prev => ({ ...prev, [taskId]: { selectedOptionId: optionId } }))

      try {
        const r = await api.post<AnswerResult>(
          `/worksheet/tasks/${taskId}/answer`,
          { optionId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const result = r.data.correct ? 'correct' : 'wrong'
        setAnswers(prev => ({ ...prev, [taskId]: { selectedOptionId: optionId, result } }))
      } catch {
        setAnswers(prev => ({ ...prev, [taskId]: { selectedOptionId: optionId, result: 'wrong' } }))
      }
    },
    [token, authStatus, setAnswers, nudgeSession]
  )
}
