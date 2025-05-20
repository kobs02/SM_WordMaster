export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export interface Word {
  id: string
  word: string
  mean: string
  level: CEFRLevel
}

export interface User {
  loginId: string
  password?: string {/*로그인 시, id와의 매핑 여부만 검사하고, 그 이후로는 사용하지 않음*/}
  name: string
  role: boolean {/*관리자면 true, 사용자면 false*/}
}

export interface Sentence {
  id: string
  word: string
  sentence: string
  translation: string
}

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
