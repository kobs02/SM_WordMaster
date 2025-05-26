import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'

export default function Signup() {
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await api.post('/member/save', {
                loginId,
                password,
                name,
            })
            console.log('회원가입 성공:', res.data)
            alert('🎉 회원가입이 완료되었습니다!')
            navigate('/login')
        } catch (err) {
            // 아이디 중복검사 기능 필요
            console.error('회원가입 실패:', err)
            alert('회원가입 중 오류가 발생했습니다.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
            <h2 className="text-xl font-semibold">Sign Up</h2>

            <input
                type="text"
                placeholder="Login ID"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
                required
            />



            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
                required
            />

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
                required
            />

            <button type="submit" className="mt-4 px-4 py-2 border rounded">
                Sign Up
            </button>
        </form>
    )
}
