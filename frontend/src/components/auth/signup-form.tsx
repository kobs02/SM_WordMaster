import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export function SignupForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제 구현에서는 API 호출로 회원가입 처리
    console.log("회원가입 데이터:", formData)
    navigate("/login")
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">아이디</Label>
          <Input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full">
          회원가입
        </Button>

        <div className="text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-primary underline">
            로그인
          </Link>
        </div>
      </form>
    </Card>
  )
}
