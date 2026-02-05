import React from 'react'
import { api } from '../../api/client'
import { WorksheetTask } from '../../api/types'

export type LoadStatus = 'idle' | 'loading' | 'error'

type Return = {
  tasks: WorksheetTask[]
  status: LoadStatus
}

export function useWorksheetTasks(): Return {
  const [tasks, setTasks] = React.useState<WorksheetTask[]>([])
  const [status, setStatus] = React.useState<LoadStatus>('idle')

  React.useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!cancelled) setStatus('loading')
      try {
        const t = await api.get<WorksheetTask[]>('/worksheet/tasks')
        if (!cancelled) {
          setTasks(t.data)
          setStatus('idle')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  return { tasks, status }
}
