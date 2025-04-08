import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookmarkCheck, Bookmark, ArrowLeft, ArrowRight } from "lucide-react"

interface WordCardProps {
  word: {
    id: number
    word: string
    meaning: string
    example: string
    marked: boolean
  }
  index: number
  total: number
  showMeaning: boolean
  onToggleMeaning: () => void
  onToggleMark: () => void
  onNext: () => void
  onPrevious: () => void
}

export function WordCard({
  word,
  index,
  total,
  showMeaning,
  onToggleMeaning,
  onToggleMark,
  onNext,
  onPrevious,
}: WordCardProps) {
  return (
    <Card className="mb-4 sm:mb-6 md:mb-8">
      <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-0 sm:pb-2 md:pb-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{word.word}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMark}
            className={word.marked ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}
          >
            {word.marked ? (
              <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {index + 1} / {total}
        </p>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {showMeaning ? (
          <div className="space-y-2 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-1 text-xs sm:text-sm">의미:</h3>
              <p className="text-sm sm:text-base md:text-lg">{word.meaning}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-xs sm:text-sm">예문:</h3>
              <p className="italic text-xs sm:text-sm">{word.example}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-20 sm:h-28 md:h-32">
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pt-0 sm:pt-2 md:pt-3">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          이전
        </Button>
        <Button variant="outline" onClick={onToggleMeaning}>
          {showMeaning ? "의미 숨기기" : "의미 보기"}
        </Button>
        <Button variant="outline" onClick={onNext}>
          다음
          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}