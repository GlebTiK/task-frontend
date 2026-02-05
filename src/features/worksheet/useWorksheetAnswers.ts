import React from 'react'
import { api } from '../../api/client'
import { StoredAnswer } from '../../api/types'
import { AuthStatus } from '../session/useSession'
import { TaskAnswerState } from '../../components/TaskCard'

export type AnswersMap = Record<number, TaskAnswerState>

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

type Return = {
  answers: AnswersMap
  setAnswers: React.Dispatch<React.SetStateAction<AnswersMap>>
}

export function useWorksheetAnswers(token: string, authStatus: AuthStatus): Return {
  const [answers, setAnswers] = React.useState<AnswersMap>({})

  React.useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!token || authStatus !== 'valid') {
        if (!cancelled) setAnswers({})
        return
      }

      try {
        const a = await api.get<StoredAnswer[]>('/worksheet/answers', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!cancelled) setAnswers(toAnswersMap(a.data))
      } catch {
        if (!cancelled) setAnswers({})
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token, authStatus])

  return { answers, setAnswers }
}
