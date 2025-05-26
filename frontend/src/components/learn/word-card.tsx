import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Bookmark, RefreshCw } from "lucide-react";
import type { Word, Response } from "@/lib/types";
const baseURL = import.meta.env.VITE_API_BASE_URL;

interface WordCardProps {
  word: Word;
}

type SentenceState = {
  spelling: string;
  sentence: string;
  translation: string;
};

export default function WordCard({ word }: WordCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sentenceData, setSentenceData] = useState<SentenceState>({
    spelling: word.spelling,
    sentence: "",
    translation: "",
  });
  const [bookmarked, setBookmarked] = useState<boolean>();

  // ✅ 북마크 상태 확인
  useEffect(() => {
      if (!user) return;

    const fetchBookmarkStatus = async () => {
      try {
        const res = await fetch(
          `${baseURL}/api/bookmarks/isBookmarked?loginId=${encodeURIComponent(
            user?.loginId
          )}&spelling=${encodeURIComponent(word.spelling)}`
        );
        const json = await res.json();
        console.log(json.data);
        const isBookmarked = json.data;
        setBookmarked(isBookmarked);
      } catch (err) {
        console.error("북마크 상태 불러오기 실패:", err);
      }
    };

    fetchBookmarkStatus();
  }, [word.spelling, user?.loginId]);

  // ✅ 북마크 토글
  const handleBookmarkToggle = async () => {
    try {
        if (!user) return;
      // 먼저 optimistic UI 업데이트
      setBookmarked((prev) => !prev);
      const res = await fetch(`${baseURL}/api/bookmarks/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: user?.loginId,
          spelling: word.spelling,
        }),
      });

      const json = await res.json();
      console.log(json);
      console.log(json.data);
      setBookmarked(json.data);
    } catch (error) {
      console.error("북마크 토글 실패:", error);
    }
  };

  // ✅ 예문 생성
  const fetchSentence = async () => {
      if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/sentence/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginId: user.loginId, spelling: word.spelling }),
      });

      const data = await response.json();
      if (data.success) {
        setSentenceData(data.data);
      } else {
        setSentenceData({
          spelling: word.spelling,
          sentence: data.message,
          translation: "",
        });
      }
    } catch (error) {
      setSentenceData({
        spelling: word.spelling,
        sentence: "예문을 가져오는 데 실패했어요.",
        translation: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 단어 바뀔 때마다 예문 새로 요청
  useEffect(() => {
    fetchSentence();
  }, [word.spelling]);

  return (
    <Card className="w-full dark:border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{word.spelling}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            title="북마크"
            onClick={handleBookmarkToggle}
            className="h-8 w-8"
          >
            <Bookmark
              className={`h-5 w-5 transition-colors duration-300 ${
                bookmarked
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
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
            disabled={isLoading}
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
