import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { mockWords } from "@/lib/mock-data"

export default function WrongAnswersPage() {
  const navigate = useNavigate()
  const [wrongAnswers, setWrongAnswers] = useState(
    mockWords.slice(0, 5).map((word) => ({ ...word, selected: false }))
  )

  const toggleSelect = (wordId: string) => {
    setWrongAnswers((prev) =>
      prev.map((word) =>
        word.id === wordId ? { ...word, selected: !word.selected } : word
      )
    )
  }

  const toggleSelectAll = (checked: boolean) => {
    setWrongAnswers((prev) =>
      prev.map((word) => ({ ...word, selected: checked }))
    )
  }

  const handleStartGame = () => {
    const selectedWords = wrongAnswers.filter((w) => w.selected).map((w) => w.word)
    if (selectedWords.length > 0) {
      localStorage.setItem("selectedWords", JSON.stringify(selectedWords))
      navigate("/game/bookmarked")
    } else {
      alert("게임을 시작하려면 단어를 선택해주세요.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">오답 노트</h1>

        <Card>
          <CardHeader>
            <CardTitle>틀린 단어 복습</CardTitle>
            <CardDescription>선택한 단어로 다시 게임할 수 있어요.</CardDescription>
          </CardHeader>
          <CardContent>
            {wrongAnswers.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <input
                          type="checkbox"
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                      </TableHead>
                      <TableHead>영단어</TableHead>
                      <TableHead>의미</TableHead>
                      <TableHead>레벨</TableHead>
                      <TableHead>틀린 횟수</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wrongAnswers.map((word) => (
                      <TableRow key={word.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={word.selected}
                            onChange={() => toggleSelect(word.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{word.word}</TableCell>
                        <TableCell>{word.meaning}</TableCell>
                        <TableCell>{word.level}</TableCell>
                        <TableCell>{Math.floor(Math.random() * 5) + 1}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="text-right mt-4">
                  <Button
                    onClick={handleStartGame}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    선택한 단어로 게임 시작
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">오답이 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
