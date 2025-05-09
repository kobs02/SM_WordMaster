import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import type { LearningUnit } from "@/lib/types"

interface HistoryUnitButtonProps {
  unit: LearningUnit
}

export default function HistoryUnitButton({ unit }: HistoryUnitButtonProps) {
  const navigate = useNavigate()

  return (
    <Button
      variant="outline"
      className="h-24 flex flex-col items-center justify-center gap-1 p-2 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      onClick={() => navigate(`/learn/${unit.level}/unit/${unit.unit}`)}
    >
      <div className="text-lg font-medium dark:text-gray-200">
        {unit.level} - Unit {unit.unit}
      </div>
      <div className="text-xs text-muted-foreground dark:text-gray-400">완료일: {unit.date}</div>
      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">다시 학습하기</div>
    </Button>
  )
}