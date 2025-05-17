// src/pages/RegisterPage.tsx
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/register", { email, name, password });
            // 회원가입 성공 후 바로 로그인
            const result = await login(email, password);
            if (result.success) {
                navigate("/user");
            } else {
                setError("회원가입은 되었으나 자동 로그인에 실패했습니다. 직접 로그인해주세요.");
                navigate("/login");
            }
        } catch (e: any) {
            setError(e.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
            <h2 className="text-xl mb-4">회원가입</h2>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mb-2 p-2 border"
            />
            <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full mb-2 p-2 border"
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mb-4 p-2 border"
            />
            <button type="submit" className="w-full p-2 bg-green-500 text-white">
                회원가입
            </button>
        </form>
    );
}
