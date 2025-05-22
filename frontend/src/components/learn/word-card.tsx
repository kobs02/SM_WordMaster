import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, RefreshCw } from "lucide-react"
import type { Word } from "@/lib/types"

interface WordCardProps {
  word: {
      wordId: number;
      spelling: string;
      mean: string;
      bookmarked: boolean;
    };
    onBookmark: (id: number) => void;
}

export default function WordCard({ word, onBookmark }: WordCardProps) {
  const [example, setExample] = useState<string>("예문을 불러오는 중입니다...")

  const fetchExample = async () => {
    try {
      const response = await fetch("/api/gpt/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: word.spelling }),
      })

      if (!response.ok) {
        throw new Error("예문 생성 실패")
      }

      const newExample: string = await response.text()
      setExample(newExample)
    } catch (error) {
      setExample("예문을 가져오는 데 실패했어요.")
    }
  }

  useEffect(() => {
    fetchExample()
  }, [word.spelling])

  return (
    <Card className="w-full dark:border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{word.spelling}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onBookmark(word.id)} className="h-8 w-8">
            <Bookmark
              className={`h-5 w-5 ${
                word.bookmarked ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
        <p className="text-xl dark:text-gray-200">{word.mean}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium dark:text-gray-300">예문</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchExample}
            className="h-8 w-8"
            title="새 예문 보기"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 bg-muted rounded-md dark:bg-gray-700 dark:text-gray-200">
          <p>{example}</p>
        </div>
      </CardContent>
    </Card>
  )
}
