import React from 'react'
import { Header } from './components/Header'
import { WorksheetPage } from './pages/WorksheetPage'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <WorksheetPage />
    </div>
  )
}
