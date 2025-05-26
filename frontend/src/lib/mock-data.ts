import type { spelling } from "./types"

// 사용자 데이터 예시
export const mockUsers = [
  {
    loginId: "admin",
    password: "q1w2e3r4",
    name: "관리자",
    role: true as const,
  },
  {
    loginId: "user",
    password: "1234",
    name: "사용자",
    role: false as const,
  },
]