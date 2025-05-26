import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Sentence } from "@/lib/types"

interface ExampleCardProps {
  word: string
  examples: Sentence[]
}

export default function ExampleCard({ word, examples = []}: ExampleCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < examples.length - 1 ? prev + 1 : prev))
  }

  const current = examples[currentIndex]

  return (
    <div className="p-4 border rounded-md dark:border-gray-700 space-y-2">
      <div className="flex justify-between items-start">
        <p className="font-medium dark:text-gray-200"><b>{word}</b></p>
        <span className="text-xs text-muted-foreground dark:text-gray-400">
          {currentIndex + 1}/{examples.length}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-gray-800 dark:text-gray-100">{current.sentence}</p>
        <p className="text-muted-foreground text-sm dark:text-gray-400">{current.translation}</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          {examples.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex === examples.length - 1}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
