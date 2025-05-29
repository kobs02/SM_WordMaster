import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export default function AdminDashboard() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWords, setSelectedWords] = useState<Record<string, Word>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWords, setNewWords] = useState<Array<{ spelling: string; mean: string; level: CEFRLevel }>>([])
  const [editingWordId, setEditingWordId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [editField, setEditField] = useState<"spelling" | "mean" | null>(null)
  const [duplicateErrorIndex, setDuplicateErrorIndex] = useState<number | null>(null)
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [tempEditWord, setTempEditWord] = useState<Word | null>(null)
  const [isComposing, setIsComposing] = useState(false);
  const [duplicateSpelling, setDuplicateSpelling] = useState(false);


  const validWords = newWords.filter((w) => w.spelling.trim() !== "" && w.mean.trim() !== "")
  const validWordCount = validWords.length

  const selectedWordArray = useMemo(() => Object.values(selectedWords), [selectedWords])
  const selectedLevels = useMemo(() => new Set(selectedWordArray.map(w => w.level)), [selectedWordArray])
  const levelConflict = selectedLevels.size > 1

  const lastWord = newWords[newWords.length - 1];

  // 프론트엔드에서 새로 추가된 단어간 중복 여부 검사
  const isDuplicateSpelling = useMemo(() => {
    if (!lastWord?.spelling?.trim()) return false;

    const spellingSet = new Set(
      newWords
        .slice(0, -1)
        .map((word) => word.spelling?.trim().toLowerCase())
    );

    return spellingSet.has(lastWord.spelling.trim().toLowerCase());
  }, [newWords]);

  const isAddDisabled =
    !lastWord?.spelling?.trim() ||
    !/^[a-zA-Z\s]+$/.test(lastWord.spelling) ||
    !lastWord.mean?.trim() ||
    !/^[가-힣\s]+$/.test(lastWord.mean) ||
    !lastWord.level ||
    isDuplicateSpelling;

  const handleAddWordField = () => {
    setNewWords((prev) => [...prev, { spelling: "", mean: "", level: "A1" }])
  }

  const handleRemoveWord = (index: number) => {
    const updated = [...newWords]
    updated.splice(index, 1)
    setNewWords(updated)
    if (duplicateErrorIndex === index) {
      setDuplicateErrorIndex(null)
    }
  }

  const handleEditClick = (word: Word) => {
    setEditingWord(word)
    setTempEditWord({ ...word })
  }

  const handleSaveEditedWord = async () => {
    if (!tempEditWord || !editingWord) return;

    try {
      const res = await fetch(`/api/words`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spelling: editingWord.spelling,          // 기존 단어
          newSpelling: tempEditWord.spelling,      // 새 단어
          newMean: tempEditWord.mean               // 새 뜻
        }),
      });

      if (!res.ok) throw new Error("응답 실패");

      // 단어 목록 갱신
      const updatedWords = words.map((w) =>
        w.spelling === editingWord.spelling
          ? { ...w, spelling: tempEditWord.spelling, mean: tempEditWord.mean }
          : w
      );

      setWords(updatedWords);
      setEditingWord(null);
      setTempEditWord(null);
    } catch (err) {
      console.error("수정 실패", err);
    }
  };


  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(`/api/words`)
        const json = await res.json()
        if (Array.isArray(json)) setWords(json)
      } catch (error) {
        console.error("에러", error)
      } finally {
        setLoading(false)
      }
    }
    fetchWords()
  }, [])

  if (loading) return <p>단어를 불러오는 중입니다.</p>

  const handleSelectWord = (word: Word) => {
    setSelectedWords((prev) => {
      const updated = { ...prev }
      if (updated[word.spelling]) {
        delete updated[word.spelling]
      } else {
        updated[word.spelling] = word
      }
      return updated
    })
  }

  const handleDeleteWords = async () => {
    if (Object.keys(selectedWords).length !== 20 || levelConflict) return;

    console.log("hi");

    try {
      const spellingList = Object.values(selectedWords).map((word) => word.spelling);

      const queryString = spellingList.map((s) => `wordList=${encodeURIComponent(s)}`).join("&");

      const res = await fetch(`/api/words?${queryString}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWords((prev) => prev.filter((w) => !spellingList.includes(w.spelling)));
        setSelectedWords({});
      } else {
        console.error("삭제 실패", await res.text());
      }
    } catch (e) {
      console.error("삭제 요청 중 오류 발생", e);
    }
  };


  const handleAddNewWord = async () => {
    if (newWords.length !== 20) {
      alert("20개 단위로 추가해주세요.")
      return
    }

    try {
      await fetch(`/api/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWords),  // wordId는 포함 안됨
      })

      // 다시 조회하거나, 새로고침 또는 수동 추가 필요
      setNewWords([])
      setIsAddDialogOpen(false)

      // 선택사항: 새로고침 없이 words에 수동으로 추가하려면 아래 사용 가능
      setWords([...words, ...newWords.map((w, idx) => ({ ...w, wordId: Date.now() + idx }))])
    } catch (e) {
      console.error("에러", e)
    }
  }


  const updateNewWord = (index: number, field: string, value: string) => {
    const updated = [...newWords]
    updated[index] = { ...updated[index], [field]: value }
    setNewWords(updated)
  }

  const handleDoubleClick = (id: number, field: "spelling" | "mean", value: string) => {
    setEditingWordId(id)
    setEditField(field)
    setEditValue(value)
  }

  const handleCheckDuplicate = async (index: number, spelling: string) => {
    if (!spelling.trim()) return
    try {
      const res = await fetch(`/api/words/doesWordExist?spelling=${encodeURIComponent(spelling)}`)
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

  const handleCheckDuplicateSpelling = async (spelling: string) => {
    if (!spelling.trim()) return;

    if (spelling.trim().toLowerCase() === editingWord?.spelling.toLowerCase()) {
      setDuplicateSpelling(false); // 자기 자신은 중복 아님
      return;
    }

    try {
      const res = await fetch(`/api/words/doesWordExist?spelling=${encodeURIComponent(spelling)}`);
      const json = await res.json();
      setDuplicateSpelling(json.data === true);
    } catch (e) {
      console.error("중복 확인 실패", e);
      setDuplicateSpelling(false);
    }
  };


  const handleEditSave = async () => {
    if (!editingWordId || !editField) return
    try {
      const res = await fetch(`/api/words/${editingWordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [editField]: editValue }),
      })
      const updated = await res.json()
      setWords(words.map((w) => (w.wordId === editingWordId ? updated : w)))
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-muted-foreground">선택된 단어: {Object.keys(selectedWords).length}개</span>
                {Object.keys(selectedWords).length > 0 && (levelConflict || Object.keys(selectedWords).length !== 20) && (
                  <p className="text-sm text-red-500">
                    {levelConflict
                      ? `동일한 레벨의 단어만 삭제 가능합니다.`
                      : "정확히 20개를 선택해주세요"}
                  </p>
                )}
              </div>
              <h2 className="text-xl font-semibold text-center flex-1">단어 관리</h2>
              <div className="flex gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" title="추가 버튼">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white text-black">
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
                            <div>
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
                            <div>
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
                              <SelectContent className="bg-white text-black">
                                <SelectItem value="A1">A1</SelectItem>
                                <SelectItem value="A2">A2</SelectItem>
                                <SelectItem value="B1">B1</SelectItem>
                                <SelectItem value="B2">B2</SelectItem>
                                <SelectItem value="C1">C1</SelectItem>
                                <SelectItem value="C2">C2</SelectItem>
                              </SelectContent>
                            </Select>
                            <div/>
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
                      <div>
                        {duplicateErrorIndex === index ? (
                          <p className="text-sm text-red-500">이미 존재하는 단어입니다.</p>
                        ) : isDuplicateSpelling && index === newWords.length - 1 ? (
                          <p className="text-sm text-red-500">이미 추가된 단어입니다.</p>
                        ) : null}
                      </div>
                    </div>

                  ))}
                  {newWords.length < 20 && (
                    <Button
                      variant="outline"
                      onClick={handleAddWordField}
                      className="w-full"
                      disabled={newWords.length >= 20 || (newWords.length >= 1 && isAddDisabled)}
                    >
                      단어 추가 ({validWordCount}/20)
                    </Button>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleAddNewWord} disabled={validWordCount !== 20}>
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={Object.keys(selectedWords).length !== 20 || levelConflict}
                                title="삭제 버튼"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white text-black">
                              <AlertDialogHeader>
                                <AlertDialogTitle>단어 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  선택한 20개의 단어를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                                  아니오
                                </AlertDialogCancel>
                                <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600"
                                onClick={handleDeleteWords}>
                                  네
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>

                          </AlertDialog>
                        </div>
                      </div>
                    </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] text-center align-middle"><b>선택</b></TableHead>
              <TableHead className="w-[20%] text-center align-middle"><b>영단어</b></TableHead>
              <TableHead className="w-[20%] text-center align-middle"><b>한글 뜻</b></TableHead>
              <TableHead className="w-[20%] text-center align-middle"><b>레벨</b></TableHead>
              <TableHead className="w-[20%] text-center align-middle"><b>수정</b></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
           {words.map((word, index) => (
               <TableRow key={`${word.spelling}-${index}`}>
                 <TableCell>
                   <Checkbox
                       checked={word.spelling in selectedWords}
                       onCheckedChange={() => handleSelectWord(word)}
                     />
                 </TableCell>
                 <TableCell onDoubleClick={() => handleDoubleClick(word.wordId, "spelling", word.spelling)}>
                   {editingWordId === word.wordId && editField === "spelling" ? (
                     <Input
                       value={editValue}
                       onChange={(e) => setEditValue(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
                       autoFocus
                     />
                   ) : (
                     word.spelling
                   )}
                 </TableCell>
                 <TableCell onDoubleClick={() => handleDoubleClick(word.wordId, "mean", word.mean)}>
                   {editingWordId === word.wordId && editField === "mean" ? (
                     <Input
                       value={editValue}
                       onChange={(e) => setEditValue(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
                       autoFocus
                     />
                   ) : (
                     word.mean
                   )}
                 </TableCell>
                 <TableCell>{word.level}</TableCell>
                 <TableCell>
                   {/* 테이블 안에서 pencil 클릭 시 */}
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleEditClick(word)}
                     title="수정"
                   >
                     <Pencil className="h-4 w-4" />
                   </Button>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>

        </Table>
      </div>
      {/* 수정 다이얼로그 */}
            {editingWord && (
              <Dialog open={!!editingWord} onOpenChange={() => setEditingWord(null)}>
                <DialogContent className="bg-white text-black">
                  <DialogHeader>
                    <DialogTitle>단어 수정</DialogTitle>
                    <DialogDescription>단어 정보를 수정해주세요.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                        placeholder="영단어"
                        value={tempEditWord?.spelling || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setTempEditWord((prev) => prev && { ...prev, spelling: value });
                            handleCheckDuplicateSpelling(value);
                          } else {
                            setTempEditWord((prev) => prev && { ...prev, spelling: "" }); // 잘못된 입력 시 초기화
                            setDuplicateSpelling(false);
                          }
                        }}
                      />
                        {tempEditWord?.spelling && !/^[a-zA-Z\s]*$/.test(tempEditWord.spelling) ? (
                          <p className="text-sm text-red-500">영어와 공백만 입력 가능합니다.</p>
                        ) : duplicateSpelling ? (
                          <p className="text-sm text-red-500">이미 존재하는 단어입니다.</p>
                        ) : null}
                      <Input
                        placeholder="한글 뜻"
                        value={tempEditWord?.mean || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isComposing || /^[가-힣\s]*$/.test(value)) {
                            setTempEditWord((prev) => prev && { ...prev, mean: value });
                          }
                        }}
                        onCompositionStart={() => setIsComposing(true)} // 조합 시작
                        onCompositionEnd={(e) => {
                          setIsComposing(false); // 조합 종료
                          const value = e.currentTarget.value;
                          if (!/^[가-힣\s]*$/.test(value)) {
                            setTempEditWord((prev) => prev && { ...prev, mean: "" }); // 유효하지 않으면 초기화
                          }
                        }}
                      />
                      <div>
                        {tempEditWord?.mean && !/^[가-힣\s]*$/.test(tempEditWord.mean) && (
                          <p className="text-sm text-red-500">한글과 공백만 입력 가능합니다.</p>
                        )}
                      </div>
                    </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingWord(null)}>취소</Button>
                    <Button
                      onClick={handleSaveEditedWord}
                      disabled={
                        !tempEditWord?.spelling?.trim() ||
                        !tempEditWord?.mean?.trim() ||
                        duplicateSpelling
                      }
                    >
                      저장
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
    </div>
  )
}
