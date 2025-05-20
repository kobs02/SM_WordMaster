import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Bookmark, RefreshCw } from "lucide-react"
import type { Word, Response } from "@/lib/types"

interface WordCardProps {
  word: Word
  onBookmark: (wordId: string) => void
}

type SentenceState = {
  word: string
  sentence: string
  translation: string
}

export default function WordCard({ word, onBookmark }: WordCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [sentenceData, setSentenceData] = useState<SentenceState>({
    word: word.word,
    sentence: null,
    translation: null,
  });

  const fetchSentence = async () => {
      setIsLoading(true); // 로딩 시작
    try {
      const response = await fetch("/api/sentence/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "email": user.loginId, "word": word.word }),
      });

      if (!response.ok) {
        throw new Error("예문 생성 실패");
      }

      const data: Response = await response.json();

      if (data.success)
          setSentenceData(data.data);
      else {
        setSentenceData({
           word: word.word,
           sentence: data.message,
           translation: "",
        });
      }
    } catch (error) {
      setSentenceData({
        word: word.word,
        sentence: "예문을 가져오는 데 실패했어요.",
        translation: "",
      });
    } finally {
        setIsLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchSentence();
  }, [word.word]);


  return (
    <Card className="w-full dark:border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{word.word}</CardTitle>

          <Button variant="ghost"
          size="icon"
          title="북마크"
          onClick={() => onBookmark(word.id)}
          className="h-8 w-8">
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
          <h3 className="text-sm font-medium dark:text-gray-300"></h3>
          <Button
            variant="ghost"
            size="icon"
            disabled = {isLoading}
            onClick={fetchSentence}
            className="h-8 w-8"
            title="새로운 예문 생성하기"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 bg-muted rounded-md dark:bg-gray-700 dark:text-gray-200">
          {isLoading ? (
              <p>예문 생성 중입니다.</p>
          ) : (
              <>
              <p>{sentenceData.sentence}</p>
              <p>{sentenceData.translation}</p>
              </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
