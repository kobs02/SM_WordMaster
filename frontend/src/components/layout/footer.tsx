import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Book, Gamepad, Clipboard } from "lucide-react" // lucide-react 아이콘 추가

export function Footer() {
  const { user, logout } = useAuth()

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {user ? (
            // 로그인 후: 사용자/관리자별 화면 구성
            <div className="flex gap-6 justify-center flex-wrap">
              {/* 사용자 화면: 버튼 형태로 학습, 게임, 오답 노트, 랭킹 버튼 구성 */}
              {user.role === "user" ? (
                <>
                  <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                    <CardHeader className="flex items-center gap-4">
                      <Book className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg font-semibold">단어 학습</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-sm text-left">
                      CEFR 기준에 맞는 체계적인 단어 학습을 시작하세요!
                    </CardDescription>
                    <CardFooter>
                      <Link to="/learn">
                        <Button variant="outline" className="w-full mt-2">학습 시작</Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                    <CardHeader className="flex items-center gap-4">
                      <Gamepad className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg font-semibold">일일 게임</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-sm text-left">
                      일일 퀴즈로 재미있는 학습을 해보세요.
                    </CardDescription>
                    <CardFooter>
                      <Link to="/daily-game">
                        <Button variant="outline" className="w-full mt-2">게임 시작</Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                    <CardHeader className="flex items-center gap-4">
                      <Clipboard className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg font-semibold">오답 노트</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-sm text-left">
                      오답을 복습하여 점차 더 나은 학습을 할 수 있습니다.
                    </CardDescription>
                    <CardFooter>
                      <Link to="/wrong-answers">
                        <Button variant="outline" className="w-full mt-2">오답 노트</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </>
              ) : (
                // 관리자 화면: 관리 기능 버튼
                <>
                  <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                    <CardHeader className="flex items-center gap-4">
                      <Book className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg font-semibold">사용자 관리</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-sm text-left">
                      사용자들을 관리하고, 활동을 모니터링하세요.
                    </CardDescription>
                    <CardFooter>
                      <Link to="/admin/users">
                        <Button variant="outline" className="w-full mt-2">사용자 관리</Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                    <CardHeader className="flex items-center gap-4">
                      <Gamepad className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg font-semibold">콘텐츠 관리</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-sm text-left">
                      학습 콘텐츠를 업데이트하고, 관리합니다.
                    </CardDescription>
                    <CardFooter>
                      <Link to="/admin/content">
                        <Button variant="outline" className="w-full mt-2">콘텐츠 관리</Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                    <CardHeader className="flex items-center gap-4">
                      <Clipboard className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg font-semibold">통계 분석</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-sm text-left">
                      서비스 이용 현황 및 통계 자료를 확인합니다.
                    </CardDescription>
                    <CardFooter>
                      <Link to="/admin/statistics">
                        <Button variant="outline" className="w-full mt-2">통계 보기</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </>
              )}
            </div>
          ) : (
            // 로그인 전: 카드 형식으로 주요 기능 소개
            <div className="flex gap-6 justify-center flex-wrap">
              <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                <CardHeader className="flex items-center gap-4">
                  <Book className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg font-semibold">단어 학습</CardTitle>
                </CardHeader>
                <CardDescription className="text-sm text-left">
                  체계적인 영어 단어 학습을 시작하세요. 다양한 학습 방법을 제공하며, 개인 맞춤형 학습을 할 수 있습니다.
                </CardDescription>
              </Card>

              <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                <CardHeader className="flex items-center gap-4">
                  <Gamepad className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg font-semibold">일일 게임</CardTitle>
                </CardHeader>
                <CardDescription className="text-sm text-left">
                  매일 새로운 퀴즈로 학습의 재미를 더하세요. 점수로 경쟁하며 실력을 향상시킬 수 있습니다.
                </CardDescription>
              </Card>

              <Card className="w-full sm:w-[280px] md:w-[300px] h-auto flex flex-col items-start justify-between p-4">
                <CardHeader className="flex items-center gap-4">
                  <Clipboard className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg font-semibold">오답 노트</CardTitle>
                </CardHeader>
                <CardDescription className="text-sm text-left">
                  학습 중 나온 오답을 기록하고, 반복 학습으로 실력을 높이세요.
                </CardDescription>
              </Card>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}


