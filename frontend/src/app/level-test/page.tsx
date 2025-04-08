import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"

// Mock test questions
const testQuestions = [
  {
    id: 1,
    word: "Ambiguous",
    options: [
      { id: "a", text: "명확한, 분명한" },
      { id: "b", text: "모호한, 불분명한" },
      { id: "c", text: "흥미로운, 재미있는" },
      { id: "d", text: "위험한, 위태로운" },
    ],
    correct: "b",
    level: "C",
  },
]

export default function LevelTestPage() {
  const router = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ questionId: number; answer: string; correct: boolean }[]>([])
  const [testComplete, setTestComplete] = useState(false)
  const [result, setResult] = useState<{ level: string; score: number } | null>(null)

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const handleNextQuestion = () => {
    if (selectedOption) {
      const question = testQuestions[currentQuestion]
      const isCorrect = selectedOption === question.correct

      setAnswers([
        ...answers,
        {
          questionId: question.id,
          answer: selectedOption,
          correct: isCorrect,
        },
      ])

      if (currentQuestion < testQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // Calculate result
        const correctAnswers = answers.filter((a) => a.correct).length + (selectedOption === question.correct ? 1 : 0)
        const score = (correctAnswers / testQuestions.length) * 100

        let level = "A"
        if (score >= 80) {
          level = "C"
        } else if (score >= 50) {
          level = "B"
        }

        setResult({ level, score })
        setTestComplete(true)
      }
    }
  }

  const question = testQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100

  return (
    <div className="container max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Link to="/">
          <button className="h-8 w-8 sm:h-10 sm:w-10 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Back to home</span>
          </button>
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2">레벨 테스트</h1>
      </div>

      {!testComplete ? (
        <>
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
              <span>
                문제 {currentQuestion + 1} / {testQuestions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 sm:h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="border rounded-lg shadow-sm mb-4 sm:mb-6 md:mb-8 bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-0 sm:pb-2 md:pb-3 border-b dark:border-gray-700">
              <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold">{question.word}</h2>
              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                이 단어의 의미로 가장 적절한 것을 선택하세요.
              </p>
            </div>
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    className={`justify-start h-auto py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm rounded-md border transition-colors ${
                      selectedOption === option.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <span className="font-semibold mr-1 sm:mr-2">{option.id.toUpperCase()}.</span>
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pt-0 sm:pt-2 md:pt-3 border-t dark:border-gray-700">
              <button
                className="w-full h-8 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!selectedOption}
                onClick={handleNextQuestion}
              >
                {currentQuestion < testQuestions.length - 1 ? "다음 문제" : "결과 확인"}
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-b dark:border-gray-700">
            <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold">테스트 결과</h2>
            <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              당신의 영어 단어 레벨은 다음과 같습니다.
            </p>
          </div>
          <div className="text-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 sm:mb-3 md:mb-4">
              {result?.level}
            </div>
            <p className="mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base">정확도: {Math.round(result?.score || 0)}%</p>
            <div className="mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {result?.level === "A" && "기초 단어부터 차근차근 학습하는 것이 좋겠습니다."}
              {result?.level === "B" && "중급 수준의 단어를 학습하면서 실력을 향상시키세요."}
              {result?.level === "C" && "고급 단어를 학습하여 더 전문적인 영어 실력을 갖추세요."}
            </div>
          </div>
          <div className="flex justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-t dark:border-gray-700">
            <Link to="/">
              <button className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                홈으로
              </button>
            </Link>
            <Link to={`/level-select?recommended=${result?.level}`}>
              <button className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                레벨 선택하기
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}