import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { User, BookOpen } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        {/* 로고와 텍스트는 왼쪽에 정렬 */}
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">SM Word Master</span>
        </Link>

        {/* 우측 사용자 및 로그인/회원가입 버튼 */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* 사용자 이름 위치를 다크모드 버튼 왼쪽에 */}
              <span className="text-sm md:text-base font-medium flex items-center h-full">
                {user.name}님
              </span>

              {/* 다크모드 버튼 */}
              <div className="hidden md:flex">
                <ThemeToggle />
              </div>

              {/* 마이페이지, 로그아웃 버튼 */}
              {user.role !== "admin" && (
                <Link to="/mypage">
                  <Button variant="outline" size="sm" className="h-9">
                    <User className="h-4 w-4 mr-2" />
                    마이페이지
                  </Button>
                </Link>
              )}
              <Button onClick={logout} variant="gradient" size="sm" className="h-9">
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/signup">
                <Button variant="outline" size="sm" className="h-9">
                  회원가입
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="gradient" size="sm" className="h-9">
                  로그인
                </Button>
              </Link>
            </div>
          )}

          {/* 모바일 메뉴 버튼 */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}

