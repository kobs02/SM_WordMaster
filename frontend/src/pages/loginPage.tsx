// src/pages/LoginPage.tsx
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/types";

export default function LoginPage() {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const result = await login(loginId, password);
        if (result.success) {
            // 로그인 성공 → context.user가 세팅되었으니 role에 따라 이동
            // (AuthContext.login에서 setUser를 했으므로 바로 user를 읽을 수 있습니다)
            const user = JSON.parse(localStorage.getItem("__auth_user__") || "null");
            // 혹은 AuthContext에서 return된 user 정보를 직접 넘겨 받도록 수정해두었다면 user 변수를 바로 이용
            if (user.role === Role.ADMIN) {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
            <h2 className="text-xl mb-4">로그인</h2>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <input
                type="text"
                placeholder="아이디"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className="w-full mb-2 p-2 border"
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mb-4 p-2 border"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white">
                로그인
            </button>
            <p className="mt-4 text-center">
                아직 계정이 없으신가요?{" "}
                <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => navigate("/register")}
                >
                    회원가입
                </button>
            </p>
        </form>
    );
}
