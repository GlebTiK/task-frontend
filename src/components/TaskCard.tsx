import { WorksheetTask } from '../api/types'
import { OptionButton } from './OptionButton'

export type TaskAnswerState = {
  selectedOptionId?: number
  result?: 'correct' | 'wrong' | 'error'
}

type Props = {
  task: WorksheetTask
  answerState?: TaskAnswerState
  onSelect: (taskId: number, optionId: number) => void
}

export function TaskCard({ task, answerState, onSelect }: Props) {
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
          const selected = answerState?.selectedOptionId === opt.id
          const state =
            selected ? 
            answerState?.result && ['correct', 'wrong', 'error'].includes(answerState?.result || '') ? answerState?.result : 'selected' :
            'idle'

          return (
            <OptionButton
              key={opt.id}
              text={opt.text}
              state={state}
              onClick={() => onSelect(task.id, opt.id)}
            />
          )
        })}
      </div>

      {answerState?.result ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          {answerState.result === 'correct' ? (
            <span className="font-semibold text-primary">Correct</span>
          ) : answerState.result === 'wrong' ? (
            <span className="font-semibold text-red-600">Wrong</span>
          ) : (
            <span className="font-semibold text-red-600">Oops, there was an error. Please contact support.</span>
          )}
        </div>
      ) : null}
    </section>
  )
}
