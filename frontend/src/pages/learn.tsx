import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
// import { mockWords as initialWords } from "@/lib/mock-data"
import WordCard from "@/components/learn/word-card"
import { Button } from "@/components/ui/button"

export default function LearnPage() {
  const { level, unitId } = useParams<{ level: string; unitId: string }>()
  const navigate = useNavigate()
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

// 백엔드에 단어 요청 보내기
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(`/api/words/by-level-unit?level=${level}&unit=${Number(unitId)}`)
        const data = await res.json()


        console.log("🔍 백엔드에서 받은 단어 데이터:", data) // ✅ 여기 추가

        setWords(data)
      } catch (error) {
        console.error("단어 불러오기 실패:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchWords()
    console.log("📦 words 상태:", words);
  }, [level, unitId])

  const handleBookmark = (wordId: string) => {
    const updatedWords = words.map((word) =>
      word.id === wordId ? { ...word, bookmarked: !word.bookmarked } : word
    )
    setWords(updatedWords)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1))
  }

  const handleStartGame = () => {
    navigate(`/game/${level}/unit/${unitId}`,{
        state: { words } })
  }

  const currentWord = words[currentIndex]
  const isLastWord = currentIndex === words.length - 1

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {level} - Unit {unitId} 학습
        </h1>

        {loading ? (
          <div>불러오는 중...</div>
        ) : words.length > 0 ? (
          <div className="space-y-6">
            <div className="text-right text-sm text-muted-foreground">
              {currentIndex + 1} / {words.length}
            </div>

            <WordCard word={currentWord} onBookmark={handleBookmark} />

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
                이전
              </Button>

              {isLastWord ? (
                <Button variant="default" onClick={handleStartGame}>
                  게임 시작
                </Button>
              ) : (
                <Button variant="default" onClick={handleNext}>
                  다음
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            단어가 존재하지 않습니다.
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
