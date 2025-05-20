import type { Word } from "./types"

export const mockWords: Word[] = [
  { id: "1", word: "apple", meaning: "사과", level: "A1", bookmarked: false },
  { id: "2", word: "banana", meaning: "바나나", level: "A1", bookmarked: true },
  { id: "3", word: "computer", meaning: "컴퓨터", level: "A1", bookmarked: false },
  { id: "4", word: "university", meaning: "대학교", level: "A2", bookmarked: false },
  { id: "5", word: "education", meaning: "교육", level: "A2", bookmarked: true },
  { id: "6", word: "vocabulary", meaning: "어휘", level: "B1", bookmarked: false },
  { id: "7", word: "achievement", meaning: "성취", level: "B1", bookmarked: false },
  { id: "8", word: "experience", meaning: "경험", level: "B1", bookmarked: true },
  { id: "9", word: "comprehensive", meaning: "포괄적인", level: "B2", bookmarked: false },
  { id: "10", word: "implementation", meaning: "구현", level: "B2", bookmarked: false },
  { id: "11", word: "sophisticated", meaning: "정교한", level: "C1", bookmarked: false },
  { id: "12", word: "phenomenon", meaning: "현상", level: "C1", bookmarked: true },
  { id: "13", word: "ambiguous", meaning: "모호한", level: "C2", bookmarked: false },
  { id: "14", word: "paradigm", meaning: "패러다임", level: "C2", bookmarked: false },
  { id: "15", word: "book", meaning: "책", level: "A1", bookmarked: false },
  { id: "16", word: "student", meaning: "학생", level: "A1", bookmarked: false },
  { id: "17", word: "teacher", meaning: "교사", level: "A1", bookmarked: false },
  { id: "18", word: "language", meaning: "언어", level: "A1", bookmarked: true },
  { id: "19", word: "dictionary", meaning: "사전", level: "A2", bookmarked: false },
  { id: "20", word: "grammar", meaning: "문법", level: "A2", bookmarked: false },
]

// 사용자 데이터 예시
export const mockUsers = [
  {
    loginId: "admin",
    password: "q1w2e3r4",
    name: "관리자",
    role: true as const,
  },
  {
    loginId: "user@smu.ac.kr",
    password: "user1234",
    name: "일저",
    role: false as const,
  },
]