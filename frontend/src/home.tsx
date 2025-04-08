import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { HelpCircle, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [user, setUser] = useState<{ name: string; isAdmin: boolean; level: string } | null>(null)

  // Mock login function - in a real app, this would use authentication
  const handleLogin = () => {
    setUser({ name: "John", isAdmin: true, level: "B" })
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <main class="container mx-auto px-3 sm:px-4 py-4 sm:py-6 min-h-screen flex flex-col">
      <header class="flex justify-between items-center mb-4 sm:mb-8">
        <Link to="/help">
          <Button variant="ghost" size="icon">
            <HelpCircle class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="sr-only">Help</span>
          </Button>
        </Link>

        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-center">SMU WordMaster</h1>

        <div class="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {user ? (
            <div class="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" onClick={handleLogout} class="flex items-center">
                <LogOut class="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login / Register
              </Button>
            </Link>
          )}
        </div>
      </header>

      {user && (
        <div class="text-center mb-4 sm:mb-6">
          <p class="text-sm sm:text-base md:text-lg font-medium">
            {user.name}님 환영합니다!{" "}
            {user.isAdmin && <span class="text-blue-600 dark:text-blue-400">[관리자]</span>}
          </p>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">현재 레벨: {user.level}</p>
        </div>
      )}

      <div class="grid grid-cols-1 grid-cols-2 gap-3 mb-6 sm:mb-8 lg:mb-12">
        <Link to="/level-select" class="block">
          <Card class="h-full hover:shadow-lg transition-shadow">
            <CardContent class="p-3 sm:p-4 md:p-6">
              <h2 class="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">레벨 선택</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                A, B, C 레벨 중 학습할 단어 레벨을 선택하세요.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/level-test" class="block">
          <Card class="h-full hover:shadow-lg transition-shadow">
            <CardContent class="p-3 sm:p-4 md:p-6">
              <h2 class="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">레벨 테스트</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                테스트를 통해 적합한 단어 학습 레벨을 찾아보세요.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/memorize" class="block">
          <Card class="h-full hover:shadow-lg transition-shadow">
            <CardContent class="p-3 sm:p-4 md:p-6">
              <h2 class="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">단어 암기</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                효과적인 방법으로 단어를 암기하세요.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/game" class="block">
          <Card class="h-full hover:shadow-lg transition-shadow">
            <CardContent class="p-3 sm:p-4 md:p-6">
              <h2 class="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">단어 게임</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                게임을 통해 재미있게 단어를 학습하세요.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <footer class="mt-auto pt-4 sm:pt-6 md:pt-8 border-t text-center">
        <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <h3 class="font-medium mb-1 sm:mb-2">About the Developer</h3>
          <p>이 애플리케이션은 대학생들의 토익 영어 단어 학습을 돕기 위해 개발되었습니다.</p>
          <p class="mt-2 sm:mt-4 text-xs">© 2025 College Vocabulary Builder. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}