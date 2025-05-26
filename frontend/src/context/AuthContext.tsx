import React, { createContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'
import { useNavigate } from 'react-router-dom'

interface User {
    loginId: string
    name: string
    role: 'USER' | 'ADMIN'
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (loginId: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // 1) 초기: 세션 정보 가져오기
    useEffect(() => {
        api.get<User>('/member/session')
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    // 2) 로그인 함수
    const login = async (loginId: string, password: string) => {
        const res = await api.post<User>('/member/login', { loginId, password })
        setUser(res.data)
        // role 에 따라 대시보드 이동
        if (res.data.role === 'ADMIN') navigate('/admin-dashboard')
        else navigate('/dashboard')
    }

    // 3) 로그아웃 함수
    const logout = async () => {
        await api.post('/member/logout')
        setUser(null)
        navigate('/')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}