type Props = {
  text: string
  state: 'idle' | 'selected' | 'correct' | 'wrong' | 'error'
  onClick: () => void
}

export function OptionButton({ text, state, onClick }: Props) {
  const base = 'w-full rounded-2xl border px-4 py-3 text-left transition'
  const idle = 'border-slate-200 bg-white hover:border-primary hover:bg-primaryLight/20'
  const selected = 'border-primary bg-primaryLight/30'
  const correct = 'border-primary bg-primary/10'
  const wrong = 'border-red-300 bg-red-50'

  const stateMap: Record<Props['state'], string> = {
    idle,
    selected,
    correct,
    wrong,
    error: wrong
  }

  const cls = `${base} ${stateMap[state]}`

  const marker =
    state === 'correct' ? '✓' :
    state === 'wrong' ? '✕' :
    state === 'error' ? '⚠' :
    ''

  return (
    <button type="button" className={cls} onClick={onClick}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-900">{text}</span>
        {marker ? <span className="text-sm font-semibold">{marker}</span> : null}
      </div>
    </button>
  )
}
