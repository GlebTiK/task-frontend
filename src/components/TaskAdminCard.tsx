import { WorksheetTask } from '../api/types'
import { OptionAdminButton } from './OptionAdminButton'

export type TaskAnswerState = {
  selectedOptionId?: number
  result?: 'correct' | 'wrong' | 'error'
}

type Props = {
  task: WorksheetTask
  correctState?: TaskAnswerState
  onSelect: (taskId: number, optionId: number) => void
  onEdit: (taskId: number, optionId: number, newText: string, isCorrect: boolean) => void
}

export function TaskAdminCard({ task, correctState, onSelect, onEdit }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task {task.id}</div>
          <h2 className="mt-1 text-base font-semibold text-slate-900">{task.instruction}</h2>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-primaryLight/30" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {task.options.map(opt => {
          const state =
            correctState?.result ? 'correct' : 'idle'

          return (
            <OptionAdminButton
              key={opt.id}
              text={opt.text}
              state={state}
              onClick={() => onEdit(task.id, opt.id, opt.text, opt.isCorrect || false)}
              // onEdit={(newText, isCorrect) => onEdit(task.id, opt.id, newText, isCorrect)}
            />
          )
        })}
      </div>
    </section>
  )
}
