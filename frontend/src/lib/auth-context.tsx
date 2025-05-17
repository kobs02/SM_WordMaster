import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import type { User } from "@/lib/types"

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:7777/api";
axios.defaults.withCredentials = true;

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

  useEffect(() => {
    axios.get<User>("/me")
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
  }, []);

  const login = async (loginId: string, password: string) => {
    try {
      const res = await axios.post<User>("/login", { loginId, password });
      setUser(res.data);
      return { success: true, message: "로그인 성공" };
    } catch (err: any) {
      const msg = err.response?.status === 401
          ? "아이디 또는 비밀번호가 올바르지 않습니다."
          : "서버 오류 또는 로그인 실패";
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch (e) {
      console.warn("서버 로그아웃 실패:", e);
    } finally {
      setUser(null);
    }
  };

  return (
      <AuthContext.Provider value={{ user, isLoading, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
