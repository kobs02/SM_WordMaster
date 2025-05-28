import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export function SignupForm() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null); // null: 아직 검사 전
  const [idError, setIdError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const VALID_PATTERN = /^[a-zA-Z0-9@]{6,12}$/;

  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    name: "",
  })

  // 아이디 중복 여부 검사 요청
  const checkDuplicateLoginId = async (loginId: string) => {
    if (!loginId.trim()) {
      setIsDuplicate(null);
      return;
    }

    setIsChecking(true);
    try {
      const res = await fetch(`api/member/existsLoginId?loginId=${encodeURIComponent(loginId.trim())}`);
      const json = await res.json();
      setIsDuplicate(json.data === true); // true면 중복
    } catch (err) {
      console.error("중복 확인 실패", err);
      setIsDuplicate(null); // fallback
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "loginId") {
      if (!/^[a-zA-Z0-9@]*$/.test(value)) {
        setIdError("영문, 숫자, @만 입력 가능합니다.");
      } else if (value.length < 6 || value.length > 12) {
        setIdError("6자 이상 12자 이하로 입력해주세요.");
      } else {
        setIdError(null);
        checkDuplicateLoginId(value); // 중복 검사
      }
    }

    if (name === "password") {
      if (!/^[a-zA-Z0-9@]*$/.test(value)) {
        setPwError("영문, 숫자, @만 입력 가능합니다.");
      } else if (value.length < 6 || value.length > 12) {
        setPwError("6자 이상 12자 이하로 입력해주세요.");
      } else {
        setPwError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/member/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const errorData = await res.json();
        console.error("회원가입 실패:", errorData);
      }
    } catch (err) {
      console.error("요청 중 오류 발생:", err);
    }
  };



  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loginId">아이디</Label>
          <Input
            id="loginId"
            name="loginId"
            type="text"
            placeholder="아이디를 입력하세요."
            required
            value={formData.loginId}
            onChange={handleChange}
          />
          {formData.loginId.trim() && (
            <>
              {idError ? (
                <p className="text-sm text-red-500">{idError}</p>
              ) : isChecking ? (
                <p className="text-sm text-gray-500">중복 확인 중...</p>
              ) : isDuplicate === true ? (
                <p className="text-sm text-red-500">이미 사용 중인 아이디입니다.</p>
              ) : isDuplicate === false ? (
                <p className="text-sm text-green-600">사용 가능한 아이디입니다.</p>
              ) : null}
            </>
          )}
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
          {pwError && <p className="text-sm text-red-500">{pwError}</p>}
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

        <Button
          type="submit"
          className="w-full"
          disabled={
            !!idError || !!pwError || isDuplicate !== false
          }
        >
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