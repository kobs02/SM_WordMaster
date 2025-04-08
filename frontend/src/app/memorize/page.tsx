import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, GamepadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { WordCard } from "@/components/word-card"
import { LevelTabs } from "@/components/level-tabs"

// Mock vocabulary data
const vocabularyData = {
  A: [
    { id: 1, word: "Happy", meaning: "행복한", example: "I am happy to see you.", marked: false },
    { id: 2, word: "Sad", meaning: "슬픈", example: "She felt sad after watching the movie.", marked: false },
    { id: 3, word: "Good", meaning: "좋은", example: "This is a good book.", marked: false },
    { id: 4, word: "Bad", meaning: "나쁜", example: "That was a bad decision.", marked: false },
    { id: 5, word: "Big", meaning: "큰", example: "He lives in a big house.", marked: false },
  ],
  B: [
    {
      id: 6,
      word: "Collaborate",
      meaning: "협력하다",
      example: "We need to collaborate on this project.",
      marked: false,
    },
    {
      id: 7,
      word: "Efficient",
      meaning: "효율적인",
      example: "This is a more efficient way to solve the problem.",
      marked: false,
    },
    {
      id: 8,
      word: "Implement",
      meaning: "시행하다, 구현하다",
      example: "We will implement the new policy next month.",
      marked: false,
    },
    {
      id: 9,
      word: "Negotiate",
      meaning: "협상하다",
      example: "They will negotiate the terms of the contract.",
      marked: false,
    },
    {
      id: 10,
      word: "Perspective",
      meaning: "관점, 시각",
      example: "From my perspective, this is the right decision.",
      marked: false,
    },
  ],
  C: [
    {
      id: 11,
      word: "Ambiguous",
      meaning: "모호한, 불분명한",
      example: "The instructions were ambiguous and confusing.",
      marked: false,
    },
    {
      id: 12,
      word: "Eloquent",
      meaning: "웅변적인, 유창한",
      example: "She gave an eloquent speech at the conference.",
      marked: false,
    },
    {
      id: 13,
      word: "Meticulous",
      meaning: "꼼꼼한, 세심한",
      example: "He is meticulous about his work.",
      marked: false,
    },
    {
      id: 14,
      word: "Paradigm",
      meaning: "패러다임, 모범",
      example: "This discovery represents a paradigm shift in our understanding.",
      marked: false,
    },
    {
      id: 15,
      word: "Ubiquitous",
      meaning: "어디에나 있는, 편재하는",
      example: "Smartphones have become ubiquitous in modern society.",
      marked: false,
    },
  ],
}

export default function MemorizePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const levelParam = searchParams.get("level") || "A"

  const [level, setLevel] = useState(levelParam)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [vocabulary, setVocabulary] = useState(vocabularyData[level as keyof typeof vocabularyData])
  const [markedOnly, setMarkedOnly] = useState(false)
  const [filteredVocab, setFilteredVocab] = useState(vocabulary)

  useEffect(() => {
    setVocabulary(vocabularyData[level as keyof typeof vocabularyData])
  }, [level])

  useEffect(() => {
    if (markedOnly) {
      setFilteredVocab(vocabulary.filter((word) => word.marked))
      setCurrentIndex(0)
    } else {
      setFilteredVocab(vocabulary)
      setCurrentIndex(0)
    }
  }, [vocabulary, markedOnly])

  const currentWord = filteredVocab[currentIndex]

  const handleNext = () => {
    setShowMeaning(false)
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0) // Loop back to the beginning
    }
  }

  const handlePrevious = () => {
    setShowMeaning(false)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(filteredVocab.length - 1) // Loop to the end
    }
  }

  const toggleMark = () => {
    const updatedVocabulary = [...vocabulary]
    const wordIndex = updatedVocabulary.findIndex((w) => w.id === currentWord.id)
    updatedVocabulary[wordIndex] = {
      ...updatedVocabulary[wordIndex],
      marked: !updatedVocabulary[wordIndex].marked,
    }
    setVocabulary(updatedVocabulary)
  }

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2">단어 암기</h1>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <LevelTabs currentLevel={level} onLevelChange={(value) => setLevel(value)} />
      </div>

      <div className="flex items-center justify-end mb-3 sm:mb-4 space-x-1 sm:space-x-2">
        <Switch id="marked-only" checked={markedOnly} onCheckedChange={setMarkedOnly} />
        <Label htmlFor="marked-only" className="text-xs sm:text-sm">
          표시된 단어만 보기
        </Label>
      </div>

      {filteredVocab.length > 0 ? (
        <WordCard
          word={currentWord}
          index={currentIndex}
          total={filteredVocab.length}
          showMeaning={showMeaning}
          onToggleMeaning={() => setShowMeaning(!showMeaning)}
          onToggleMark={toggleMark}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ) : (
        <div className="border rounded-lg shadow-sm mb-4 sm:mb-6 md:mb-8 bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="pt-4 sm:pt-6 text-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm">표시된 단어가 없습니다.</p>
            <Button onClick={() => setMarkedOnly(false)}>모든 단어 보기</Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/">홈으로</Link>
        </Button>
        <Button asChild>
          <Link to="/game" className="flex items-center">
            <GamepadIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            게임으로 학습하기
          </Link>
        </Button>
      </div>
    </div>
  )
}