import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import WordCard from "@/components/learn/word-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import type { Word } from "@/lib/types";

export default function LearnPage() {
  const { level, unitId } = useParams<{ level: string; unitId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookmarkStatus, setBookmarkStatus] = useState<string | null>(null);

  const currentWord = words[currentIndex];
  const isLastWord = currentIndex === words.length - 1;

  // 단어 목록 불러오기
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(`/api/words/by-level-unit?level=${level}&unit=${Number(unitId)}`);
        const data = await res.json();
        setWords(data);
      } catch (error) {
        console.error("단어 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, [level, unitId]);


  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1));
  const handleStartGame = () => navigate(`/game/${level}/unit/${unitId}`);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {level} - Unit {unitId} 학습
        </h1>

        {loading ? (
          <div>불러오는 중...</div>
        ) : words.length > 0 ? (
          <div className="space-y-6">
            <div className="text-right text-sm text-muted-foreground">
              {currentIndex + 1} / {words.length}
            </div>

            <WordCard
              word={currentWord}
              onBookmark={() => handleBookmark(currentWord.spelling)}
            />
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                이전
              </Button>

              {isLastWord ? (
                <Button variant="default" onClick={handleStartGame}>
                  게임 시작
                </Button>
              ) : (
                <Button variant="default" onClick={handleNext}>
                  다음
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            단어가 존재하지 않습니다.
          </div>
        )}
      </main>
    </div>
  );
}
