import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Example } from "@/lib/types"

interface ExampleCardProps {
  word: string
  examples: Example[]
  onRemove: (exampleId: string) => void
}

export default function ExampleCard({ word, examples, onRemove }: ExampleCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < examples.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className="p-4 border rounded-md dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium dark:text-gray-200">{word}</p>
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground dark:text-gray-400 mr-2">
            {currentIndex + 1}/{examples.length}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground dark:text-gray-400 mb-2">{examples[currentIndex].example}</p>

      <div className="flex justify-between items-center mt-2">
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
  )
}