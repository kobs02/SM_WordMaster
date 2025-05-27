import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Minus, Pencil } from "lucide-react"
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
import type { CEFRLevel, Word } from "@/lib/types"
import { Header } from "@/components/layout/header"

const ITEMS_PER_PAGE = 20
const baseURL = import.meta.env.VITE_API_BASE_URL

export default function AdminDashboard() {
  // 기본 상태들
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWords, setSelectedWords] = useState<Record<string, Word>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWords, setNewWords] = useState<
      Array<{ spelling: string; mean: string; level: CEFRLevel }>
  >([])
  const [editingWordId, setEditingWordId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [editField, setEditField] = useState<"spelling" | "mean" | null>(null)
  const [duplicateErrorIndex, setDuplicateErrorIndex] = useState<number | null>(
      null
  )
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [tempEditWord, setTempEditWord] = useState<Word | null>(null)
  const [isComposing, setIsComposing] = useState(false)

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = useMemo(
      () => Math.ceil(words.length / ITEMS_PER_PAGE),
      [words]
  )
  const pagedWords = useMemo(
      () =>
          words.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
          ),
      [words, currentPage]
  )

  // 추가/삭제/수정 로직 (기존 귀하의 코드를 그대로 유지)
  const validWords = newWords.filter(
      (w) => w.spelling.trim() !== "" && w.mean.trim() !== ""
  )
  const validWordCount = validWords.length

  const selectedWordArray = useMemo(
      () => Object.values(selectedWords),
      [selectedWords]
  )
  const selectedLevels = useMemo(
      () => new Set(selectedWordArray.map((w) => w.level)),
      [selectedWordArray]
  )
  const levelConflict = selectedLevels.size > 1

  const handleAddWordField = () =>
      setNewWords((prev) => [...prev, { spelling: "", mean: "", level: "A1" }])

  const handleRemoveWord = (index: number) => {
    const updated = [...newWords]
    updated.splice(index, 1)
    setNewWords(updated)
    if (duplicateErrorIndex === index) setDuplicateErrorIndex(null)
  }

  const handleEditClick = (word: Word) => {
    setEditingWord(word)
    setTempEditWord({ ...word })
  }

  const handleSaveEditedWord = async () => {
    // 1) 디버깅용 로그 추가
    console.log("🛠️ editingWord 전체:", editingWord)
    console.log("🛠️ editingWord.wordId:", editingWord?.wordId)
    if (!tempEditWord || !editingWord) return
    try {
      const res = await fetch(`${baseURL}/api/words/${editingWord.wordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spelling: editingWord.spelling,
          newSpelling: tempEditWord.spelling,
          newMean: tempEditWord.mean,
        }),
      })
      if (!res.ok) throw new Error("응답 실패")
      setWords((prev) =>
          prev.map((w) =>
              w.spelling === editingWord.spelling
                  ? { ...w, spelling: tempEditWord.spelling, mean: tempEditWord.mean }
                  : w
          )
      )
      setEditingWord(null)
      setTempEditWord(null)
    } catch (err) {
      console.error("수정 실패", err)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${baseURL}/api/words`)
        const json = await res.json()
        if (Array.isArray(json)) setWords(json)
      } catch (error) {
        console.error("에러", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p>단어를 불러오는 중입니다.</p>

  const handleSelectWord = (word: Word) =>
      setSelectedWords((prev) => {
        const updated = { ...prev }
        if (updated[word.spelling]) delete updated[word.spelling]
        else updated[word.spelling] = word
        return updated
      })

  const handleDeleteWords = async () => {
    if (
        Object.keys(selectedWords).length !== ITEMS_PER_PAGE ||
        levelConflict
    )
      return
    try {
      const spellingList = Object.values(selectedWords).map((w) => w.spelling)
      const queryString = spellingList
          .map((s) => `wordList=${encodeURIComponent(s)}`)
          .join("&")
      const res = await fetch(`${baseURL}/api/words?${queryString}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setWords((prev) =>
            prev.filter((w) => !spellingList.includes(w.spelling))
        )
        setSelectedWords({})
      } else console.error("삭제 실패", await res.text())
    } catch (e) {
      console.error("삭제 요청 중 오류 발생", e)
    }
  }

  const handleAddNewWord = async () => {
    if (newWords.length !== ITEMS_PER_PAGE) {
      alert(`${ITEMS_PER_PAGE}개 단위로 추가해주세요.`)
      return
    }
    try {
      await fetch(`${baseURL}/api/words/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWords),
      })
      setNewWords([])
      setIsAddDialogOpen(false)
      setWords([
        ...words,
        ...newWords.map((w, idx) => ({ ...w, wordId: Date.now() + idx })),
      ])
    } catch (e) {
      console.error("에러", e)
    }
  }

  const updateNewWord = (index: number, field: string, value: string) => {
    const updated = [...newWords]
    updated[index] = { ...updated[index], [field]: value }
    setNewWords(updated)
  }

  const handleDoubleClick = (
      id: number,
      field: "spelling" | "mean",
      value: string
  ) => {
    setEditingWordId(id)
    setEditField(field)
    setEditValue(value)
  }

  const handleCheckDuplicate = async (index: number, spelling: string) => {
    if (!spelling.trim()) return
    try {
      const res = await fetch(
          `${baseURL}/api/words/doesWordExist?spelling=${encodeURIComponent(
              spelling
          )}`
      )
      const json = await res.json()
      if (json.data === true) {
        const updated = [...newWords]
        updated[index] = { ...updated[index], spelling: "", mean: "" }
        setNewWords(updated)
        setDuplicateErrorIndex(index)
      } else {
        setDuplicateErrorIndex(null)
      }
    } catch (e) {
      console.error("중복 확인 실패", e)
    }
  }

  const handleEditSave = async () => {
    if (!editingWordId || !editField) return
    try {
      const res = await fetch(`${baseURL}/api/words/${editingWordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [editField]: editValue }),
      })
      const updated = await res.json()
      setWords((prev) =>
          prev.map((w) =>
              w.wordId === editingWordId ? updated : w
          )
      )
    } catch (e) {
      console.error("에러", e)
    } finally {
      setEditingWordId(null)
      setEditField(null)
      setEditValue("")
    }
  }

  return (
      <div className="space-y-6">
        <Header />

        {/* 상단 컨트롤 바 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
          <span className="text-sm text-muted-foreground">
            선택된 단어: {Object.keys(selectedWords).length}개
          </span>
            {Object.keys(selectedWords).length > 0 &&
                (levelConflict ||
                    Object.keys(selectedWords).length !== ITEMS_PER_PAGE) && (
                    <p className="text-sm text-red-500">
                      {levelConflict
                          ? `동일한 레벨의 단어만 삭제 가능합니다.`
                          : `${ITEMS_PER_PAGE}개를 정확히 선택해주세요`}
                    </p>
                )}
          </div>
          <h2 className="text-xl font-semibold">단어 관리</h2>
          <div className="flex gap-2">
            {/* 추가 버튼 */}
            <Dialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    title="추가 버튼"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 dark:text-white">
                <DialogHeader>
                  <DialogTitle>단어 추가</DialogTitle>
                  <DialogDescription>
                    20개 단위로 단어를 추가해주세요. 현재 {validWordCount}개 추가됨.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-4">
                  {newWords.map((word, index) => (
                      <div key={index} className="space-y-2">
                        <div className="grid grid-cols-13 gap-4 items-start">
                          {/* 영단어 입력 */}
                          <div className="col-span-5">
                            <div className="flex flex-col gap-1">
                              <Input
                                  placeholder="영단어"
                                  value={word.spelling}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[a-zA-Z\s]*$/.test(value)) {
                                      updateNewWord(index, "spelling", value);
                                    } else {
                                      updateNewWord(index, "spelling", "");
                                    }
                                  }}
                                  onBlur={(e) => handleCheckDuplicate(index, e.target.value)}
                              />
                              <div className="min-h-[1.25rem] ml-1">
                                {word.spelling && !/^[a-zA-Z\s]*$/.test(word.spelling) && (
                                    <p className="text-sm text-red-500">영어와 공백만 입력 가능합니다.</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 한글 뜻 입력 */}
                          <div className="col-span-5">
                            <div className="flex flex-col gap-1">
                              <Input
                                  placeholder="한글 뜻"
                                  value={word.mean}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // 조합 중이거나 유효한 값이면 반영
                                    if (isComposing || /^[가-힣\s]*$/.test(value)) {
                                      updateNewWord(index, "mean", value);
                                    }
                                  }}
                                  onCompositionStart={() => setIsComposing(true)}   // 조합 시작
                                  onCompositionEnd={(e) => {
                                    setIsComposing(false);                          // 조합 종료
                                    const value = e.currentTarget.value;
                                    // 조합이 끝났을 때 유효성 검사
                                    if (!/^[가-힣\s]*$/.test(value)) {
                                      updateNewWord(index, "mean", ""); // 유효하지 않으면 초기화
                                    }
                                  }}
                              />
                              <div className="min-h-[1.25rem] ml-1">
                                {word.mean && !/^[가-힣\s]*$/.test(word.mean) && (
                                    <p className="text-sm text-red-500">한글과 공백만 입력 가능합니다.</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 레벨 선택 */}
                          <div className="col-span-2">
                            <div className="flex flex-col gap-1">
                              <Select
                                  value={word.level}
                                  onValueChange={(value) => updateNewWord(index, "level", value)}
                              >
                                <SelectTrigger className="h-[40px]"> {/* 높이 고정 */}
                                  <SelectValue placeholder="레벨" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-700 dark:text-white">
                                  <SelectItem value="A1">A1</SelectItem>
                                  <SelectItem value="A2">A2</SelectItem>
                                  <SelectItem value="B1">B1</SelectItem>
                                  <SelectItem value="B2">B2</SelectItem>
                                  <SelectItem value="C1">C1</SelectItem>
                                  <SelectItem value="C2">C2</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="min-h-[1.25rem]" /> {/* 메시지 없지만 높이 유지 */}
                            </div>
                          </div>

                          {/* 삭제 버튼 */}
                          <div className="col-span-1 flex justify-end items-start pt-1">
                            <button
                                type="button"
                                onClick={() => handleRemoveWord(index)}
                                className="text-red-500 hover:text-red-700"
                                title="삭제"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* 중복 메시지 */}
                        <div className="min-h-[1.25rem] ml-1">
                          {duplicateErrorIndex === index && (
                              <p className="text-sm text-red-500">이미 존재하는 단어입니다.</p>
                          )}
                        </div>
                      </div>

                  ))}

                  {newWords.length < 20 && (
                      <Button
                          variant="outline"
                          onClick={handleAddWordField}
                          className="w-full"
                          disabled={newWords.length >= 20}
                      >
                        단어 추가 ({validWordCount}/20)
                      </Button>
                  )}
                </div>
                <DialogFooter>
                  <Button
                      onClick={handleAddNewWord}
                      disabled={validWordCount !== ITEMS_PER_PAGE}
                  >
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 삭제 버튼 */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={
                        Object.keys(selectedWords).length !== ITEMS_PER_PAGE ||
                        levelConflict
                    }
                    title="삭제 버튼"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              {/* AlertDialogContent 생략… */}
              <AlertDialogContent>
                <AlertDialogFooter>
                  <AlertDialogCancel>아니오</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteWords}>
                    네
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* 단어 테이블 (페이지네이션 적용) */}
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader key="header">
              <TableRow>
                <TableHead key="th-select" className="w-1/12 text-center px-2 py-1">선택</TableHead>
                <TableHead key="th-word"   className="w-3/12 text-center px-2 py-1">영단어</TableHead>
                <TableHead key="th-mean"   className="w-4/12 text-center px-2 py-1">뜻</TableHead>
                <TableHead key="th-level"  className="w-2/12 text-center px-2 py-1">레벨</TableHead>
                <TableHead key="th-action" className="w-2/12 text-center px-2 py-1">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody key="body">
              {pagedWords.map((word) => (
                  <TableRow key={word.wordId}>
                    <TableCell className="text-center px-2 py-1">
                      <Checkbox
                          checked={!!selectedWords[word.spelling]}
                          onCheckedChange={() =>
                              handleSelectWord(word)
                          }
                      />
                    </TableCell>
                    <TableCell className="text-center px-2 py-1">
                      {word.spelling}
                    </TableCell>
                    <TableCell className="text-center px-2 py-1">
                      {word.mean}
                    </TableCell>
                    <TableCell className="text-center px-2 py-1">
                      {word.level}
                    </TableCell>
                    <TableCell className="text-center px-2 py-1">
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(word)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 컨트롤 */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
          >
            첫 페이지
          </Button>
          <Button
              variant="outline"
              size="sm"
              onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
          >
            이전
          </Button>
          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1
            return (
                <Button
                    key={page}
                    variant={
                      page === currentPage ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
            )
          })}
          <Button
              variant="outline"
              size="sm"
              onClick={() =>
                  setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                  )
              }
              disabled={currentPage === totalPages}
          >
            다음
          </Button>
          <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
          >
            마지막
          </Button>
        </div>

        {/* 수정 다이얼로그 */}
        {editingWord && (
            <Dialog
                open={!!editingWord}
                onOpenChange={() => setEditingWord(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>단어 수정</DialogTitle>
                  <DialogDescription>
                    단어 정보를 수정해주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                      placeholder="영단어"
                      value={tempEditWord?.spelling || ""}
                      onChange={(e) => {
                        const v = e.target.value
                        setTempEditWord((prev) =>
                            prev ? { ...prev, spelling: v } : prev
                        )
                      }}
                  />
                  <Input
                      placeholder="한글 뜻"
                      value={tempEditWord?.mean || ""}
                      onChange={(e) => {
                        const v = e.target.value
                        setTempEditWord((prev) =>
                            prev ? { ...prev, mean: v } : prev
                        )
                      }}
                  />
                </div>
                <DialogFooter>
                  <Button
                      variant="outline"
                      onClick={() => setEditingWord(null)}
                  >
                    취소
                  </Button>
                  <Button onClick={handleSaveEditedWord}>
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        )}
      </div>
  )
}
