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

export default function MyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookmarkedWords, setBookmarkedWords] = useState<BookmarksResponseDto[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [rankings, setRankings] = useState<RankingsResponseDto[]>([])
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);

  // 회원 정보 수정 상태
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 저장 버튼 활성화 조건
  const isFormFilled = useMemo(() => {
    return (
      profileData.name.trim() !== "" &&
      profileData.currentPassword.trim() !== "" &&
      profileData.newPassword.trim() !== "" &&
      profileData.confirmPassword.trim() !== ""
    );
  }, [profileData]);

  // 비밀번호 확인 불일치 여부
  const isPasswordMismatch =
    profileData.newPassword && profileData.confirmPassword &&
    profileData.newPassword !== profileData.confirmPassword;

  const isPasswordValid = useMemo(() => {
    return /^[A-Za-z0-9@]{6,12}$/.test(profileData.newPassword);
  }, [profileData.newPassword]);


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


  // 현재 비밀번호와 실제 비밀번호가 일치하는지 검증 요청
  const validateCurrentPassword = async () => {
    if (!profileData.currentPassword.trim()) return;

    try {
      const res = await fetch(
        `/api/member/checkPassword?password=${encodeURIComponent(profileData.currentPassword)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const json = await res.json();
      if (!json.success) {
        console.warn("검증 실패:", json.message);
        setPasswordMatchError("❗ 비밀번호 검증 실패");
        return;
      }

      if (!json.data) {
        setPasswordMatchError("현재 비밀번호가 올바르지 않습니다.");
      } else {
        setPasswordMatchError(null);
      }
    } catch (err) {
      console.error("비밀번호 확인 오류", err);
      setPasswordMatchError("❗ 서버 오류로 비밀번호 확인에 실패했습니다.");
    }
  };


  const fetchSentence = async () => {
      if (!user) return null;
      try {
          const response = await fetch(`/api/sentence/getAllByUser?loginId=${user!.loginId}`);

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
      const res = await fetch(`/api/bookmarks/getAllByUser?loginId=${encodeURIComponent(user?.loginId)}`);
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
          const res = await fetch(`/api/ranking/get?loginId=${encodeURIComponent(user?.loginId)}`)
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

  // 경험치 기준으로 공동 순위 계산된 rankingsWithRank 반환
  const rankingsWithRank = useMemo(() => {
    const sorted = [...rankings].sort((a, b) => b.exp - a.exp)

    let lastExp: number | null = null
    let lastRank = 0
    let skip = 0

    return sorted.map((r, idx) => {
      if (r.exp === lastExp) {
        skip += 1
      } else {
        lastRank = lastRank + skip + 1
        skip = 0
      }

      lastExp = r.exp

      return { ...r, rank: lastRank }
    })
  }, [rankings])

  // 사용자의 랭킹 인덱스 찾기
  const userRankIndex = rankingsWithRank.find((r) => r.name === user?.name)?.rank;

  const handleRemoveBookmark = async (spelling: string) => {
      if (!user) return null;
    try {
      const res = await fetch(`/api/bookmarks/delete`, {
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


  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("name", profileData.name);
      params.append("password", profileData.newPassword); // or currentPassword + newPassword 둘 다 보내고 싶다면 분리 필요

      const res = await fetch("/api/member", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include", // 세션 사용 시 필수
        body: params.toString(),
      });

      if (res.ok) {
        alert("프로필이 업데이트되었습니다.");
      } else {
        const error = await res.json();
        alert(`업데이트 실패: ${error.message || res.status}`);
      }
    } catch (err) {
      console.error("업데이트 요청 중 오류 발생:", err);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };


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
                  {/* 이름 */}
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>

                  {/* 현재 비밀번호 */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      onBlur={validateCurrentPassword} // 입력 후 포커스 벗어나면 확인
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                    {passwordMatchError && (
                      <p className="text-sm text-red-500">{passwordMatchError}</p>
                    )}
                  </div>

                  {/* 새 비밀번호 */}
                  {/* 새 비밀번호 */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                    {profileData.newPassword &&
                      !/^[A-Za-z0-9@]{6,12}$/.test(profileData.newPassword) && (
                        <p className="text-sm text-red-500">
                          비밀번호는 6~12자 사이의 영문, 숫자, @만 사용 가능합니다.
                        </p>
                    )}
                  </div>

                  {/* 새 비밀번호 확인 */}
                  {profileData.newPassword && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      />
                      {isPasswordMismatch && (
                        <p className="text-sm text-red-500">새 비밀번호가 일치하지 않습니다.</p>
                      )}
                    </div>
                  )}


                  {/* 저장 버튼 */}
                  <Button
                    type="submit"
                    className="dark:bg-blue-700 dark:hover:bg-blue-600"
                    disabled={!isFormFilled || isPasswordMismatch || !!passwordMatchError || !isPasswordValid }
                  >
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
                        현재 랭킹: {userRankIndex !== -1 ? userRankIndex : "정보 없음"}위
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
                    {rankingsWithRank.map((rank) => {
                      const isCurrentUser = rank.name === user?.name;
                      return (
                        <TableRow
                          key={rank.name}
                          className={`dark:border-gray-700 ${isCurrentUser ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                        >
                          <TableCell className="dark:text-gray-300">
                            <div className="flex items-center justify-center">
                              {rank.rank <= 3 ? (
                                <Trophy
                                  className={`h-5 w-5 ${
                                    rank.rank === 1
                                      ? "text-yellow-500"
                                      : rank.rank === 2
                                      ? "text-gray-400"
                                      : "text-amber-700"
                                  }`}
                                />
                              ) : (
                                rank.rank
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
                      );
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
