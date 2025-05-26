import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (loginId: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 페이지 로드 시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (loginId: string, password: string) => {
    // 실제 구현에서는 API 호출로 대체
    const isUser = mockUsers.find(
      (user) => user.loginId === loginId && user.password === password,
    )

    if (isUser) {
      // loginId가 PK이므로, 보안을 위해 비밀번호는 저장하지 않음
      const { password: _, ...userWithoutPassword } = isUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return { success: true, message: "로그인 성공" }
    }

    return { success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
