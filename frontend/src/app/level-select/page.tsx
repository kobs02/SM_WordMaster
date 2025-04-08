import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, BookOpen, Award, Zap } from "lucide-react"

export default function LevelSelectPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const levels = [
    {
      id: "A",
      title: "초급 (A)",
      description: "기초 영어 단어 500개",
      details: "일상 생활에서 자주 사용되는 기본적인 단어들로 구성되어 있습니다.",
      icon: BookOpen,
    },
    {
      id: "B",
      title: "중급 (B)",
      description: "중급 영어 단어 1000개",
      details: "대학 교재와 일반 영어 시험에 자주 등장하는 단어들로 구성되어 있습니다.",
      icon: Award,
    },
    {
      id: "C",
      title: "고급 (C)",
      description: "고급 영어 단어 1500개",
      details: "전문적인 분야와 학술 논문에서 사용되는 고급 단어들로 구성되어 있습니다.",
      icon: Zap,
    },
  ]

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Link to="/">
          <button className="h-8 w-8 sm:h-10 sm:w-10 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Back to home</span>
          </button>
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2">레벨 선택</h1>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8">
        학습하고자 하는 단어 레벨을 선택하세요. 자신의 영어 실력에 맞는 레벨을 선택하는 것이 효과적입니다. 레벨을
        모르시겠다면{" "}
        <Link to="/level-test" className="text-blue-600 dark:text-blue-400 hover:underline">
          레벨 테스트
        </Link>
        를 먼저 진행해보세요.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`cursor-pointer transition-all border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 ${
              selectedLevel === level.id ? "ring-2 ring-blue-500 dark:ring-blue-400" : "hover:shadow-md"
            }`}
            onClick={() => setSelectedLevel(level.id)}
          >
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-0 sm:pb-0 md:pb-0 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">{level.title}</h3>
                <level.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{level.description}</p>
            </div>
            <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
              <p className="text-xs sm:text-sm">{level.details}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          disabled={!selectedLevel}
          onClick={() => {
            if (selectedLevel) {
              window.location.to = `/memorize?level=${selectedLevel}`
            }
          }}
          className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          학습 시작하기
        </button>
      </div>
    </div>
  )
}