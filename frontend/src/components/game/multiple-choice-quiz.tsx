import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Word } from "@/lib/types"

interface MultipleChoiceQuizProps {
  word: Word
  allWords: Word[]
  onAnswer: (isCorrect: boolean) => void
  isLast: boolean // ✅ 마지막 단어 여부
}

export default function MultipleChoiceQuiz({ word, allWords, onAnswer, isLast }: MultipleChoiceQuizProps) {
  const [options, setOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>("")

  useEffect(() => {
    const otherOptions = allWords
      .filter((w) => w.id !== word.id)
      .map((w) => w.meaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    const allOptions = [...otherOptions, word.meaning].sort(() => 0.5 - Math.random())

    setOptions(allOptions)
    setSelectedOption("")
  }, [word, allWords])

  const handleSubmit = () => {
    onAnswer(selectedOption === word.meaning)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{word.word}</h2>
        <p className="text-muted-foreground dark:text-gray-400">이 단어의 뜻을 선택하세요</p>
      </div>

      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-3 rounded-md border dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <RadioGroupItem value={option} id={`option-${index}`} className="dark:border-gray-500" />
            <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer dark:text-gray-200">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleSubmit}
        disabled={!selectedOption}
        className="w-full dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        {isLast ? "제출" : "다음"}
      </Button>
    </div>
  )
}
