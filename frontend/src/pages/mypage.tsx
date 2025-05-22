import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Trophy, BookOpen, GamepadIcon as GameController } from "lucide-react"
import { mockWords } from "@/lib/mock-data"
import HistoryUnitButton from "@/components/history/history-unit-button"
import HistoryGameButton from "@/components/history/history-game-button"
import ExampleCard from "@/components/examples/example-card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import type { Example } from "@/lib/types"

export default function MyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookmarkedWords, setBookmarkedWords] = useState(mockWords.filter((word) => word.bookmarked))
  const [selectedWords, setSelectedWords] = useState<string[]>([])

  // 회원 정보 수정 상태
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 북마크 데이터 선택 후 게임 화면으로 전환
  const handleStartGame = () => {
    if (selectedWords.length > 0) {
      // 선택된 단어를 로컬스토리지 또는 상태 관리 라이브러리로 전달하거나
      // query string이나 state로 넘길 수도 있음
      localStorage.setItem("selectedWords", JSON.stringify(selectedWords))
      navigate("/game/bookmarked")
    } else {
      alert("게임을 시작하려면 단어를 선택해주세요.")
    }
  }


  // 예문 데이터 (실제로는 API에서 가져와야 함)
  const [examples, setExamples] = useState<Example[]>([
    { id: "1", word: "apple", example: "I eat an apple every day." },
    { id: "2", word: "apple", example: "The apple fell from the tree." },
    { id: "3", word: "apple", example: "She gave me a red apple." },
    { id: "4", word: "banana", example: "She likes to eat bananas for breakfast." },
    { id: "5", word: "banana", example: "The banana was perfectly ripe." },
    { id: "6", word: "computer", example: "I need to buy a new computer for work." },
    { id: "7", word: "computer", example: "The computer crashed during the presentation." },
    { id: "8", word: "education", example: "Education is important for personal growth." },
    { id: "9", word: "vocabulary", example: "Expanding your vocabulary helps with language learning." },
  ])

  // 단어별로 예문 그룹화
  const groupedExamples = useMemo(() => {
    const grouped: Record<string, Example[]> = {}
    examples.forEach((example) => {
      if (!grouped[example.word]) {
        grouped[example.word] = []
      }
      grouped[example.word].push(example)
    })
    return grouped
  }, [examples])

  // 랭킹 데이터 (실제로는 API에서 가져와야 함)
  const rankings = [
    { id: 1, name: "김영어", exp: 9850, level: "B2", correctRate: 92 },
    { id: 2, name: "이단어", exp: 8720, level: "B1", correctRate: 88 },
    { id: 3, name: user?.name || "박학습", exp: user?.exp || 7650, level: user?.level || "A2", correctRate: 85 },
    { id: 4, name: "최게임", exp: 6540, level: "B1", correctRate: 82 },
    { id: 5, name: "정랭킹", exp: 5430, level: "A1", correctRate: 79 },
    { id: 6, name: "강경험", exp: 4320, level: "A2", correctRate: 76 },
    { id: 7, name: "조포인트", exp: 3210, level: "B2", correctRate: 73 },
    { id: 8, name: "윤성취", exp: 2100, level: "C1", correctRate: 70 },
  ]

  // 사용자의 랭킹 인덱스 찾기
  const userRankIndex = rankings.findIndex((rank) => rank.name === user?.name)

  // 사용자 주변 랭킹 (위아래 5명)
  const getNearbyRankings = () => {
    if (userRankIndex === -1) return rankings.slice(0, 10)

    const start = Math.max(0, userRankIndex - 5)
    const end = Math.min(rankings.length, userRankIndex + 6)
    return rankings.slice(start, end)
  }

  // 학습 이력 데이터 (실제로는 API에서 가져와야 함)
  const learningHistory = {
    completedUnits: [
      { level: "A1", unit: 1, date: "2023-04-01" },
      { level: "A1", unit: 2, date: "2023-04-03" },
      { level: "A2", unit: 1, date: "2023-04-10" },
    ],
    completedGames: [
      { level: "A1", unit: 1, score: 90, date: "2023-04-02" },
      { level: "A1", unit: 2, score: 85, date: "2023-04-04" },
      { level: "A2", unit: 1, score: 75, date: "2023-04-11" },
      { level: "Daily", score: 100, date: "2023-04-15" },
    ],
  }

  const handleRemoveBookmark = (wordId: string) => {
    setBookmarkedWords(bookmarkedWords.filter((word) => word.id !== wordId))
  }



  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제 구현에서는 API 호출로 프로필 업데이트
    alert("프로필이 업데이트되었습니다.")
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="ranking">랭킹 정보</TabsTrigger>
            <TabsTrigger value="bookmarks">북마크</TabsTrigger>
            <TabsTrigger value="examples">생성된 예문</TabsTrigger>
            <TabsTrigger value="history">학습 이력</TabsTrigger>
          </TabsList>

          {/* 프로필 탭 */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>회원 정보 수정</CardTitle>
                <CardDescription>개인 정보와 비밀번호를 변경할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>

                  <Button type="submit" className="dark:bg-blue-700 dark:hover:bg-blue-600">
                    저장
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 랭킹 정보 탭 */}
          <TabsContent value="ranking">
            <Card>
              <CardHeader>
                <CardTitle>나의 랭킹 정보</CardTitle>
                <CardDescription>현재 랭킹과 주변 사용자들의 정보를 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-blue-500">
                      <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                      <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <p className="text-muted-foreground dark:text-gray-400">
                        현재 랭킹: {userRankIndex !== -1 ? userRankIndex + 1 : "정보 없음"}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">경험치</p>
                          <p className="font-medium">{user.exp.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">레벨</p>
                          <p className="font-medium">{user.level}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">정답률</p>
                          <p className="font-medium">{user.correctRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-4">주변 랭킹</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="w-12 dark:text-gray-300">순위</TableHead>
                      <TableHead className="dark:text-gray-300">사용자</TableHead>
                      <TableHead className="dark:text-gray-300">경험치</TableHead>
                      <TableHead className="dark:text-gray-300">학습 레벨</TableHead>
                      <TableHead className="dark:text-gray-300">정답률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getNearbyRankings().map((rank, index) => {
                      const isCurrentUser = rank.name === user.name
                      return (
                        <TableRow
                          key={rank.id}
                          className={`dark:border-gray-700 ${isCurrentUser ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                        >
                          <TableCell className="dark:text-gray-300">
                            <div className="flex items-center justify-center">
                              {index < 3 ? (
                                <Trophy
                                  className={`h-5 w-5 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"}`}
                                />
                              ) : (
                                index + 1
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                                <AvatarFallback>{rank.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className={`${isCurrentUser ? "font-bold" : ""} dark:text-gray-300`}>
                                {rank.name} {isCurrentUser && "(나)"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{rank.exp.toLocaleString()}</TableCell>
                          <TableCell className="dark:text-gray-300">{rank.level}</TableCell>
                          <TableCell className="dark:text-gray-300">{rank.correctRate}%</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 북마크 탭 */}
          <TabsContent value="bookmarks">
            <Card>
              <CardHeader>
                <CardTitle>북마크된 단어</CardTitle>
                <CardDescription>저장한 단어들을 확인하고 관리할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {bookmarkedWords.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:border-gray-700">
                          <TableHead className="w-8 dark:text-gray-300">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedWords(bookmarkedWords.map((w) => w.word))
                                } else {
                                  setSelectedWords([])
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead className="dark:text-gray-300">영단어</TableHead>
                          <TableHead className="dark:text-gray-300">의미</TableHead>
                          <TableHead className="dark:text-gray-300">레벨</TableHead>
                          <TableHead className="w-12 dark:text-gray-300"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookmarkedWords.map((word) => (
                          <TableRow key={word.id} className="dark:border-gray-700">
                            <TableCell className="w-8">
                              <input
                                type="checkbox"
                                checked={selectedWords.includes(word.word)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedWords([...selectedWords, word.word])
                                  } else {
                                    setSelectedWords(selectedWords.filter((w) => w !== word.word))
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium dark:text-gray-300">{word.word}</TableCell>
                            <TableCell className="dark:text-gray-300">{word.meaning}</TableCell>
                            <TableCell className="dark:text-gray-300">{word.level}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveBookmark(word.id)}
                                className="h-8 w-8"
                              >
                                <Bookmark className="h-4 w-4 fill-current" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* ✅ 게임 시작 버튼을 테이블 밖에 위치시킴 */}
                    <div className="text-right mt-4">
                      <Button
                        onClick={handleStartGame}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        선택한 단어로 게임 시작
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground dark:text-gray-400">북마크된 단어가 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* 생성된 예문 탭 */}
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>생성된 예문</CardTitle>
                <CardDescription>단어 학습 중 생성한 예문을 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(groupedExamples).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(groupedExamples).map(([word, wordExamples]) => (
                      <ExampleCard key={word} word={word} examples={wordExamples} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground dark:text-gray-400">생성된 예문이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 학습 이력 탭 */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>학습 이력</CardTitle>
                <CardDescription>완료한 학습과 게임 기록을 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      완료한 학습 유닛
                    </h3>
                    {learningHistory.completedUnits.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {learningHistory.completedUnits.map((unit, index) => (
                          <HistoryUnitButton key={index} unit={unit} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground dark:text-gray-400">완료한 학습이 없습니다.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <GameController className="h-5 w-5 mr-2" />
                      완료한 게임
                    </h3>
                    {learningHistory.completedGames.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {learningHistory.completedGames.map((game, index) => (
                          <HistoryGameButton key={index} game={game} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground dark:text-gray-400">완료한 게임이 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
