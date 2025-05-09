export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
export type UserRole = "user" | "admin"

export interface Word {
  id: string
  word: string
  meaning: string
  level: CEFRLevel
  bookmarked: boolean
}

export interface User {
  id: string
  username: string
  name: string
  role: UserRole
  exp: number
  level: CEFRLevel
  correctRate: number
  password?: string // 클라이언트에 저장될 때는 제외됨
}

export interface Example {
  id: string
  word: string
  example: string
}

export interface LearningUnit {
  level: CEFRLevel | string
  unit: number
  date: string
}

export interface GameResult {
  level: CEFRLevel | string
  unit?: number
  score: number
  date: string
}

export interface LearningHistory {
  completedUnits: LearningUnit[]
  completedGames: GameResult[]
}
