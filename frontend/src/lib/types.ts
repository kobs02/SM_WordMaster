export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export interface Word {
  id: string
  spelling: string
  mean: string
  level: CEFRLevel
}

export interface User {
  loginId: string
  password?: string /*로그인 시, id와의 매핑 여부만 검사하고, 그 이후로는 사용하지 않음*/
  name: string
  role: boolean /*관리자면 true, 사용자면 false*/
}

export interface Sentence {
    id: number;
  spelling: string
  sentence: string
  translation: string
}

export type ApiResponse<T> = {
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

export interface BookmarksResponseDto {
  spelling: string;
  mean: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; // Level enum 형태로 제한 가능
}

export interface RankingsResponseDto {
    name: string;
    rankingLevel: "Bronze" | "Silver" | "Gold" | "Platinum" | "Ruby" | "Diamond"
    exp: number;
}