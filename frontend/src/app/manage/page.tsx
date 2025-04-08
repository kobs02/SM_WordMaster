import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LevelTabs } from "@/components/level-tabs"
import { SearchBar } from "@/components/search-bar"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { WordForm } from "@/components/word-form"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Pencil, Trash2 } from "lucide-react"

// Mock vocabulary data (same structure as in other pages)
const initialVocabularyData = {
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

export default function ManagePage() {
  const [level, setLevel] = useState<"A" | "B" | "C">("A")
  const [vocabularyData, setVocabularyData] = useState(initialVocabularyData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVocab, setFilteredVocab] = useState(vocabularyData[level])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentWord, setCurrentWord] = useState<any>(null)
  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
    example: "",
    level: "A" as "A" | "B" | "C",
  })

  useEffect(() => {
    const filtered = vocabularyData[level].filter(
      (item) =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredVocab(filtered)
  }, [level, searchTerm, vocabularyData])

  const handleAddWord = () => {
    const newId =
      Math.max(
        ...Object.values(vocabularyData)
          .flat()
          .map((item) => item.id),
        0,
      ) + 1

    const newWord = {
      id: newId,
      word: formData.word,
      meaning: formData.meaning,
      example: formData.example,
    }

    setVocabularyData({
      ...vocabularyData,
      [formData.level]: [...vocabularyData[formData.level], newWord],
    })

    setFormData({
      word: "",
      meaning: "",
      example: "",
      level: "A",
    })

    setIsAddDialogOpen(false)
  }

  const handleEditWord = () => {
    if (!currentWord) return

    // If level changed, remove from old level and add to new level
    if (formData.level !== level) {
      const updatedOldLevel = vocabularyData[level].filter((item) => item.id !== currentWord.id)
      const updatedNewLevel = [
        ...vocabularyData[formData.level],
        {
          id: currentWord.id,
          word: formData.word,
          meaning: formData.meaning,
          example: formData.example,
        },
      ]

      setVocabularyData({
        ...vocabularyData,
        [level]: updatedOldLevel,
        [formData.level]: updatedNewLevel,
      })
    } else {
      // Update in the same level
      const updatedLevel = vocabularyData[level].map((item) =>
        item.id === currentWord.id
          ? {
              ...item,
              word: formData.word,
              meaning: formData.meaning,
              example: formData.example,
            }
          : item,
      )

      setVocabularyData({
        ...vocabularyData,
        [level]: updatedLevel,
      })
    }

    setIsEditDialogOpen(false)
  }

  const handleDeleteWord = () => {
    if (!currentWord) return

    const updatedLevel = vocabularyData[level].filter((item) => item.id !== currentWord.id)

    setVocabularyData({
      ...vocabularyData,
      [level]: updatedLevel,
    })

    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (word: any) => {
    setCurrentWord(word)
    setFormData({
      word: word.word,
      meaning: word.meaning,
      example: word.example,
      level: level,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (word: any) => {
    setCurrentWord(word)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2">단어 관리</h1>
      </div>

      <div className="mb-4 sm:mb-6">
        <LevelTabs currentLevel={level} onLevelChange={(value) => setLevel(value as "A" | "B" | "C")} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="relative w-full sm:max-w-sm">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="단어 또는 의미 검색..." />
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          단어 추가
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px] sm:w-[200px]">단어</TableHead>
            <TableHead className="w-[180px] sm:w-[300px]">의미</TableHead>
            <TableHead>예문</TableHead>
            <TableHead className="w-[80px] sm:w-[100px] text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVocab.length > 0 ? (
            filteredVocab.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.word}</TableCell>
                <TableCell>{item.meaning}</TableCell>
                <TableCell className="truncate max-w-[150px] sm:max-w-none">{item.example}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                {searchTerm ? "검색 결과가 없습니다." : "단어가 없습니다. 새 단어를 추가해보세요."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 단어 추가</DialogTitle>
            <DialogDescription>새로운 단어와 의미, 예문을 입력하세요.</DialogDescription>
          </DialogHeader>
          <WordForm
            formData={formData}
            onChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleAddWord}
            onCancel={() => setIsAddDialogOpen(false)}
            submitLabel="추가"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>단어 수정</DialogTitle>
            <DialogDescription>단어의 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          <WordForm
            formData={formData}
            onChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleEditWord}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="저장"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="단어 삭제"
        description="정말로 이 단어를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteWord}
        variant="destructive"
      >
        {currentWord && (
          <div className="border rounded-md p-3 sm:p-4 text-xs sm:text-sm">
            <p>
              <strong>단어:</strong> {currentWord.word}
            </p>
            <p>
              <strong>의미:</strong> {currentWord.meaning}
            </p>
            <p>
              <strong>예문:</strong> {currentWord.example}
            </p>
          </div>
        )}
      </ConfirmDialog>
    </div>
  )
}