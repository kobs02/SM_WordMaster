import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockWords } from "@/lib/mock-data"
import WritingQuiz from "@/components/game/writing-quiz"
import { Check, X } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function DailyGamePage() {
  const navigate = useNavigate()
  const [dailyWord, setDailyWord] = useState(mockWords[Math.floor(Math.random() * mockWords.length)])
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * mockWords.length)
    setDailyWord(mockWords[randomIndex])
  }, [])

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct)
    setIsAnswered(true)

    if (!correct) {
      console.log("오답 노트에 추가:", dailyWord)
    }
  }

  const handleRestart = () => {
    setIsAnswered(false)
    setIsCorrect(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ✅ main에 relative 추가 */}
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-center">오늘의 단어 게임</h1>

        {/* ✅ 오버레이: main 안에서만 표시 */}
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
                  <p className="text-lg text-muted-foreground">정답: {dailyWord.word}</p>
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
          {!isAnswered && (
            <WritingQuiz word={dailyWord} onAnswer={handleAnswer} isLast />
          )}
        </Card>
      </main>

      <Footer />
    </div>
  )
}
