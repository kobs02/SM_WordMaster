import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { mockWords as initialWords } from "@/lib/mock-data"
import WordCard from "@/components/learn/word-card"
import { Button } from "@/components/ui/button"

const UNIT_SIZE = 5

export default function LearnPage() {
  const { level, unitId } = useParams<{ level: string; unitId: string }>()
  const navigate = useNavigate()
  const [words, setWords] = useState<typeof initialWords>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const filtered = initialWords
      .filter((w) => w.level === level)
      .sort((a, b) => a.id.localeCompare(b.id))

    const unitIndex = Number(unitId)
    const start = (unitIndex - 1) * UNIT_SIZE
    const end = start + UNIT_SIZE
    const sliced = filtered.slice(start, end)

    setWords(sliced)
    setCurrentIndex(0)
    setLoading(false)
  }, [level, unitId])

  const handleBookmark = (wordId: string) => {
    const updatedWords = words.map((word) =>
      word.id === wordId ? { ...word, bookmarked: !word.bookmarked } : word
    )
    setWords(updatedWords)

    const indexInMock = initialWords.findIndex((w) => w.id === wordId)
    if (indexInMock !== -1) {
      initialWords[indexInMock] = {
        ...initialWords[indexInMock],
        bookmarked: !initialWords[indexInMock].bookmarked,
      }
    }

    localStorage.setItem("mockWords", JSON.stringify(initialWords))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1))
  }

  const handleStartGame = () => {
    navigate(`/game/${level}/unit/${unitId}`)
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
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                이전
              </Button>

              {isLastWord ? (
                <Button variant="default" onClick={handleStartGame}>
                  게임 시작
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleNext}
                  disabled={false}
                >
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
    </div>
  )
}
