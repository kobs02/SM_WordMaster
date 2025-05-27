// src/lib/auth-context.tsx
import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { Role, type User } from "@/lib/types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (loginId: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ① 페이지 로드 시 세션 들고 오기
    useEffect(() => {
        console.log("🔍 fetchSession start")
        async function fetchSession() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/member/session`,
                    {
                        method: "GET",
                        credentials: "include",   // 쿠키(JSESSIONID)를 보내려면 필수
                    }
                );
                if (res.ok) {
                    const sessionUser = (await res.json()) as User;
                    setUser(sessionUser);
                    console.log("🔍 fetchSession end", sessionUser);  // ← 여기
                }
            } catch (err) {
                console.error("세션 체크 실패", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSession();
    }, []);

    // ② 로그인 함수에도 credentials 포함
    const login = async (loginId: string, password: string) => {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/member/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ loginId, password }),
            }
        );
        if (!res.ok) {
            const err = await res.json().catch(() => ({} as any));
            throw new Error(err.message || `로그인 실패 (${res.status})`);
        }
        const loggedUser = (await res.json()) as User;
        console.log("서버에서 받은 role:", loggedUser.role, typeof loggedUser.role);
        setUser(loggedUser);
        return loggedUser;
    };

    // ③ 로그아웃 시 세션 제거
    const logout = async () => {
        await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/member/logout`,
            {
                method: "POST",
                credentials: "include",
            }
        );
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("AuthProvider로 감싸주세요");
    return ctx;
}
