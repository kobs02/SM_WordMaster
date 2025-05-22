import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MultipleChoiceQuiz from "@/components/game/multiple-choice-quiz"
import WritingQuiz from "@/components/game/writing-quiz"
import ResultsTable from "@/components/game/results-table"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import type { Word } from "@/lib/types"

type GameType = "multiple" | "writing"

export default function GamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { level, unitId } = useParams<{ level: string; unitId: string }>()

  const [gameType, setGameType] = useState<GameType | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGameFinished, setIsGameFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ 단어 로딩: location.state 또는 fetch
  useEffect(() => {
    const stateWords = location.state?.words
    const bookmarked = localStorage.getItem("selectedWords")

    if (stateWords && Array.isArray(stateWords)) {
      setWords(stateWords)
      setLoading(false)
    } else if (bookmarked) {
      const parsed = JSON.parse(bookmarked)
      setWords(parsed)
      setLoading(false)
    }

    const fetchWords = async () => {
      try {
        const res = await fetch(`/api/words/by-level-unit?level=${level}&unit=${Number(unitId)}`)
        const data = await res.json()

        // 디버깅용 코드
        console.log("🔍 백엔드에서 받은 단어 데이터:", data) // ✅ 여기 추가

          setWords(data)
          console.log("✅ 단어 목록 로딩 완료:", data)
        } catch (error) {
            console.error("단어 불러오기 실패:", error)
        } finally {
          setLoading(false)
        }
      }

      if (level && unitId) {
          fetchWords()
        }
    /* 디버깅용 코드
    console.log("현재 상태:");
    console.log(" - location.state:", location.state);
    console.log(" - level:", level);
    console.log(" - unitId:", unitId);
    */

  }, [location.state, level, unitId])

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect) {
      setWrongAnswers((prev) => [...prev, words[currentIndex]])
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsGameFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsGameFinished(false)
    setWrongAnswers([])
    setGameType(null)
  }

  const handleSelectGameType = (type: GameType) => {
    setGameType(type)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 mb-50">
        <h1 className="text-2xl font-bold mb-6">
          {level ? `${level} - Unit ${unitId} 게임` : "북마크 단어 게임"}
        </h1>

        {loading ? (
          <div className="text-center">단어를 불러오는 중입니다...</div>
        ) : words.length === 0 ? (
          <div className="text-center text-muted-foreground">단어가 없습니다.</div>
        ) : !gameType ? (
          // ✅ 게임 유형 선택 화면
          <div className="text-center space-y-6">
            <p className="text-lg">어떤 유형으로 게임을 진행할까요?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleSelectGameType("multiple")}>객관식 (영어 → 한글)</Button>
              <Button onClick={() => handleSelectGameType("writing")}>주관식 (한글 → 영어)</Button>
            </div>
          </div>
        ) : !isGameFinished ? (
          // ✅ 게임 진행 중
          <>
            <div className="mb-4 text-sm text-muted-foreground text-right">
              {currentIndex + 1} / {words.length}
            </div>

            <Card className="p-6">
              {gameType === "multiple" ? (
                <MultipleChoiceQuiz
                  word={words[currentIndex]}
                  allWords={words}
                  onAnswer={handleAnswer}
                  isLast={currentIndex === words.length - 1}
                />
              ) : (
                <WritingQuiz
                  word={words[currentIndex]}
                  onAnswer={handleAnswer}
                  isLast={currentIndex === words.length - 1}
                />
              )}
            </Card>
          </>
        ) : (
          // ✅ 게임 완료 결과 화면
          <div className="space-y-8 max-w-md mx-auto text-center">
            <div className="bg-muted p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">게임 결과</h2>
              <div className="text-lg mb-2">
                점수: {Math.round(((words.length - wrongAnswers.length) / words.length) * 100)}점
              </div>
              <div className="text-lg">
                맞은 문제: {words.length - wrongAnswers.length} / {words.length}
              </div>
            </div>

            {wrongAnswers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">오답 노트</h3>
                <ResultsTable words={wrongAnswers} />
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={handleRestart}>다시 시작</Button>
              <Button variant="outline" onClick={() => navigate("/")}>홈으로 이동</Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
