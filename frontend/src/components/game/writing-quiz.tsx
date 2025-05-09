import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Word } from "@/lib/types"

interface WritingQuizProps {
  word: Word
  onAnswer: (isCorrect: boolean) => void
  isLast: boolean
}

export default function WritingQuiz({ word, onAnswer, isLast }: WritingQuizProps) {
  const [answer, setAnswer] = useState("")

  // ✅ 단어가 바뀔 때마다 입력 초기화
  useEffect(() => {
    setAnswer("")
  }, [word])

  const handleSubmit = () => {
    const isCorrect = answer.trim().toLowerCase() === word.word.toLowerCase()
    onAnswer(isCorrect)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{word.meaning}</h2>
        <p className="text-muted-foreground dark:text-gray-400">이 뜻에 해당하는 영단어를 입력하세요</p>
      </div>

      <div className="space-y-4">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="영단어 입력"
          onKeyDown={(e) => {
            if (e.key === "Enter" && answer.trim()) {
              handleSubmit()
            }
          }}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />

        <Button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="w-full dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isLast ? "제출" : "다음"}
        </Button>
      </div>
    </div>
  )
}
