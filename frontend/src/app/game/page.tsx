import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Trophy, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LevelTabs } from "@/components/level-tabs"
import { GameTypeSelector } from "@/components/game-type-selector"
import { QuizCard, MatchingCard, GameResult } from "@/components/game-card"

// Mock vocabulary data (same as in memorize page)
const vocabularyData = {
  A: [
    { id: 1, word: "Happy", meaning: "행복한", example: "I am happy to see you." },
    { id: 2, word: "Sad", meaning: "슬픈", example: "She felt sad after watching the movie." },
    { id: 3, word: "Good", meaning: "좋은", example: "This is a good book." },
    { id: 4, word: "Bad", meaning: "나쁜", example: "That was a bad decision." },
    { id: 5, word: "Big", meaning: "큰", example: "He lives in a big house." },
  ],
  B: [
    { id: 6, word: "Collaborate", meaning: "협력하다", example: "We need to collaborate on this project." },
    { id: 7, word: "Efficient", meaning: "효율적인", example: "This is a more efficient way to solve the problem." },
    {
      id: 8,
      word: "Implement",
      meaning: "시행하다, 구현하다",
      example: "We will implement the new policy next month.",
    },
    { id: 9, word: "Negotiate", meaning: "협상하다", example: "They will negotiate the terms of the contract." },
    { id: 10, word: "Perspective", meaning: "관점, 시각", example: "From my perspective, this is the right decision." },
  ],
  C: [
    {
      id: 11,
      word: "Ambiguous",
      meaning: "모호한, 불분명한",
      example: "The instructions were ambiguous and confusing.",
    },
    {
      id: 12,
      word: "Eloquent",
      meaning: "웅변적인, 유창한",
      example: "She gave an eloquent speech at the conference.",
    },
    { id: 13, word: "Meticulous", meaning: "꼼꼼한, 세심한", example: "He is meticulous about his work." },
    {
      id: 14,
      word: "Paradigm",
      meaning: "패러다임, 모범",
      example: "This discovery represents a paradigm shift in our understanding.",
    },
    {
      id: 15,
      word: "Ubiquitous",
      meaning: "어디에나 있는, 편재하는",
      example: "Smartphones have become ubiquitous in modern society.",
    },
  ],
}

type GameType = "matching" | "quiz"

export default function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const levelParam = searchParams.get("level") || "A"

  const [level, setLevel] = useState(levelParam)
  const [gameType, setGameType] = useState<GameType>("matching")
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // For matching game
  const [matchPairs, setMatchPairs] = useState<any[]>([])
  const [selectedPair, setSelectedPair] = useState<number | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setGameCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, gameCompleted])

  const prepareQuizGame = () => {
    const vocab = vocabularyData[level as keyof typeof vocabularyData]
    const shuffled = [...vocab].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 5)

    const questions = selected.map((item) => {
      // Create wrong options by getting random meanings from other words
      const otherMeanings = vocab
        .filter((v) => v.id !== item.id)
        .map((v) => v.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)

      const options = [item.meaning, ...otherMeanings].sort(() => 0.5 - Math.random())

      return {
        word: item.word,
        options,
        correctAnswer: item.meaning,
      }
    })

    setQuestions(questions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeLeft(60)
    setGameStarted(true)
    setGameCompleted(false)
  }

  const prepareMatchingGame = () => {
    const vocab = vocabularyData[level as keyof typeof vocabularyData]
    const shuffled = [...vocab].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 6)

    // Create pairs of words and meanings
    const words = selected.map((item, index) => ({
      id: index,
      type: "word",
      content: item.word,
      pairId: index,
    }))

    const meanings = selected.map((item, index) => ({
      id: index + selected.length,
      type: "meaning",
      content: item.meaning,
      pairId: index,
    }))

    // Shuffle all pairs
    const pairs = [...words, ...meanings].sort(() => 0.5 - Math.random())

    setMatchPairs(pairs)
    setSelectedPair(null)
    setMatchedPairs([])
    setScore(0)
    setTimeLeft(60)
    setGameStarted(true)
    setGameCompleted(false)
  }

  const startGame = () => {
    if (gameType === "quiz") {
      prepareQuizGame()
    } else {
      prepareMatchingGame()
    }
  }

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    const currentQuestion = questions[currentQuestionIndex]
    const correct = answer === currentQuestion.correctAnswer

    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setGameCompleted(true)
      }
    }, 1000)
  }

  const handleMatchingSelection = (index: number) => {
    // If the pair is already matched, do nothing
    if (matchedPairs.includes(matchPairs[index].pairId)) {
      return
    }

    if (selectedPair === null) {
      // First selection
      setSelectedPair(index)
    } else {
      // Second selection - check if it's a match
      const firstSelection = matchPairs[selectedPair]
      const secondSelection = matchPairs[index]

      if (firstSelection.pairId === secondSelection.pairId && firstSelection.type !== secondSelection.type) {
        // It's a match!
        setMatchedPairs([...matchedPairs, firstSelection.pairId])
        setScore(score + 1)

        // Check if all pairs are matched
        if (matchedPairs.length + 1 === matchPairs.length / 2) {
          setGameCompleted(true)
        }
      }

      // Reset selection after a short delay
      setTimeout(() => {
        setSelectedPair(null)
      }, 500)
    }
  }

  const gameTypeOptions = [
    {
      id: "quiz" as const,
      title: "퀴즈 게임",
      description: "단어의 의미를 맞추는 퀴즈 게임입니다. 제한 시간 내에 최대한 많은 문제를 맞춰보세요.",
      icon: Trophy,
    },
    {
      id: "matching" as const,
      title: "매칭 게임",
      description: "단어와 의미를 짝지어 맞추는 게임입니다. 제한 시간 내에 모든 쌍을 맞춰보세요.",
      icon: Timer,
    },
  ]

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2">단어 게임</h1>
      </div>

      {!gameStarted ? (
        <>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8">
            게임을 통해 재미있게 단어를 학습해보세요. 퀴즈 게임과 매칭 게임 중 선택할 수 있습니다.
          </p>

          <div className="mb-4 sm:mb-6">
            <LevelTabs currentLevel={level} onLevelChange={(value) => setLevel(value)} />
          </div>

          <GameTypeSelector options={gameTypeOptions} selectedType={gameType} onSelectType={setGameType} />

          <div className="flex justify-end">
            <Button onClick={startGame}>게임 시작하기</Button>
          </div>
        </>
      ) : gameCompleted ? (
        <GameResult
          score={score}
          total={gameType === "quiz" ? questions.length : matchPairs.length / 2}
          gameType={gameType}
          onRestart={() => {
            setGameStarted(false)
            setGameCompleted(false)
          }}
        />
      ) : gameType === "quiz" ? (
        <QuizCard
          question={questions[currentQuestionIndex]}
          currentIndex={currentQuestionIndex}
          total={questions.length}
          timeLeft={timeLeft}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          onSelectAnswer={handleQuizAnswer}
        />
      ) : (
        <MatchingCard
          pairs={matchPairs}
          matchedPairs={matchedPairs}
          selectedPair={selectedPair}
          timeLeft={timeLeft}
          onSelectPair={handleMatchingSelection}
        />
      )}
    </div>
  )
}