import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import type { GameResult } from "@/lib/types"

interface HistoryGameButtonProps {
  game: GameResult
}

export default function HistoryGameButton({ game }: HistoryGameButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (game.level === "Daily") {
      navigate("/daily-game")
    } else if (game.unit) {
      navigate(`/game/${game.level}/unit/${game.unit}`)
    }
  }

  return (
    <Button
      variant="outline"
      className="h-24 flex flex-col items-center justify-center gap-1 p-2 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
      onClick={handleClick}
    >
      <div className="text-lg font-medium dark:text-gray-200">
        {game.level === "Daily" ? "일일 게임" : `${game.level} - Unit ${game.unit}`}
      </div>
      <div className="text-xs text-muted-foreground dark:text-gray-400">점수: {game.score}점</div>
      <div className="text-xs text-muted-foreground dark:text-gray-400">완료일: {game.date}</div>
      <div className="text-xs text-green-600 dark:text-green-400 mt-1">다시 도전하기</div>
    </Button>
  )
}
