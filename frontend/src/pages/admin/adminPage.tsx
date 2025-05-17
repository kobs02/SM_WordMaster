import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Minus } from "lucide-react"
import type { CEFRLevel } from "@/lib/types"
import { mockWords } from "@/lib/mock-data"

export default function AdminPage() {
  const [words, setWords] = useState(mockWords)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWords, setNewWords] = useState<Array<{ spelling: string; mean: string; level: CEFRLevel }>>([])
  const [editingWordId, setEditingWordId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleSelectWord = (wordId: string) => {
    if (selectedWords.includes(wordId)) {
      setSelectedWords(selectedWords.filter((id) => id !== wordId))
    } else {
      setSelectedWords([...selectedWords, wordId])
    }
  }

  const handleDeleteWords = () => {
    if (selectedWords.length !== 20) {
      alert("20개 단위로 선택해주세요.")
      return
    }

    setWords(words.filter((word) => !selectedWords.includes(word.id)))
    setSelectedWords([])
  }

  const handleAddNewWord = () => {
    if (newWords.length !== 20) {
      alert("20개 단위로 추가해주세요.")
      return
    }

    const wordsToAdd = newWords.map((word, index) => ({
      id: `new-${Date.now()}-${index}`,
      spelling: word.spelling,
      mean: word.mean,
      level: word.level,
      bookmarked: false,
    }))

    setWords([...words, ...wordsToAdd])
    setNewWords([])
    setIsAddDialogOpen(false)
  }

  const handleAddWordField = () => {
    setNewWords([...newWords, { spelling: "", mean: "", level: "A1" }])
  }

  const updateNewWord = (index: number, field: string, value: string) => {
    const updatedWords = [...newWords]
    updatedWords[index] = { ...updatedWords[index], [field]: value }
    setNewWords(updatedWords)
  }

  const handleDoubleClick = (wordId: string, field: "word" | "mean", value: string) => {
    setEditingWordId(wordId)
    setEditValue(value)
  }

  const handleEditSave = (wordId: string, field: "word" | "mean") => {
    setWords(words.map((word) => (word.id === wordId ? { ...word, [field]: editValue } : word)))
    setEditingWordId(null)
    setEditValue("")
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">단어 관리</h2>
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">선택된 단어: {selectedWords.length}개</span>
            {selectedWords.length > 0 && selectedWords.length !== 20 && (
              <span className="text-sm text-red-500 dark:text-red-400">20개 단위로 선택해주세요</span>
            )}
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={selectedWords.length !== 20}
                  title="삭제 버튼"
                  className="dark:border-gray-600 dark:text-gray-200"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark:bg-gray-800 dark:text-gray-100">
                <AlertDialogHeader>
                  <AlertDialogTitle>단어 삭제</AlertDialogTitle>
                  <AlertDialogDescription className="dark:text-gray-300">
                    선택한 20개의 단어를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    아니오
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteWords} className="dark:bg-red-700 dark:hover:bg-red-600">
                    네
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  title="추가 버튼"
                  className="dark:border-gray-600 dark:text-gray-200"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:text-gray-100">
                <DialogHeader>
                  <DialogTitle>단어 추가</DialogTitle>
                  <DialogDescription className="dark:text-gray-300">
                    20개 단위로 단어를 추가해주세요. 현재 {newWords.length}개 추가됨.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                  {newWords.map((word, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <Input
                          placeholder="영단어"
                          value={word.spelling}
                          onChange={(e) => updateNewWord(index, "word", e.target.value)}
                          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                        />
                      </div>
                      <div className="col-span-5">
                        <Input
                          placeholder="한글 뜻"
                          value={word.mean}
                          onChange={(e) => updateNewWord(index, "mean", e.target.value)}
                          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                        />
                      </div>
                      <div className="col-span-2">
                        <Select value={word.level} onValueChange={(value) => updateNewWord(index, "level", value)}>
                          <SelectTrigger className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                            <SelectValue placeholder="레벨" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                            <SelectItem value="A1">A1</SelectItem>
                            <SelectItem value="A2">A2</SelectItem>
                            <SelectItem value="B1">B1</SelectItem>
                            <SelectItem value="B2">B2</SelectItem>
                            <SelectItem value="C1">C1</SelectItem>
                            <SelectItem value="C2">C2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}

                  {newWords.length < 20 && (
                    <Button
                      variant="outline"
                      onClick={handleAddWordField}
                      className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      단어 추가 ({newWords.length}/20)
                    </Button>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleAddNewWord}
                    disabled={newWords.length !== 20}
                    className="dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="border rounded-md dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="w-12 dark:text-gray-300"></TableHead>
              <TableHead className="dark:text-gray-300">영단어</TableHead>
              <TableHead className="dark:text-gray-300">한글 뜻</TableHead>
              <TableHead className="dark:text-gray-300">레벨</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((word) => (
              <TableRow key={word.id} className="dark:border-gray-700">
                <TableCell className="dark:text-gray-300">
                  <Checkbox
                    checked={selectedWords.includes(word.id)}
                    onCheckedChange={() => handleSelectWord(word.id)}
                    className="dark:border-gray-500"
                  />
                </TableCell>
                <TableCell
                  onDoubleClick={() => handleDoubleClick(word.id, "word", word.spelling)}
                  className="cursor-pointer dark:text-gray-300"
                >
                  {editingWordId === word.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSave(word.id, "word")
                        }
                      }}
                      autoFocus
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  ) : (
                    word.spelling
                  )}
                </TableCell>
                <TableCell
                  onDoubleClick={() => handleDoubleClick(word.id, "mean", word.mean)}
                  className="cursor-pointer dark:text-gray-300"
                >
                  {editingWordId === word.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSave(word.id, "mean")
                        }
                      }}
                      autoFocus
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  ) : (
                    word.mean
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">{word.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
