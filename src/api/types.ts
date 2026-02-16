export type TaskOption = {
  id: number
  text: string,
  isCorrect?: boolean
}

export type WorksheetTask = {
  id: number
  instruction: string
  options: TaskOption[]
}

export type AnswerResult = {
  correct: boolean
}

export type StoredAnswer = {
  taskId: number
  optionId: number
  correct: boolean
}

export type SessionInfo = {
  token: string
  sessionId: number
}
