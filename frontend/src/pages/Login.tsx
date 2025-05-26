import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'

export default function Login() {
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // 1) 로그인 API 호출 (서버에서 세션 쿠키 발급)
            const res = await api.post('/member/login', { loginId, password })
            console.log('로그인 성공:', res.data)
            alert('🎉 로그인이 완료되었습니다!')

            // 2) 서버 응답에서 사용자 정보(특히 role) 꺼내기
            const { role } = res.data  // ex. { loginId: 'user1', role: 'USER' }

            // 3) role에 따라 다른 대시보드로 이동
            if (role === 'ADMIN') {
                navigate('/admin-dashboard')
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            console.error('로그인 실패:', err)
            alert('로그인에 실패하였습니다.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
            <h2 className="text-xl font-semibold">Login</h2>
            <input
                type="text"
                placeholder="Login ID"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
            />
            <button type="submit" className="mt-4 px-4 py-2 border rounded">
                Login
            </button>
        </form>
    )
}
