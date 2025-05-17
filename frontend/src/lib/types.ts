export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
export enum Role {
  USER = 0,
  ADMIN = 1
}

export interface Word {
  id: string
  spelling: string
  mean: string
  level: CEFRLevel
  bookmarked: boolean;
}

export interface User {
  loginId: string
  password?: string
  name: string
  role: Role
  exp: number
}

export interface Sentence {
  id: string
  spelling: string
  sentence: string
  translation: string
}

// @ts-ignore
type Response<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
};


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
