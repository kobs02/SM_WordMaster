import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen } from "lucide-react"

interface GameResultProps {
  score: number
  total: number
  gameType: "quiz" | "matching"
  onRestart: () => void
}

export function GameResult({ score, total, gameType, onRestart }: GameResultProps) {
  const percentage = (score / total) * 100

  let message = ""
  if (gameType === "quiz") {
    message =
      percentage >= 80
        ? "훌륭합니다! 단어를 잘 알고 계시네요."
        : percentage >= 50
          ? "좋은 결과입니다. 조금 더 연습해보세요."
          : "더 많은 연습이 필요합니다. 암기 페이지에서 단어를 학습해보세요."
  } else {
    message =
      percentage >= 80
        ? "훌륭합니다! 단어와 의미를 잘 연결했습니다."
        : percentage >= 50
          ? "좋은 결과입니다. 조금 더 연습해보세요."
          : "더 많은 연습이 필요합니다. 암기 페이지에서 단어를 학습해보세요."
  }

  return (
    <Card>
      <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold">게임 결과</h2>
      </CardHeader>
      <CardContent className="text-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 sm:mb-3 md:mb-4">
          {score} / {total}
        </div>
        <p className="mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base">정확도: {Math.round(percentage)}%</p>
        <p className="mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">{message}</p>
      </CardContent>
      <CardFooter className="flex justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <Button variant="outline" onClick={onRestart}>
          다시 시작
        </Button>
        <Button asChild>
          <a href="/memorize" className="flex items-center">
            <BookOpen className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            단어 암기하기
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface QuizCardProps {
  question: {
    word: string
    options: string[]
    correctAnswer: string
  }
  currentIndex: number
  total: number
  timeLeft: number
  selectedAnswer: string | null
  isCorrect: boolean | null
  onSelectAnswer: (answer: string) => void
}

export function QuizCard({
  question,
  currentIndex,
  total,
  timeLeft,
  selectedAnswer,
  isCorrect,
  onSelectAnswer,
}: QuizCardProps) {
  return (
    <div>
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
          <span>
            문제 {currentIndex + 1} / {total}
          </span>
          <span>시간: {timeLeft}초</span>
        </div>
        <Progress value={(timeLeft / 60) * 100} />
      </div>

      <Card className="mb-4 sm:mb-6 md:mb-8">
        <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-0 sm:pb-2 md:pb-3">
          <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold">{question.word}</h2>
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            이 단어의 의미로 가장 적절한 것을 선택하세요.
          </p>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === option
                    ? isCorrect === true
                      ? "default"
                      : "destructive"
                    : option === question.correctAnswer && selectedAnswer !== null
                      ? "default"
                      : "outline"
                }
                className="justify-start h-auto py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm"
                onClick={() => !selectedAnswer && onSelectAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                <span className="font-semibold mr-1 sm:mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface MatchingCardProps {
  pairs: Array<{
    id: number
    type: string
    content: string
    pairId: number
  }>
  matchedPairs: number[]
  selectedPair: number | null
  timeLeft: number
  onSelectPair: (index: number) => void
}

export function MatchingCard({ pairs, matchedPairs, selectedPair, timeLeft, onSelectPair }: MatchingCardProps) {
  return (
    <div>
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
          <span>
            맞춘 쌍: {matchedPairs.length} / {pairs.length / 2}
          </span>
          <span>시간: {timeLeft}초</span>
        </div>
        <Progress value={(timeLeft / 60) * 100} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
        {pairs.map((pair, index) => (
          <Button
            key={index}
            variant={matchedPairs.includes(pair.pairId) ? "default" : selectedPair === index ? "secondary" : "outline"}
            className="h-16 sm:h-20 md:h-24 flex items-center justify-center text-center text-xs sm:text-sm p-1 sm:p-2"
            onClick={() => onSelectPair(index)}
            disabled={matchedPairs.includes(pair.pairId)}
          >
            {matchedPairs.includes(pair.pairId) || selectedPair === index ? pair.content : "?"}
          </Button>
        ))}
      </div>
    </div>
  )
}