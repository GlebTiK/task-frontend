type Props = {
  text: string
  state: 'correct' | 'idle'
  onClick: () => void
}

export function OptionAdminButton({ text, state, onClick }: Props) {
  const base = 'w-full rounded-2xl border px-4 py-3 text-left transition'
  const idle = 'border-slate-200 bg-white hover:border-primary hover:bg-primaryLight/20'
  const correct = 'border-primary bg-primary/10'

  const stateMap: Record<Props['state'], string> = {
    idle,
    correct
  }

  const cls = `${base} ${stateMap[state]}`

  const marker =
    state === 'correct' ? '✓' :
    ''

  return (
    <button type="button" className={cls} onClick={onClick}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-900" contentEditable={true} onChange={(value) => {console.log(value)}}>{text}</span>
        {marker ? <span className="text-sm font-semibold">{marker}</span> : null}
      </div>
    </button>
  )
}
