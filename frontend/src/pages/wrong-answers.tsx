import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import type { Word } from "@/lib/types"
const baseURL = import.meta.env.VITE_API_BASE_URL;

interface WrongAnswerDto {
  spelling: string;
  mean: string;
  level: string;
  count: number;
}

export default function WrongAnswersPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      if (!user) return;
    const fetchWrongAnswers = async () => {
      try {
        const res = await fetch(`${baseURL}/api/wrongAnswers?loginId=${encodeURIComponent(user.loginId)}`)
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setWrongAnswers(json.data)
        } else {
          console.warn("예상하지 못한 형식:", json)
        }
      } catch (error) {
        console.error("🚨 오답 노트 불러오기 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.loginId) fetchWrongAnswers()
  }, [user?.loginId])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">오답 노트</h1>

        <Card>
          <CardHeader>
            <CardTitle>틀린 단어 복습</CardTitle>
            <CardDescription>사용자가 틀린 단어와 횟수를 확인할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center">불러오는 중입니다...</div>
            ) : wrongAnswers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">영단어</TableHead>
                    <TableHead className="text-center">의미</TableHead>
                    <TableHead className="text-center">레벨</TableHead>
                    <TableHead className="text-center">틀린 횟수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wrongAnswers.map((word) => (
                    <TableRow key={word.spelling}>
                      <TableCell className="text-center font-medium">{word.spelling}</TableCell>
                      <TableCell className="text-center">{word.mean}</TableCell>
                      <TableCell className="text-center">{word.level}</TableCell>
                      <TableCell className="text-center">{word.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">오답이 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
