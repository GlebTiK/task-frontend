import React from 'react'

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">Quiz time!</div>
          </div>
        </div>
      </div>
    </header>
  )
}
