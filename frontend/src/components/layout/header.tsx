import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { User, BookOpen } from "lucide-react"
import {Role} from "@/lib/types";

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">

        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">SM Word Master</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm md:text-base font-medium flex items-center h-full">
                {user.name}님
              </span>

              <div className="hidden md:flex">
                <ThemeToggle />
              </div>

              {user.role === Role.USER && (
                <Link to="/mypage">
                  <Button variant="outline"
                  size="sm"
                  title="마이페이지로 이동하기"
                  className="h-9">
                    <User className="h-4 w-4 mr-2" />
                    마이페이지
                  </Button>
                </Link>
              )}

              <Button onClick={logout}
              variant="gradient"
              size="sm"
              title="로그아웃으로 이동하기"
              className="h-9">
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/signup">
                <Button variant="outline"
                size="sm"
                title="회원가입으로 이동하기"
                className="h-9">
                  회원가입
                </Button>
              </Link>

              <Link to="/login">
                <Button variant="gradient"
                size="sm"
                title="로그인으로 이동하기"
                className="h-9">
                  로그인
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

