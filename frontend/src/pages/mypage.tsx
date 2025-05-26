import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bookmark, Trophy, BookOpen, GamepadIcon as GameController } from "lucide-react"
import ExampleCard from "@/components/examples/example-card"
import { Header } from "@/components/layout/header"
import type { Sentence, BookmarksResponseDto, RankingsResponseDto, ApiResponse } from "@/lib/types"
const baseURL = import.meta.env.VITE_API_BASE_URL;

export default function MyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookmarkedWords, setBookmarkedWords] = useState<BookmarksResponseDto[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [rankings, setRankings] = useState<RankingsResponseDto[]>([])

  // 회원 정보 수정 상태
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 단어별로 예문 그룹화
  const [sentenceList, setSentenceList] = useState<Sentence[]> ([ {
      id: 0,
     spelling: "",
     sentence: "예문 조회 중입니다.",
     translation: "",
    },
  ]);

  const groupedSentences = sentenceList.reduce((acc, item) => {
    if (!acc[item.spelling]) acc[item.spelling] = [];
    acc[item.spelling].push({
      id: acc[item.spelling].length,
      spelling: item.spelling,
      sentence: item.sentence,
      translation: item.translation,
    });
    return acc;
  }, {} as Record<string, Sentence[]>);


  const fetchSentence = async () => {
      if (!user) return null;
      try {
          const response = await fetch(`${baseURL}/api/sentence/getAllByUser?loginId=${user!.loginId}`);

          if (!response.ok)
              throw new Error("예문 조회 실패");

          const data: ApiResponse<Sentence[]> = await response.json();
          console.log(data);

          if (data.success && data.data) {
              setSentenceList(data.data);
          } else
              setSentenceList([{
                  id: 0,
                  spelling: "",
                  sentence: "data.message",
                  translation: "",
                  },
              ]);
      }
      catch (error) {
          setSentenceList([{
              id: 0,
              spelling: "",
              sentence: "예문을 조회하는 데 실패했어요.",
              translation: ""
              },
          ]);
      }
  }

  const fetchBookmarks = async (loginId: string): Promise<BookmarksResponseDto[] | null> => {
      if (!user) return null;
    try {
      const res = await fetch(`${baseURL}/api/bookmarks/getAllByUser?loginId=${encodeURIComponent(user?.loginId)}`);
      const json: ApiResponse<BookmarksResponseDto[]> = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBookmarkedWords(json.data);
        return json.data;
      } else {
        console.warn("❗ 예상하지 못한 응답 형식:", json);
        return null;
      }
    } catch (error) {
      console.error("🚨 북마크 단어 불러오기 실패:", error);
      return null;
    }
  };

  useEffect(() => {
      if (!user) return;
      fetchSentence();
      fetchBookmarks(user?.loginId);
  },[user]);

  // 랭킹 데이터
  useEffect(() => {
      const fetchRankings = async () => {
        if (!user) return null;

        try {
          const res = await fetch(`${baseURL}/api/ranking/get?loginId=${encodeURIComponent(user?.loginId)}`)
          const json = await res.json()

          if (json.success && Array.isArray(json.data)) {
            setRankings(json.data)
          } else {
            console.warn("❗ 랭킹 응답이 예상과 다릅니다.", json)
          }
        } catch (error) {
          console.error("🚨 랭킹 불러오기 실패:", error)
        }
      }

      fetchRankings()
    }, [user?.loginId])

  // 사용자의 랭킹 인덱스 찾기
  const userRankIndex = rankings.findIndex((rank) => rank.name === user?.name)

  // 사용자 주변 랭킹 (위아래 5명)
  const getNearbyRankings = () => {
    if (userRankIndex === -1) return rankings.slice(0, 10)

    const start = Math.max(0, userRankIndex - 5)
    const end = Math.min(rankings.length, userRankIndex + 6)
    return rankings.slice(start, end)
  }


  const handleRemoveBookmark = async (spelling: string) => {
      if (!user) return null;
    try {
      const res = await fetch(`${baseURL}/api/bookmarks/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: user?.loginId,
          spelling: spelling,
        }),
      });

      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setBookmarkedWords(json.data); // 서버에서 새로 받은 북마크 리스트 반영
      } else {
        console.warn("❗ 북마크 삭제 이후 응답이 예상과 다릅니다:", json);
      }
    } catch (error) {
      console.error("🚨 북마크 삭제 중 오류 발생:", error);
    }
  };


  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
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
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="ranking">랭킹 정보</TabsTrigger>
            <TabsTrigger value="bookmarks">북마크</TabsTrigger>
            <TabsTrigger value="examples">생성된 예문</TabsTrigger>
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
                    <div>
                      <h3 className="text-xl font-bold">{user?.name}</h3>
                      <p className="text-muted-foreground dark:text-gray-400">
                        현재 랭킹: {userRankIndex !== -1 ? userRankIndex + 1 : "정보 없음"}위
                      </p>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="w-12 dark:text-gray-300">순위</TableHead>
                      <TableHead className="dark:text-gray-300">사용자</TableHead>
                      <TableHead className="dark:text-gray-300">경험치</TableHead>
                      <TableHead className="dark:text-gray-300">레벨</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getNearbyRankings().map((rank, index) => {
                      const isCurrentUser = rank.name === user?.name
                      return (
                        <TableRow
                          key={rank.name}
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
                              <span className={`${isCurrentUser ? "font-bold" : ""} dark:text-gray-300`}>
                                {rank.name} {isCurrentUser && "(나)"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{rank.exp.toLocaleString()}</TableCell>
                          <TableCell className="dark:text-gray-300">{rank.rankingLevel}</TableCell>
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
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:border-gray-700">
                        <TableHead className="dark:text-gray-300">영단어</TableHead>
                        <TableHead className="dark:text-gray-300">의미</TableHead>
                        <TableHead className="dark:text-gray-300">레벨</TableHead>
                        <TableHead className="w-12 dark:text-gray-300"></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {bookmarkedWords.map((word) => (
                        <TableRow key={word.spelling} className="dark:border-gray-700">
                          <TableCell className="font-medium dark:text-gray-300">
                            {word.spelling}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{word.mean}</TableCell>
                          <TableCell className="dark:text-gray-300">{word.level}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveBookmark(word.spelling)}
                              className="h-8 w-8"
                              title="북마크 해제"
                            >
                              <Bookmark className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground dark:text-gray-400">
                      북마크된 단어가 없습니다.
                    </p>
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
                {sentenceList.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(groupedSentences).map(([word, examples]) => (
                      <ExampleCard key={word} word={word} examples={examples} />
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
        </Tabs>
      </main>
    </div>
  )
}
