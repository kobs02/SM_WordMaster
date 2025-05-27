import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import API from "@/lib/api";

export function SignupForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post("/member/save", formData)
      navigate("/login")
    } catch (err: any) {
      console.error("회원가입 실패:", err.response?.data || err)
    }
  }


  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loginId">아이디</Label>
          <Input id="loginId"
          name="loginId"
          type="text"
          placeholder="아이디를 입력하세요."
          required
          value={formData.loginId}
          onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요."
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input id="name"
          name="name"
          type="text"
          placeholder="이름을 입력하세요."
          required
          value={formData.name}
          onChange={handleChange} />
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
