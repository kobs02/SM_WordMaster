import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import WritingQuiz from "@/components/game/writing-quiz"
import { Check, X } from "lucide-react"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import type { Word } from "@/lib/types"

export default function DailyGamePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [dailyWord, setDailyWord] = useState<Word | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const fetchRandomWord = async () => {
      const levels = ["A1", "A2", "B1", "B2"]
      const units = [1, 2]
      const randomLevel = levels[Math.floor(Math.random() * levels.length)]
      const randomUnit = units[Math.floor(Math.random() * units.length)]

      console.log("📡 fetch 시작:", randomLevel, randomUnit)

      try {
        const res = await fetch(`/api/words/by-level-unit?level=${randomLevel}&unit=${randomUnit}`)
        const data: Word[] = await res.json()

        console.log("🔍 백엔드에서 받은 단어 데이터:", data)

        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length)
          setDailyWord(data[randomIndex])
        } else {
          console.warn("선택된 레벨/유닛에 단어 없음")
        }
      } catch (error) {
        console.error("단어 요청 실패:", error)
      }
    }
    fetchRandomWord()
  }, [])

  const updateWrongAnswers = async (wrongWords: Word[]) => {
    if (!wrongWords || wrongWords.length === 0 || !user?.loginId) return

    const spellingList = wrongWords.map((word) => word.spelling)

    try {
      const res = await fetch("/api/wrongAnswers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: user.loginId,
          spellingList,
        }),
      })

      const json = await res.json()
      if (json.success) {
        console.log("✅ 오답 횟수 업데이트 완료")
      } else {
        console.warn("❗오답 업데이트 실패:", json.message)
      }
    } catch (error) {
      console.error("🚨 오답 업데이트 에러:", error)
    }
  }

  // 랭킹 업데이트
  const updateRankings = async (allWords: Word[]) => {
    if (!user?.loginId || !allWords || allWords.length === 0) return

      const wordLevelList = allWords.map((word) => word.level)

      try {
        const res = await fetch("/api/ranking/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loginId: user.loginId, wordLevelList }),
        })

        const json = await res.json()
        if (json.success) {
            console.log("✅ 랭킹 업데이트 완료")
        } else {
            console.warn("❗랭킹 업데이트 실패:", json.message)
          }
        } catch (error) {
          console.error("🚨 랭킹 업데이트 에러:", error)
        }
      }

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct)
    setIsAnswered(true)

    if (!correct && dailyWord) {
      updateWrongAnswers([dailyWord])
    }
    else if (correct && dailyWord) {
        updateRankings([dailyWord])
    }
  }

  const handleRestart = () => {
    setIsAnswered(false)
    setIsCorrect(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-center">오늘의 단어 게임</h1>

        {isAnswered && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 dark:bg-black/80">
            <div className="text-center">
              {isCorrect ? (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="w-12 h-12 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-green-600">정답입니다!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <X className="w-12 h-12 text-red-600" />
                  </div>
                  <p className="text-xl font-bold text-red-600 mb-2">오답입니다!</p>
                  <p className="text-lg text-muted-foreground">정답: {dailyWord?.spelling}</p>
                </div>
              )}
              <div className="flex gap-4 justify-center mt-6">
                <Button variant="outline" onClick={handleRestart}>다시 풀기</Button>
                <Button onClick={() => navigate("/")}>홈으로 이동</Button>
              </div>
            </div>
          </div>
        )}

        <Card className="p-6">
          {!isAnswered && dailyWord && (
            <WritingQuiz word={dailyWord} onAnswer={handleAnswer} isLast />
          )}
        </Card>
      </main>
    </div>
  )
}
