import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Role, User } from "@/lib/types";

interface LoginFormState {
  loginId: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState<LoginFormState>({
    loginId: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { loginId, password } = formData;

    setError("");
    setIsLoading(true);

    try {
      const user: User = await login(loginId, password);
      navigate("/");
    } catch (err: any) {
      const reason = err?.reason;
      console.log(reason);

      if (Array.isArray(reason)) {
        const [loginIdExists, passwordExists] = reason;

        if (!loginIdExists && !passwordExists) {
          setError("아이디와 비밀번호 모두 존재하지 않습니다.");
        } else if (!passwordExists) {
          setError("비밀번호가 일치하지 않습니다.");
        } else if (!loginIdExists){
          setError("아이디가 존재하지 않습니다.");
        }
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/*아이디 입력란*/}
        <div className="space-y-2">
          <Label htmlFor="loginId">아이디</Label>
          <Input id="loginId"
          name="loginId"
          type="text"
          placeholder="아이디를 입력해주세요."
          required
          value={formData.loginId}
          onChange={handleChange} />
        </div>

        {/*비밀번호 입력란*/}
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            isLoading ||
            !formData.loginId.trim() ||
            !formData.password.trim()
          }
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>

        <div className="text-center text-sm">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-primary underline">
            회원가입
          </Link>
        </div>

      </form>
    </Card>
  )
}
